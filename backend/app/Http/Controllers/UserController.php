<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Affecter un employé à une équipe.
     */
    public function updateTeam(Request $request, User $user)
    {
        $validated = $request->validate([
            'team_id' => 'nullable|exists:teams,id',
        ]);
        $user->team_id = $validated['team_id'];
        $user->save();
        return response()->json($user);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Liste tous les utilisateurs, possibilité de filtrer par rôle
        $role = request()->query('role');
        if ($role) {
            $users = User::with('team')->where('role', $role)->get();
        } else {
            $users = User::with('team')->get();
        }
        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Crée un nouvel utilisateur (employé ou formateur)
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,formateur,employe',
            'team_id' => 'nullable|exists:teams,id',
            'phone' => 'nullable|string|max:20',
            'specialite' => 'nullable|string|max:255',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'room' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:active,inactive,pending',
        ]);
        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);
        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // Affiche un utilisateur spécifique
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Met à jour un utilisateur
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|nullable|string|min:6',
            'role' => 'sometimes|required|in:admin,formateur,employe',
            'team_id' => 'nullable|exists:teams,id',
            'phone' => 'nullable|string|max:20',
            'specialite' => 'nullable|string|max:255',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'room' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:active,inactive,pending',
        ]);
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }
        $user->update($validated);
        return response()->json($user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // Supprime un utilisateur
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé']);
    }
}
