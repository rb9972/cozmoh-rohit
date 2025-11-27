<?php
// Set the content type header to tell the browser this is JSON
header('Content-Type: application/json');

// --- 1. Database Connection Parameters (XAMPP Defaults) ---
$host = 'localhost';
$db   = 'cozmoh_v201'; // <-- Your database name
$user = 'root';        // Default XAMPP username
$pass = '';            // Default XAMPP password (empty)

// --- 2. Establish Connection and Query ---
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Query to fetch all template names and URLs from the 'templates' table
    $stmt = $pdo->query('SELECT name, url FROM templates ORDER BY name ASC');
    $templates = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // --- 3. Return Data as JSON ---
    echo json_encode($templates);

} catch (PDOException $e) {
    // Return an error if the database connection fails
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed. Check your XAMPP server.']);
}
?>