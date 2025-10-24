<?php
// Simple script to insert sample data into tennis_db for PiP testing
// Run this file to populate the database with test data

$host = 'localhost';
$username = 'root';
$password = '';
$database = 'tennis_db';

try {
    // Connect to MySQL
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connected to tennis_db successfully!\n\n";
    
    // Clear existing data (optional)
    echo "Clearing existing data...\n";
    $pdo->exec("DELETE FROM players");
    $pdo->exec("DELETE FROM matches");
    $pdo->exec("ALTER TABLE players AUTO_INCREMENT = 1");
    $pdo->exec("ALTER TABLE matches AUTO_INCREMENT = 1");
    
    // Insert players
    echo "Inserting players...\n";
    $players_sql = "INSERT INTO players (player_name, team, score, match_id) VALUES
        ('Novak Djokovic', 'Team Serbia', '6', 1),
        ('Rafael Nadal', 'Team Spain', '4', 1),
        ('Roger Federer', 'Team Switzerland', '7', 2),
        ('Andy Murray', 'Team Britain', '5', 2),
        ('Carlos Alcaraz', 'Team Spain', '6', 3),
        ('Stefanos Tsitsipas', 'Team Greece', '3', 3),
        ('Daniil Medvedev', 'Team Russia', '6', 4),
        ('Alexander Zverev', 'Team Germany', '4', 4)";
    
    $pdo->exec($players_sql);
    echo "✓ Players inserted successfully!\n";
    
    // Insert matches
    echo "Inserting matches...\n";
    $matches_sql = "INSERT INTO matches (start_time, status, tournament, court, live_link, player1_id, player2_id) VALUES
        ('2025-10-24 14:30:00', 'live', 'Bhimavaram Open 2025', 'Court 1', 'https://live.tennis.com/match1', 1, 2),
        ('2025-10-24 16:00:00', 'upcoming', 'Bhimavaram Open 2025', 'Court 2', 'https://live.tennis.com/match2', 3, 4),
        ('2025-10-24 18:30:00', 'upcoming', 'Bhimavaram Open 2025', 'Court 1', 'https://live.tennis.com/match3', 5, 6),
        ('2025-10-23 15:00:00', 'completed', 'Bhimavaram Open 2025', 'Court 3', 'https://live.tennis.com/match4', 7, 8)";
    
    $pdo->exec($matches_sql);
    echo "✓ Matches inserted successfully!\n";
    
    // Verify data
    echo "\nVerifying data...\n";
    $result = $pdo->query("SELECT COUNT(*) as player_count FROM players");
    $player_count = $result->fetch()['player_count'];
    echo "Players in database: $player_count\n";
    
    $result = $pdo->query("SELECT COUNT(*) as match_count FROM matches");
    $match_count = $result->fetch()['match_count'];
    echo "Matches in database: $match_count\n";
    
    // Show current live match
    echo "\nCurrent live match:\n";
    $live_match = $pdo->query("
        SELECT 
            m.id, 
            m.status,
            m.tournament,
            p1.player_name AS player1,
            p2.player_name AS player2,
            p1.score AS player1_score,
            p2.score AS player2_score
        FROM matches m
        LEFT JOIN players p1 ON m.player1_id = p1.id
        LEFT JOIN players p2 ON m.player2_id = p2.id
        WHERE m.status = 'live'
        LIMIT 1
    ")->fetch();
    
    if ($live_match) {
        echo "🔴 LIVE: {$live_match['player1']} ({$live_match['player1_score']}) vs {$live_match['player2']} ({$live_match['player2_score']})\n";
        echo "Tournament: {$live_match['tournament']}\n";
    }
    
    echo "\n✅ Sample data added successfully! Your PiP widget should now show live match data.\n";
    
} catch(PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
}
?>