<?php
/**
 * MHM Travels Automated Deployment Script
 * Unzips static build archive to web root with zero-downtime and preservation of dynamic data.
 */

// Allow adequate time and memory for extraction
set_time_limit(300);
ini_set('memory_limit', '256M');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Content-Type: application/json");

$SECRET_TOKEN = 'mhmtravels_admin_secret_2026';

// Health check when accessed without parameters
if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['token'])) {
    echo json_encode([
        'status' => 'MHM Travels Deployer ready',
        'php_version' => PHP_VERSION,
        'zip_supported' => class_exists('ZipArchive')
    ]);
    exit;
}

$token = $_POST['token'] ?? $_GET['token'] ?? '';
if ($token !== $SECRET_TOKEN) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized: Invalid token']);
    exit;
}

$webRoot = dirname(__DIR__); // /home/.../mhmtravels.in
$zipPath = null;

// Option 1: File uploaded directly via HTTP POST multipart
if (isset($_FILES['build_zip']) && $_FILES['build_zip']['error'] === UPLOAD_ERR_OK) {
    $zipPath = $webRoot . '/build_temp.zip';
    if (!move_uploaded_file($_FILES['build_zip']['tmp_name'], $zipPath)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to move uploaded build archive']);
        exit;
    }
}
// Option 2: Archive uploaded beforehand via FTP into web root
else if (file_exists($webRoot . '/build.zip')) {
    $zipPath = $webRoot . '/build.zip';
}
// Option 3: Archive placed inside api directory
else if (file_exists(__DIR__ . '/build.zip')) {
    $zipPath = __DIR__ . '/build.zip';
}

if (!$zipPath || !file_exists($zipPath)) {
    http_response_code(400);
    echo json_encode([
        'error' => 'No build archive found. Please provide build_zip file via POST or upload build.zip to root.'
    ]);
    exit;
}

// Ensure ZipArchive is available
if (!class_exists('ZipArchive')) {
    http_response_code(500);
    echo json_encode(['error' => 'ZipArchive extension is not enabled on this PHP server.']);
    exit;
}

$zip = new ZipArchive();
$openResult = $zip->open($zipPath);

if ($openResult !== TRUE) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not open zip archive', 'code' => $openResult]);
    exit;
}

// Preserve existing live data.json if it exists so user edits remain intact
$dataFile = __DIR__ . '/data.json';
$preservedData = null;
if (file_exists($dataFile)) {
    $preservedData = file_get_contents($dataFile);
}

// Extract all contents directly into web root
$extractResult = $zip->extractTo($webRoot);
$zip->close();

// Restore preserved data.json if it existed
if ($preservedData !== null) {
    @file_put_contents($dataFile, $preservedData);
}

// Clean up uploaded zip file
@unlink($zipPath);

if ($extractResult) {
    echo json_encode([
        'success' => true,
        'message' => 'MHM Travels static export deployed and extracted successfully!',
        'timestamp' => date('Y-m-d H:i:s'),
        'web_root' => $webRoot
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to extract archive contents. Check directory permissions.']);
}
