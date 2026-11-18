<?php
/**
 * MHM Travels Backend API
 * Secure JSON data persistence with atomic file locking and validation.
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Master Admin Secret Token
$AUTH_TOKEN = 'mhmtravels_admin_secret_2026';
$DATA_FILE = __DIR__ . '/data.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    if (empty($rawInput)) {
        http_response_code(400);
        echo json_encode(['error' => 'Empty request body']);
        exit;
    }

    $input = json_decode($rawInput, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Malformed JSON: ' . json_last_error_msg()]);
        exit;
    }

    // Authentication verification
    $providedToken = $input['token'] ?? '';
    if (!hash_equals($AUTH_TOKEN, (string)$providedToken)) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized: Invalid token']);
        exit;
    }

    // Login verification action
    if (isset($input['action']) && $input['action'] === 'login') {
        echo json_encode(['success' => true, 'message' => 'Authenticated successfully']);
        exit;
    }

    // Data update actions
    if (isset($input['data']) && is_array($input['data'])) {
        $incomingData = $input['data'];

        // Read existing data to preserve any keys not included in update
        $existingData = [];
        if (file_exists($DATA_FILE)) {
            $rawExisting = file_get_contents($DATA_FILE);
            if (!empty($rawExisting)) {
                $decoded = json_decode($rawExisting, true);
                if (is_array($decoded)) {
                    $existingData = $decoded;
                }
            }
        }

        // Merge intelligently
        $mergedData = array_merge($existingData, $incomingData);

        // Sanitize & structure known entities
        if (isset($incomingData['packages']) && is_array($incomingData['packages'])) {
            $mergedData['packages'] = $incomingData['packages'];
        }
        if (isset($incomingData['destinations'])) {
            $mergedData['destinations'] = $incomingData['destinations'];
        }
        if (isset($incomingData['visaRecords']) && is_array($incomingData['visaRecords'])) {
            $mergedData['visaRecords'] = $incomingData['visaRecords'];
        }
        if (isset($incomingData['settings']) && is_array($incomingData['settings'])) {
            $mergedData['settings'] = $incomingData['settings'];
        }

        $jsonEncoded = json_encode($mergedData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if ($jsonEncoded === false) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to encode data to JSON']);
            exit;
        }

        // Atomic write with exclusive lock
        $fp = fopen($DATA_FILE, 'c+');
        if (!$fp) {
            http_response_code(500);
            echo json_encode(['error' => 'Unable to open data file for writing. Check permissions.']);
            exit;
        }

        if (flock($fp, LOCK_EX)) {
            ftruncate($fp, 0);
            rewind($fp);
            $bytesWritten = fwrite($fp, $jsonEncoded);
            fflush($fp);
            flock($fp, LOCK_UN);
            fclose($fp);

            if ($bytesWritten !== false) {
                echo json_encode([
                    'success' => true, 
                    'message' => 'Data saved successfully',
                    'bytes' => $bytesWritten,
                    'timestamp' => date('Y-m-d H:i:s')
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Write error occurred while saving data.']);
            }
        } else {
            fclose($fp);
            http_response_code(503);
            echo json_encode(['error' => 'Server busy: unable to acquire file lock. Please retry.']);
        }
        exit;
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Missing or invalid data payload']);
        exit;
    }
} else {
    // Health check
    echo json_encode([
        'status' => 'MHM Travels API is running',
        'php_version' => PHP_VERSION,
        'storage_accessible' => is_writable(__DIR__)
    ]);
}
?>
