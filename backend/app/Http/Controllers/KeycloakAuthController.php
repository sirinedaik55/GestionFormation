<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Middleware\KeycloakMiddleware;

class KeycloakAuthController extends Controller
{
    private $keycloakUrl;
    private $realm;
    private $clientId;
    private $clientSecret;

    public function __construct()
    {
        $this->keycloakUrl = env('KEYCLOAK_URL', 'http://localhost:8090');
        $this->realm = env('KEYCLOAK_REALM', 'formation');
        $this->clientId = env('KEYCLOAK_CLIENT_ID', 'formation-frontend');
        $this->clientSecret = env('KEYCLOAK_CLIENT_SECRET', 'formation-frontend-secret');
    }

    /**
     * Login with username/password (Direct Access Grant)
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        try {
            $response = Http::asForm()->post("{$this->keycloakUrl}/realms/{$this->realm}/protocol/openid_connect/token", [
                'grant_type' => 'password',
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'username' => $request->username,
                'password' => $request->password,
                'scope' => 'openid profile email'
            ]);

            if (!$response->successful()) {
                $error = $response->json();
                return response()->json([
                    'success' => false,
                    'message' => $error['error_description'] ?? 'Authentication failed'
                ], 401);
            }

            $tokenData = $response->json();

            // Get user info from token
            $userInfo = $this->getUserInfo($tokenData['access_token']);

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'access_token' => $tokenData['access_token'],
                    'refresh_token' => $tokenData['refresh_token'],
                    'expires_in' => $tokenData['expires_in'],
                    'token_type' => $tokenData['token_type'],
                    'user' => $userInfo
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication service error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Refresh access token
     */
    public function refresh(Request $request)
    {
        $request->validate([
            'refresh_token' => 'required|string',
        ]);

        try {
            $response = Http::asForm()->post("{$this->keycloakUrl}/realms/{$this->realm}/protocol/openid_connect/token", [
                'grant_type' => 'refresh_token',
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'refresh_token' => $request->refresh_token,
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token refresh failed'
                ], 401);
            }

            $tokenData = $response->json();

            return response()->json([
                'success' => true,
                'message' => 'Token refreshed successfully',
                'data' => [
                    'access_token' => $tokenData['access_token'],
                    'refresh_token' => $tokenData['refresh_token'],
                    'expires_in' => $tokenData['expires_in'],
                    'token_type' => $tokenData['token_type']
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token refresh error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->validate([
            'refresh_token' => 'required|string',
        ]);

        try {
            $response = Http::asForm()->post("{$this->keycloakUrl}/realms/{$this->realm}/protocol/openid_connect/logout", [
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'refresh_token' => $request->refresh_token,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Logout successful'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => true,
                'message' => 'Logout completed (with errors)'
            ]);
        }
    }

    /**
     * Get current user info
     */
    public function me(Request $request)
    {
        $user = KeycloakMiddleware::getUserFromToken($request);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user
            ]
        ]);
    }

    /**
     * Get user info from access token
     */
    private function getUserInfo(string $accessToken): array
    {
        try {
            $response = Http::withToken($accessToken)
                ->get("{$this->keycloakUrl}/realms/{$this->realm}/protocol/openid_connect/userinfo");

            if (!$response->successful()) {
                throw new \Exception('Failed to get user info');
            }

            $userInfo = $response->json();

            return [
                'id' => $userInfo['sub'],
                'username' => $userInfo['preferred_username'] ?? null,
                'email' => $userInfo['email'] ?? null,
                'name' => $userInfo['name'] ?? null,
                'first_name' => $userInfo['given_name'] ?? null,
                'last_name' => $userInfo['family_name'] ?? null,
                'roles' => $this->extractRoles($userInfo),
                'team' => $userInfo['team'] ?? null,
                'phone' => $userInfo['phone'] ?? null,
                'specialite' => $userInfo['specialite'] ?? null,
            ];

        } catch (\Exception $e) {
            return [
                'id' => null,
                'username' => null,
                'email' => null,
                'name' => null,
                'roles' => [],
            ];
        }
    }

