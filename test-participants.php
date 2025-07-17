<?php
require_once 'backend/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'backend/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Formation;
use App\Models\User;
use App\Models\FormationParticipant;

echo "========================================\n";
echo "TEST AFFECTATION PARTICIPANTS\n";
echo "========================================\n\n";

// 1. Récupérer la formation
$formation = Formation::first();
echo "Formation: " . $formation->name . " (Équipe ID: " . $formation->equipe_id . ")\n";

// 2. Récupérer les employés de l'équipe
$teamMembers = User::where('team_id', $formation->equipe_id)
                   ->where('role', 'employe')
                   ->get();

echo "Employés de l'équipe " . $formation->equipe_id . ": " . $teamMembers->count() . "\n";

foreach($teamMembers as $member) {
    echo "- " . $member->first_name . " " . $member->last_name . " (ID: " . $member->id . ")\n";
}

// 3. Affecter chaque employé à la formation
echo "\nAffectation des employés...\n";
foreach ($teamMembers as $employee) {
    $existing = FormationParticipant::where('formation_id', $formation->id)
                                   ->where('user_id', $employee->id)
                                   ->first();
    
    if (!$existing) {
        FormationParticipant::create([
            'formation_id' => $formation->id,
            'user_id' => $employee->id,
            'status' => 'registered',
            'notes' => 'Auto-assigned based on team membership'
        ]);
        echo "✅ Affecté: " . $employee->first_name . " " . $employee->last_name . "\n";
    } else {
        echo "⚠️ Déjà affecté: " . $employee->first_name . " " . $employee->last_name . "\n";
    }
}

// 4. Vérifier les participants
$participants = $formation->participants()->with('user')->get();
echo "\n🎉 Participants de la formation '" . $formation->name . "':\n";
foreach($participants as $participant) {
    echo "- " . $participant->user->first_name . " " . $participant->user->last_name . " (Status: " . $participant->status . ")\n";
}

echo "\nTotal participants: " . $participants->count() . "\n";
echo "\n========================================\n";
echo "Test terminé!\n";
echo "========================================\n";
?>
