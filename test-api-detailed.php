<?php
echo "========================================\n";
echo "DETAILED API TEST FOR TRAINER CREATION\n";
echo "========================================\n\n";

// Test data - exactly what frontend sends
$trainerData = [
    'first_name' => 'Daik',
    'last_name' => 'Syrine',
    'email' => 'syrinedaik@gmail.com',
    'password' => 'defaultPassword123',
    'role' => 'formateur',
    'phone' => null,
    'specialite' => 'Deep Learning'
];

echo "1. Testing trainer creation with data:\n";
echo json_encode($trainerData, JSON_PRETTY_PRINT) . "\n\n";

// Initialize cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/users');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($trainerData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

// Execute request
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "2. Response details:\n";
echo "HTTP Code: $httpCode\n";
if ($error) {
    echo "cURL Error: $error\n";
}
echo "Response Body:\n";
echo $response . "\n\n";

// Parse response
$responseData = json_decode($response, true);

if ($httpCode === 201) {
    echo "✅ SUCCESS: Trainer created successfully!\n";
    if (isset($responseData['id'])) {
        echo "Created trainer ID: " . $responseData['id'] . "\n";
        
        // Test getting the created trainer
        echo "\n3. Testing GET request for created trainer:\n";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/users/' . $responseData['id']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
        $getResponse = curl_exec($ch);
        $getHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        echo "GET Response ($getHttpCode):\n";
        echo $getResponse . "\n\n";
        
        // Clean up - delete test trainer
        echo "4. Cleaning up - deleting test trainer:\n";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/users/' . $responseData['id']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
        $deleteResponse = curl_exec($ch);
        $deleteHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        echo "DELETE Response ($deleteHttpCode): $deleteResponse\n";
    }
} else {
    echo "❌ ERROR: Failed to create trainer\n";
    
    if ($responseData) {
        if (isset($responseData['message'])) {
            echo "Error Message: " . $responseData['message'] . "\n";
        }
        if (isset($responseData['errors'])) {
            echo "Validation Errors:\n";
            foreach ($responseData['errors'] as $field => $errors) {
                echo "  $field: " . implode(', ', $errors) . "\n";
            }
        }
        if (isset($responseData['exception'])) {
            echo "Exception: " . $responseData['exception'] . "\n";
        }
        if (isset($responseData['file'])) {
            echo "File: " . $responseData['file'] . "\n";
        }
        if (isset($responseData['line'])) {
            echo "Line: " . $responseData['line'] . "\n";
        }
    }
}

echo "\n========================================\n";
echo "Test completed.\n";
echo "========================================\n";
?>
