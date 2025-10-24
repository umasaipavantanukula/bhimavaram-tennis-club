<?php
// --- MySQL Connection Details ---
$servername = "sql311.infinityfree.com";  // Your MySQL Hostname
$username = "if0_40196648";               // Your MySQL Username
// $password = "A3xmBYHNeYKV6I";             // Your MySQL Password
$dbname = "if0_40196648_tennis_db";       // Your Database Name
// --------------------------------

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // Set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully!";
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    die();
}
?>
