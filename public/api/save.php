<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Define a simple auth token
$AUTH_TOKEN = 'mhmtravels_admin_secret_2026';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    if (!isset($input['token']) || $input['token'] !== $AUTH_TOKEN) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    if (isset($input['action']) && $input['action'] === 'login') {
        echo json_encode(['success' => true]);
        exit;
    }

    if (isset($input['data'])) {
        $jsonData = json_encode($input['data'], JSON_PRETTY_PRINT);
        
        // Write to data.json in the same directory
        $result = file_put_contents('data.json', $jsonData);
        
        if ($result !== false) {
            echo json_encode(['success' => true, 'message' => 'Data saved successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save data. Check folder permissions.']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'No data provided']);
    }
} else {
    echo json_encode(['status' => 'MHM Travels API is running']);
}
?>
