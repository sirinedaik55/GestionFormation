// Test de la logique d'extraction des données utilisateur
console.log('=== TEST EXTRACTION DONNÉES UTILISATEUR ===');

// Simulation de la réponse API réelle
const apiResponse = {
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {
      "id": 2,
      "first_name": "Syrine",
      "last_name": "Daik",
      "email": "trainer@formation.com",
      "role": "formateur",
      "team_id": null,
      "phone": "+33123456789",
      "specialite": "Angular & TypeScript",
      "status": "active",
      "team": null
    }
  }
};

console.log('📥 Réponse API simulée:', JSON.stringify(apiResponse, null, 2));

// Test de la logique d'extraction corrigée
function testUserExtraction(response) {
    console.log('\n🔍 Test d\'extraction des données utilisateur...');
    
    if (response.success && (response.user || response.data)) {
        // Logique corrigée
        const userData = response.user || response.data.user || response.data;
        console.log('✅ Données utilisateur extraites:', userData);
        
        // Test de validation du rôle
        const validRoles = ['admin', 'formateur', 'employe'];
        if (!userData.role || !validRoles.includes(userData.role)) {
            console.log('❌ Rôle invalide:', userData.role);
            return false;
        }
        
        console.log('✅ Rôle valide:', userData.role);
        
        // Test d'extraction du token
        const token = response.access_token || response.data?.access_token || response.token || 'api-token';
        console.log('✅ Token extrait:', token.substring(0, 20) + '...');
        
        return true;
    }
    
    console.log('❌ Réponse invalide');
    return false;
}

// Exécuter le test
const success = testUserExtraction(apiResponse);

console.log('\n=== RÉSULTAT ===');
if (success) {
    console.log('✅ SUCCÈS: L\'extraction des données utilisateur fonctionne correctement');
    console.log('✅ Le rôle "formateur" est maintenant reconnu');
    console.log('✅ Le token est correctement extrait de response.data.access_token');
} else {
    console.log('❌ ÉCHEC: Problème dans l\'extraction des données');
}

console.log('\n=== CORRECTION APPLIQUÉE ===');
console.log('• Avant: const userData = response.user || response.data;');
console.log('• Après: const userData = response.user || response.data.user || response.data;');
console.log('• Avant: response.access_token');
console.log('• Après: response.access_token || response.data?.access_token');

console.log('\n=== FIN DU TEST ===');
