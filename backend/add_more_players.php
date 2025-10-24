<?php
// Quick script to add more players for better PiP testing
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'tennis_db';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Adding more players for PiP demo...\n\n";
    
    // Add more players with different match_ids for variety
    $pdo->exec("
        INSERT INTO players (player_name, team, score, match_id) VALUES 
        ('Serena Williams', 'USA', '6', 102),
        ('Venus Williams', 'USA', '4', 102),
        ('Rafael Nadal', 'Spain', '7', 103),
        ('Novak Djokovic', 'Serbia', '5', 103)
    ");
    
    echo "✓ Added more players!\n";
    
    // Show current data
    echo "\nCurrent players in database:\n";
    $result = $pdo->query("SELECT * FROM players ORDER BY match_id");
    while ($row = $result->fetch()) {
        echo "Match {$row['match_id']}: {$row['player_name']} ({$row['team']}) - Score: {$row['score']}\n";
    }
    
    echo "\n✅ PiP should now show multiple matches!\n";
    echo "🔴 Visit http://localhost:3001 to see the floating PiP widget with live data\n";
    
} catch(PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>