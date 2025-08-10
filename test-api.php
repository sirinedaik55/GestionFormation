<?php

echo "Testing API login...\n";

$url = 'http://localhost:8000/api/auth/login';
$data = [
    'email' => 'trainer@test.com',
    'password' => 'password123'
];

echo "URL: $url\n";
echo "Data: " . json_encode($data) . "\n\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
if ($error) {
    echo "CURL Error: $error\n";
}

echo "Response: $response\n";

if ($response) {
    $decoded = json_decode($response, true);
    if ($decoded) {
        echo "\nDecoded response:\n";
        print_r($decoded);
        
        if (isset($decoded['data']['user']['role'])) {
            echo "\nUser role: " . $decoded['data']['user']['role'] . "\n";
        }
    }
}
?> 