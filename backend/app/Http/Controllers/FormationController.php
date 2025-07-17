<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Formation;
use App\Models\FormationParticipant;
use App\Models\User;

class FormationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Formation::with(['equipe', 'formateur'])->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'duree' => 'required|integer',
            'equipe_id' => 'required|exists:teams,id',
            'formateur_id' => 'required|exists:users,id',
            'room' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:active,completed,cancelled,pending',
        ]);
        $formation = Formation::create($validated);

        // Affectation automatique de tous les employés de l'équipe
        $this->assignTeamMembersToFormation($formation);

        // Charger la formation avec ses participants pour la réponse
        $formation->load(['participants.user', 'equipe', 'formateur']);

        return response()->json($formation, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $formation = Formation::with(['equipe', 'formateur'])->findOrFail($id);
        return response()->json($formation);
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
        $formation = Formation::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'sometimes|required|date',
            'duree' => 'sometimes|required|integer',
            'equipe_id' => 'sometimes|required|exists:teams,id',
            'formateur_id' => 'sometimes|required|exists:users,id',
            'room' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:active,completed,cancelled,pending',
        ]);
        $formation->update($validated);
        return response()->json($formation);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $formation = Formation::findOrFail($id);
        $formation->delete();
        return response()->json(['message' => 'Formation supprimée']);
    }

    /**
     * Affecter automatiquement tous les employés de l'équipe à la formation
     */
    private function assignTeamMembersToFormation(Formation $formation)
    {
        // Récupérer tous les employés de l'équipe (rôle 'employe')
        $teamMembers = User::where('team_id', $formation->equipe_id)
                          ->where('role', 'employe')
                          ->get();

        foreach ($teamMembers as $employee) {
            FormationParticipant::create([
                'formation_id' => $formation->id,
                'user_id' => $employee->id,
                'status' => 'registered', // Participation obligatoire
                'notes' => 'Auto-assigned based on team membership'
            ]);
        }
    }

    /**
     * Obtenir les participants d'une formation
     */
    public function getParticipants($id)
    {
        $formation = Formation::with(['participants.user.team'])->findOrFail($id);
        return response()->json($formation->participants);
    }

    /**
     * Mettre à jour le statut d'un participant
     */
    public function updateParticipantStatus(Request $request, $formationId, $participantId)
    {
        $validated = $request->validate([
            'status' => 'required|in:registered,confirmed,cancelled',
            'attendance' => 'nullable|in:present,absent,pending',
            'notes' => 'nullable|string'
        ]);

        $participant = FormationParticipant::where('formation_id', $formationId)
                                          ->where('user_id', $participantId)
                                          ->firstOrFail();

        $participant->update($validated);

        return response()->json($participant->load('user'));
    }
}
