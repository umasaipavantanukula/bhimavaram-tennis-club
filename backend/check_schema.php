<?php
// Script to check the actual structure of tennis_db tables

$host = 'localhost';
$username = 'root';
$password = '';
$database = 'tennis_db';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Checking tennis_db structure...\n\n";
    
    // Check matches table structure
    echo "=== MATCHES TABLE STRUCTURE ===\n";
    $result = $pdo->query("DESCRIBE matches");
    $matches_columns = [];
    while ($row = $result->fetch()) {
        echo "{$row['Field']} ({$row['Type']}) - {$row['Null']}\n";
        $matches_columns[] = $row['Field'];
    }
    
    echo "\n=== PLAYERS TABLE STRUCTURE ===\n";
    $result = $pdo->query("DESCRIBE players");
    $players_columns = [];
    while ($row = $result->fetch()) {
        echo "{$row['Field']} ({$row['Type']}) - {$row['Null']}\n";
        $players_columns[] = $row['Field'];
    }
    
    echo "\n=== AVAILABLE COLUMNS ===\n";
    echo "Matches columns: " . implode(', ', $matches_columns) . "\n";
    echo "Players columns: " . implode(', ', $players_columns) . "\n";
    
} catch(PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
}
?>