<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UserManagementController extends Controller
{
    /**
     * Get all users with pagination
     */
    public function index(Request $request)
    {
        try {
            $query = User::with('team');

            // Filter by role
            if ($request->has('role') && $request->role) {
                $query->where('role', $request->role);
            }

            // Filter by status
            if ($request->has('status') && $request->status) {
                $query->where('status', $request->status);
            }

            // Search by name or email
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $users = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $users
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching users: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new user
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'role' => 'required|in:admin,formateur,employe',
                'team_id' => 'nullable|exists:teams,id',
                'phone' => 'nullable|string|max:20',
                'specialite' => 'nullable|string|max:255',
                'send_invitation' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Generate temporary password
            $temporaryPassword = Str::random(12);

            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($temporaryPassword),
                'role' => $request->role,
                'team_id' => $request->team_id,
                'phone' => $request->phone,
                'specialite' => $request->specialite,
                'status' => 'active'
            ]);

            // Send invitation email if requested
            if ($request->get('send_invitation', true)) {
                $this->sendInvitationEmail($user, $temporaryPassword);
            }

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user->load('team'),
                'temporary_password' => $temporaryPassword // Only for admin to see
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'first_name' => 'sometimes|required|string|max:255',
                'last_name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|email|unique:users,email,' . $id,
                'role' => 'sometimes|required|in:admin,formateur,employe',
                'team_id' => 'nullable|exists:teams,id',
                'phone' => 'nullable|string|max:20',
                'specialite' => 'nullable|string|max:255',
                'status' => 'sometimes|required|in:active,inactive'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user->update($request->only([
                'first_name', 'last_name', 'email', 'role', 
                'team_id', 'phone', 'specialite', 'status'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user->load('team')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete user
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            
            // Prevent deleting the last admin
            if ($user->role === 'admin' && User::where('role', 'admin')->count() <= 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete the last administrator'
                ], 400);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reset user password
     */
    public function resetPassword(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
            
            $newPassword = Str::random(12);
            $user->update([
                'password' => Hash::make($newPassword)
            ]);

            // Send new password email
            $this->sendPasswordResetEmail($user, $newPassword);

            return response()->json([
                'success' => true,
                'message' => 'Password reset successfully',
                'temporary_password' => $newPassword
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error resetting password: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user statistics
     */
    public function statistics()
    {
        try {
            $stats = [
                'total_users' => User::count(),
                'active_users' => User::where('status', 'active')->count(),
                'inactive_users' => User::where('status', 'inactive')->count(),
                'by_role' => [
                    'admin' => User::where('role', 'admin')->count(),
                    'formateur' => User::where('role', 'formateur')->count(),
                    'employe' => User::where('role', 'employe')->count(),
                ],
                'recent_logins' => User::whereNotNull('last_login_at')
                    ->orderBy('last_login_at', 'desc')
                    ->limit(5)
                    ->get(['id', 'first_name', 'last_name', 'email', 'last_login_at'])
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send invitation email (placeholder)
     */
    private function sendInvitationEmail($user, $password)
    {
        // TODO: Implement email sending
        // For now, just log the credentials
        \Log::info('User invitation', [
            'email' => $user->email,
            'password' => $password,
            'name' => $user->first_name . ' ' . $user->last_name
        ]);
    }

    /**
     * Send password reset email (placeholder)
     */
    private function sendPasswordResetEmail($user, $password)
    {
        // TODO: Implement email sending
        \Log::info('Password reset', [
            'email' => $user->email,
            'password' => $password,
            'name' => $user->first_name . ' ' . $user->last_name
        ]);
    }
}
