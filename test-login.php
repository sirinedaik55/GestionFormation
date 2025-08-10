<?php

$url = 'http://localhost:8000/api/auth/login';
$data = [
    'email' => 'Syrine@formation.com',
    'password' => 'password123'
];

$options = [
    'http' => [
        'header' => "Content-type: application/json\r\n",
        'method' => 'POST',
        'content' => json_encode($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo "Response: " . $result . "\n";
?> 