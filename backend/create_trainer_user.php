<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\Hash;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Import models
use App\Models\User;

try {
    // Vérifier si l'utilisateur existe déjà
    $user = User::where('email', 'trainer@formation.com')->first();
    
    if (!$user) {
        echo "Création de l'utilisateur formateur...\n";
        
        $user = User::create([
            'first_name' => 'Syrine',
            'last_name' => 'Daik',
            'email' => 'trainer@formation.com',
            'password' => Hash::make('trainer123'),
            'role' => 'formateur',
            'specialite' => 'Angular & TypeScript',
            'phone' => '+33123456789',
            'status' => 'active'
        ]);
        
        echo "✅ Utilisateur formateur créé avec succès!\n";
    } else {
        echo "Utilisateur trouvé: {$user->first_name} {$user->last_name}\n";
        echo "Email: {$user->email}\n";
        echo "Rôle actuel: {$user->role}\n";
        
        // Mettre à jour le rôle si nécessaire
        if ($user->role !== 'formateur') {
            $user->update(['role' => 'formateur']);
            echo "✅ Rôle mis à jour vers 'formateur'\n";
        } else {
            echo "✅ Le rôle est déjà correct\n";
        }
    }
    
    echo "\n=== INFORMATIONS DE CONNEXION ===\n";
    echo "Email: trainer@formation.com\n";
    echo "Mot de passe: trainer123\n";
    echo "Rôle: formateur\n";
    echo "==================================\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
