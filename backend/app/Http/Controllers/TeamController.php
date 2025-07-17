<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index()
    {
        return Team::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'speciality' => 'nullable|string|max:255',
        ]);
        $team = Team::create($validated);
        return response()->json($team, 201);
    }

    public function show(Team $team)
    {
        return $team;
    }

    public function update(Request $request, Team $team)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'speciality' => 'nullable|string|max:255',
        ]);
        $team->update($validated);
        return response()->json($team);
    }

    public function destroy(Team $team)
    {
        $team->delete();
        return response()->json(null, 204);
    }
}