    /**
     * Extract roles from user info
     */
    private function extractRoles(array $userInfo): array
    {
        // Roles can be in different places depending on Keycloak configuration
        if (isset($userInfo['realm_access']['roles'])) {
            return $userInfo['realm_access']['roles'];
        }

        if (isset($userInfo['roles'])) {
            return is_array($userInfo['roles']) ? $userInfo['roles'] : [$userInfo['roles']];
        }

        return [];
    }

    /**
     * Get Keycloak configuration for frontend
     */
    public function config()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'keycloak_url' => $this->keycloakUrl,
                'realm' => $this->realm,
                'client_id' => $this->clientId,
                'auth_url' => "{$this->keycloakUrl}/realms/{$this->realm}/protocol/openid_connect/auth",
                'token_url' => "{$this->keycloakUrl}/realms/{$this->realm}/protocol/openid_connect/token",
                'userinfo_url' => "{$this->keycloakUrl}/realms/{$this->realm}/protocol/openid_connect/userinfo",
                'logout_url' => "{$this->keycloakUrl}/realms/{$this->realm}/protocol/openid_connect/logout",
            ]
        ]);
    }

    /**
     * Mock login for development (when Keycloak is not available)
     */
    public function mockLogin(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Mock users for development
        $mockUsers = [
            'admin@formation.com' => [
                'password' => 'admin123',
                'user' => [
                    'id' => '1',
                    'username' => 'admin@formation.com',
                    'email' => 'admin@formation.com',
                    'name' => 'Administrator',
                    'first_name' => 'Admin',
                    'last_name' => 'User',
                    'roles' => ['admin'],
                    'team' => 'Administration'
                ]
            ],
            'trainer@formation.com' => [
                'password' => 'trainer123',
                'user' => [
                    'id' => '2',
                    'username' => 'trainer@formation.com',
                    'email' => 'trainer@formation.com',
                    'name' => 'Trainer User',
                    'first_name' => 'Trainer',
                    'last_name' => 'User',
                    'roles' => ['trainer'],
                    'team' => 'Training',
                    'specialite' => 'IT Training'
                ]
            ],
            'employee@formation.com' => [
                'password' => 'employee123',
                'user' => [
                    'id' => '3',
                    'username' => 'employee@formation.com',
                    'email' => 'employee@formation.com',
                    'name' => 'Employee User',
                    'first_name' => 'Employee',
                    'last_name' => 'User',
                    'roles' => ['employee'],
                    'team' => 'Development'
                ]
            ]
        ];

        $username = $request->username;
        $password = $request->password;

        if (!isset($mockUsers[$username]) || $mockUsers[$username]['password'] !== $password) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Generate mock tokens
        $accessToken = base64_encode(json_encode([
            'user' => $mockUsers[$username]['user'],
            'exp' => time() + 3600, // 1 hour
            'iat' => time()
        ]));

        $refreshToken = base64_encode(json_encode([
            'user_id' => $mockUsers[$username]['user']['id'],
            'exp' => time() + 86400, // 24 hours
            'iat' => time()
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Login successful (Mock Mode)',
            'data' => [
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
                'expires_in' => 3600,
                'token_type' => 'Bearer',
                'user' => $mockUsers[$username]['user']
            ]
        ]);
    }

    /**
     * Mock configuration for development
     */
    public function mockConfig()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'keycloak_url' => 'http://localhost:8090',
                'realm' => 'formation',
                'client_id' => 'formation-frontend',
                'auth_url' => 'http://localhost:8090/realms/formation/protocol/openid_connect/auth',
                'token_url' => 'http://localhost:8090/realms/formation/protocol/openid_connect/token',
                'userinfo_url' => 'http://localhost:8090/realms/formation/protocol/openid_connect/userinfo',
                'logout_url' => 'http://localhost:8090/realms/formation/protocol/openid_connect/logout',
                'mock_mode' => true
            ]
        ]);
    }

    /**
     * Validate token endpoint
     */
    public function validateToken(Request $request)
    {
        $user = KeycloakMiddleware::getUserFromToken($request);

        return response()->json([
            'success' => true,
            'message' => 'Token is valid',
            'data' => [
                'user' => $user
            ]
        ]);
    }
}
