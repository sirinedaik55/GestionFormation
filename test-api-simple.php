<?php
// Simple PHP script to test the API directly
echo "Testing Laravel API...\n\n";

// Test 1: Check if server is running
echo "1. Testing server connection...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/users');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo "✅ Server is running\n";
    echo "Response: " . substr($response, 0, 100) . "...\n\n";
} else {
    echo "❌ Server not responding (HTTP $httpCode)\n";
    echo "Response: $response\n\n";
    exit(1);
}

// Test 2: Try to create a trainer
echo "2. Testing trainer creation...\n";
$trainerData = [
    'first_name' => 'Test',
    'last_name' => 'Trainer',
    'email' => 'test.trainer.' . time() . '@example.com',
    'password' => 'password123',
    'role' => 'formateur',
    'phone' => '1234567890',
    'specialite' => 'Web Development'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/users');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($trainerData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n\n";

if ($httpCode === 201) {
    echo "✅ Trainer created successfully!\n";
    $responseData = json_decode($response, true);
    if (isset($responseData['id'])) {
        echo "Created trainer ID: " . $responseData['id'] . "\n";
        
        // Clean up - delete the test trainer
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/users/' . $responseData['id']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
        curl_exec($ch);
        curl_close($ch);
        echo "Test trainer deleted.\n";
    }
} else {
    echo "❌ Failed to create trainer\n";
    $errorData = json_decode($response, true);
    if (isset($errorData['errors'])) {
        echo "Validation errors:\n";
        foreach ($errorData['errors'] as $field => $errors) {
            echo "  $field: " . implode(', ', $errors) . "\n";
        }
    }
}

echo "\nTest completed.\n";
?>
