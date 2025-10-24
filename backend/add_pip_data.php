<?php
// Add sample data specifically for floating PiP testing
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'tennis_db';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Adding matches and updating players for PiP...\n\n";
    
    // First, let's see what structure matches table has
    echo "Checking matches table structure...\n";
    $result = $pdo->query("DESCRIBE matches");
    echo "Matches table columns:\n";
    while ($row = $result->fetch()) {
        echo "- {$row['Field']} ({$row['Type']})\n";
    }
    
    // Clear existing matches
    echo "\nClearing existing matches...\n";
    $pdo->exec("DELETE FROM matches");
    $pdo->exec("ALTER TABLE matches AUTO_INCREMENT = 1");
    
    // Add sample matches (adjust based on actual table structure)
    echo "Adding sample matches...\n";
    
    // First, let's try a simple insert with minimal columns
    $pdo->exec("INSERT INTO matches (start_time, status, player1_id, player2_id) VALUES 
        ('2025-10-24 14:30:00', 'live', 1, 2),
        ('2025-10-24 16:00:00', 'upcoming', 1, 2)");
    
    echo "✓ Matches added!\n";
    
    // Update existing players with proper match_id
    echo "Updating players...\n";
    $pdo->exec("UPDATE players SET match_id = 1 WHERE id IN (1, 2)");
    
    echo "✓ Players updated!\n";
    
    // Test the API query
    echo "\nTesting API query...\n";
    $result = $pdo->query("
        SELECT 
            m.id, 
            m.start_time AS date, 
            m.status,
            p1.player_name AS player1,
            p2.player_name AS player2,
            p1.score AS player1_score,
            p2.score AS player2_score
        FROM matches m
        LEFT JOIN players p1 ON m.player1_id = p1.id
        LEFT JOIN players p2 ON m.player2_id = p2.id
        ORDER BY m.start_time DESC
        LIMIT 5
    ");
    
    echo "Query results:\n";
    while ($row = $result->fetch()) {
        echo "Match {$row['id']}: {$row['player1']} ({$row['player1_score']}) vs {$row['player2']} ({$row['player2_score']}) - {$row['status']}\n";
    }
    
    echo "\n✅ Sample data ready for PiP testing!\n";
    
} catch(PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    
    // If the above fails, let's try with just basic columns
    try {
        echo "\nTrying with basic table structure...\n";
        $pdo->exec("INSERT INTO matches (start_time, status) VALUES 
            ('2025-10-24 14:30:00', 'live'),
            ('2025-10-24 16:00:00', 'upcoming')");
        echo "✓ Basic matches added!\n";
    } catch(PDOException $e2) {
        echo "❌ Basic insert also failed: " . $e2->getMessage() . "\n";
    }
}
?>