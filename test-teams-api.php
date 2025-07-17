<?php
echo "========================================\n";
echo "TESTING TEAMS API\n";
echo "========================================\n\n";

// Test GET /api/teams
echo "1. Testing GET /api/teams:\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/teams');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
if ($error) {
    echo "cURL Error: $error\n";
}
echo "Response: $response\n\n";

if ($httpCode === 200) {
    $teams = json_decode($response, true);
    if (empty($teams)) {
        echo "2. No teams found. Creating test teams...\n";
        
        // Create test team
        $testTeam = [
            'name' => 'Development Team',
            'speciality' => 'Web Development'
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/teams');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testTeam));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json'
        ]);
        $createResponse = curl_exec($ch);
        $createHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        echo "Create team HTTP Code: $createHttpCode\n";
        echo "Create team Response: $createResponse\n\n";
        
        // Test GET again
        echo "3. Testing GET /api/teams again:\n";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/teams');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
        $response2 = curl_exec($ch);
        $httpCode2 = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        echo "HTTP Code: $httpCode2\n";
        echo "Response: $response2\n";
    } else {
        echo "✅ Found " . count($teams) . " teams\n";
        foreach ($teams as $team) {
            echo "- ID: {$team['id']}, Name: {$team['name']}, Speciality: {$team['speciality']}\n";
        }
    }
} else {
    echo "❌ API teams not working properly\n";
}

echo "\n========================================\n";
echo "Test completed.\n";
echo "========================================\n";
?>
