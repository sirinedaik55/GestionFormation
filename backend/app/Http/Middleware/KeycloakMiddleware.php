<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class KeycloakMiddleware
{
    private $keycloakUrl;
    private $realm;

    public function __construct()
    {
        $this->keycloakUrl = env('KEYCLOAK_URL', 'http://localhost:8090');
        $this->realm = env('KEYCLOAK_REALM', 'formation');
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $token = $this->extractToken($request);

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Token not provided'
            ], 401);
        }

        try {
            $payload = $this->validateToken($token);
            
            // Add user info to request
            $request->merge(['keycloak_user' => $payload]);
            
            // Check roles if specified
            if (!empty($roles) && !$this->hasRequiredRole($payload, $roles)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient permissions. Required roles: ' . implode(', ', $roles)
                ], 403);
            }

            return $next($request);

        } catch (ExpiredException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token has expired'
            ], 401);
        } catch (SignatureInvalidException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token signature is invalid'
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token validation failed: ' . $e->getMessage()
            ], 401);
        }
    }

    /**
     * Extract token from request
     */
    private function extractToken(Request $request): ?string
    {
        $authHeader = $request->header('Authorization');
        
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return null;
        }

        return substr($authHeader, 7);
    }

    /**
     * Validate JWT token with Keycloak
     */
    private function validateToken(string $token): object
    {
        // Check if this is a mock token (base64 encoded JSON)
        if ($this->isMockToken($token)) {
            return $this->validateMockToken($token);
        }

        // Get public key from Keycloak
        $publicKey = $this->getKeycloakPublicKey();

        // Decode and validate token
        $payload = JWT::decode($token, new Key($publicKey, 'RS256'));

        // Additional validations
        $this->validateTokenClaims($payload);

        return $payload;
    }

    /**
     * Check if token is a mock token
     */
    private function isMockToken(string $token): bool
    {
        try {
            $decoded = base64_decode($token);
            $data = json_decode($decoded, true);
            return is_array($data) && isset($data['user']) && isset($data['exp']);
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Validate mock token
     */
    private function validateMockToken(string $token): object
    {
        try {
            $decoded = base64_decode($token);
            $data = json_decode($decoded, true);

            if (!$data || !isset($data['user']) || !isset($data['exp'])) {
                throw new \Exception('Invalid mock token format');
            }

            // Check expiration
            if ($data['exp'] < time()) {
                throw new ExpiredException('Mock token has expired');
            }

            // Convert to object format expected by the rest of the middleware
            $user = $data['user'];
            return (object) [
                'sub' => $user['id'],
                'preferred_username' => $user['username'],
                'email' => $user['email'],
                'name' => $user['name'],
                'given_name' => $user['first_name'],
                'family_name' => $user['last_name'],
                'realm_access' => (object) [
                    'roles' => $user['roles']
                ],
                'team' => $user['team'] ?? null,
                'phone' => $user['phone'] ?? null,
                'specialite' => $user['specialite'] ?? null,
                'exp' => $data['exp'],
                'iat' => $data['iat']
            ];
        } catch (\Exception $e) {
            throw new \Exception('Failed to validate mock token: ' . $e->getMessage());
        }
    }

    /**
     * Get Keycloak public key (cached)
     */
    private function getKeycloakPublicKey(): string
    {
        $cacheKey = 'keycloak_public_key_' . $this->realm;

        return Cache::remember($cacheKey, 3600, function () {
            try {
                $response = Http::timeout(5)->get("{$this->keycloakUrl}/realms/{$this->realm}/protocol/openid_connect/certs");

                if (!$response->successful()) {
                    throw new \Exception('Failed to fetch Keycloak public key - HTTP ' . $response->status());
                }

                $keys = $response->json()['keys'];

                if (empty($keys)) {
                    throw new \Exception('No public keys found');
                }

                // Get the first key (you might want to select by 'kid' in production)
                $key = $keys[0];

                // Convert JWK to PEM format
                return $this->jwkToPem($key);
            } catch (\Exception $e) {
                throw new \Exception('Keycloak is not available: ' . $e->getMessage());
            }
        });
    }

    /**
     * Convert JWK to PEM format
     */
    private function jwkToPem(array $jwk): string
    {
        if (!isset($jwk['n']) || !isset($jwk['e'])) {
            throw new \Exception('Invalid JWK format');
        }

        $n = $this->base64UrlDecode($jwk['n']);
        $e = $this->base64UrlDecode($jwk['e']);

        // Create RSA public key
        $rsa = new \phpseclib3\Crypt\RSA();
        $rsa = $rsa->withModulus(new \phpseclib3\Math\BigInteger($n, 256));
        $rsa = $rsa->withPublicExponent(new \phpseclib3\Math\BigInteger($e, 256));

        return $rsa->toString('PKCS8');
    }

    /**
     * Base64 URL decode
     */
    private function base64UrlDecode(string $data): string
    {
        return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
    }

    /**
     * Validate token claims
     */
    private function validateTokenClaims(object $payload): void
    {
        $now = time();
        
        // Check expiration
        if (isset($payload->exp) && $payload->exp < $now) {
            throw new ExpiredException('Token has expired');
        }
        
        // Check not before
        if (isset($payload->nbf) && $payload->nbf > $now) {
            throw new \Exception('Token not yet valid');
        }
        
        // Check issuer
        $expectedIssuer = "{$this->keycloakUrl}/realms/{$this->realm}";
        if (isset($payload->iss) && $payload->iss !== $expectedIssuer) {
            throw new \Exception('Invalid token issuer');
        }
    }

    /**
     * Check if user has required role
     */
    private function hasRequiredRole(object $payload, array $requiredRoles): bool
    {
        $userRoles = $payload->realm_access->roles ?? [];
        
        foreach ($requiredRoles as $role) {
            if (in_array($role, $userRoles)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Get user info from token payload
     */
    public static function getUserFromToken(Request $request): ?array
    {
        $payload = $request->get('keycloak_user');
        
        if (!$payload) {
            return null;
        }
        
        return [
            'id' => $payload->sub,
            'username' => $payload->preferred_username ?? null,
            'email' => $payload->email ?? null,
            'name' => $payload->name ?? null,
            'first_name' => $payload->given_name ?? null,
            'last_name' => $payload->family_name ?? null,
            'roles' => $payload->realm_access->roles ?? [],
            'team' => $payload->team ?? null,
            'phone' => $payload->phone ?? null,
            'specialite' => $payload->specialite ?? null,
        ];
    }
}
