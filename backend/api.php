<?php
require 'db.php';

// Get the action from the URL query string
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'add_player':
        addPlayer($conn);
        break;
    case 'update_score':
        updateScore($conn);
        break;
    case 'set_score':
        setScore($conn);
        break;
    case 'get_scores':
        getScores($conn);
        break;
    case 'get_admin_list':
        getAdminList($conn);
        break;
    case 'reset':
        resetScores($conn);
        break;
    case 'start_match':
        startMatch($conn);
        break;
    case 'reset_scores':
        resetScoresOnly($conn);
        break;
    case 'remove_player':
        removePlayer($conn);
        break;
    case 'update_player_name':
        updatePlayerName($conn);
        break;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}

function addPlayer($conn) {
    $currentMatchId = getCurrentMatchId($conn);
    if (!$currentMatchId) {
        // If no active match, create one
        $stmt = $conn->prepare("INSERT INTO matches (status) VALUES ('active')");
        $stmt->execute();
        $currentMatchId = $conn->lastInsertId();
    }

    if (!empty($_POST['player_name'])) {
        $playerName = $_POST['player_name'];

        // Check if player already exists in current match
        $stmt = $conn->prepare("SELECT id FROM players WHERE player_name = ? AND match_id = ?");
        $stmt->execute([$playerName, $currentMatchId]);
        $existingPlayer = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($existingPlayer) {
            // Player already in match, do nothing or notify
        } else {
            // Check if player exists in other matches or not assigned
            $stmt = $conn->prepare("SELECT id FROM players WHERE player_name = ? AND (match_id != ? OR match_id IS NULL)");
            $stmt->execute([$playerName, $currentMatchId]);
            $existingPlayer = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($existingPlayer) {
                // Add existing player to current match
                $stmt = $conn->prepare("UPDATE players SET match_id = ? WHERE id = ?");
                $stmt->execute([$currentMatchId, $existingPlayer['id']]);
            } else {
                // Add new player
                $stmt = $conn->prepare("INSERT INTO players (player_name, match_id) VALUES (?, ?)");
                $stmt->execute([$playerName, $currentMatchId]);
            }
        }
    }
    header("Location: admin.php"); // Redirect back to admin page
    exit();
}

function updateScore($conn) {
    if (isset($_POST['id']) && isset($_POST['change'])) {
        $change = intval($_POST['change']); // +1 or -1
        $id = intval($_POST['id']);
        
        // Prevent score from going below 0
        $sql = "UPDATE players SET score = GREATEST(0, score + ?) WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$change, $id]);
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing parameters']);
    }
    exit();
}

function resetScores($conn) {
    $conn->query("UPDATE players SET score = 0");
    header("Location: admin.php"); // Redirect back
    exit();
}

function getScores($conn) {
    $currentMatchId = getCurrentMatchId($conn);
    if (!$currentMatchId) {
        echo '<div class="scoreboard">';
        echo '<div class="player-row"><div class="player-indicator"></div><div class="player-names">Player 1</div><div class="score-box">0</div></div>';
        echo '<div class="player-row"><div class="player-indicator"></div><div class="player-names">Player 2</div><div class="score-box">0</div></div>';
        echo '</div>';
        exit();
    }

    $stmt = $conn->prepare("SELECT * FROM players WHERE match_id = ? ORDER BY id");
    $stmt->execute([$currentMatchId]);
    $players = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo '<div class="scoreboard">';
    $playerCount = count($players);
    for ($i = 0; $i < 2; $i++) {
        if ($i < $playerCount) {
            $player = $players[$i];
            echo '<div class="player-row"><div class="player-indicator"></div><div class="player-names">' . htmlspecialchars($player['player_name']) . '</div><div class="score-box">' . $player['score'] . '</div></div>';
        } else {
            echo '<div class="player-row"><div class="player-indicator"></div><div class="player-names">Player ' . ($i + 1) . '</div><div class="score-box">0</div></div>';
        }
    }
    echo '</div>';
    exit();
}

function getAdminList($conn) {
    $currentMatchId = getCurrentMatchId($conn);
    if (!$currentMatchId) {
        echo '<div class="players-list">';
        echo '<div class="player-item">';
        echo '<div><input type="text" id="new-player-1" placeholder="Player 1 Name" style="width: 120px; margin-right: 10px;"><button onclick="addPlayer(1)">Add Player 1</button></div>';
        echo '<div class="score-controls"><input type="number" id="score-new-1" value="0" style="width: 60px; margin-right: 10px;"><button onclick="setScoreForNew(1)">Set</button> <button onclick="updateScoreForNew(1, 1)">+</button> <button onclick="updateScoreForNew(1, -1)">-</button></div>';
        echo '</div>';
        echo '<div class="player-item">';
        echo '<div><input type="text" id="new-player-2" placeholder="Player 2 Name" style="width: 120px; margin-right: 10px;"><button onclick="addPlayer(2)">Add Player 2</button></div>';
        echo '<div class="score-controls"><input type="number" id="score-new-2" value="0" style="width: 60px; margin-right: 10px;"><button onclick="setScoreForNew(2)">Set</button> <button onclick="updateScoreForNew(2, 1)">+</button> <button onclick="updateScoreForNew(2, -1)">-</button></div>';
        echo '</div>';
        echo '</div>';
        exit();
    }

    $stmt = $conn->prepare("SELECT * FROM players WHERE match_id = ? ORDER BY id");
    $stmt->execute([$currentMatchId]);
    $players = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo '<div class="players-list">';
    $playerCount = count($players);
    for ($i = 0; $i < 2; $i++) {
        if ($i < $playerCount) {
            $player = $players[$i];
            echo '<div class="player-item">';
            echo '<div>';
            echo '<input type="text" id="name-' . $player['id'] . '" value="' . htmlspecialchars($player['player_name']) . '" style="width: 120px; margin-right: 10px;">';
            echo '<button onclick="updatePlayerName(' . $player['id'] . ')">Update Name</button> ';
            echo '<button onclick="removePlayer(' . $player['id'] . ')" style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; cursor: pointer;">Remove</button>';
            echo '</div>';
            echo '<div class="score-controls">';
            echo '<input type="number" id="score-' . $player['id'] . '" value="' . $player['score'] . '" style="width: 60px; margin-right: 10px;">';
            echo '<button onclick="setScore(' . $player['id'] . ')">Set</button> ';
            echo '<button onclick="updateScore(' . $player['id'] . ', 1)">+</button> ';
            echo '<button onclick="updateScore(' . $player['id'] . ', -1)">-</button>';
            echo '</div>';
            echo '</div>';
        } else {
            echo '<div class="player-item">';
            echo '<div><input type="text" id="new-player-' . ($i + 1) . '" placeholder="Player ' . ($i + 1) . ' Name" style="width: 120px; margin-right: 10px;"><button onclick="addPlayer(' . ($i + 1) . ')">Add Player ' . ($i + 1) . '</button></div>';
            echo '<div class="score-controls"><input type="number" id="score-new-' . ($i + 1) . '" value="0" style="width: 60px; margin-right: 10px;"><button onclick="setScoreForNew(' . ($i + 1) . ')">Set</button> <button onclick="updateScoreForNew(' . ($i + 1) . ', 1)">+</button> <button onclick="updateScoreForNew(' . ($i + 1) . ', -1)">-</button></div>';
            echo '</div>';
        }
    }
    echo '</div>';
    exit();
}

function startMatch($conn) {
    // Set current match to completed
    $conn->query("UPDATE matches SET status = 'completed' WHERE status = 'active'");

    // Create new match
    $stmt = $conn->prepare("INSERT INTO matches (status) VALUES ('active')");
    $stmt->execute();

    // Remove all players from selection (set match_id to NULL) and reset scores to 0
    $conn->query("UPDATE players SET score = 0, match_id = NULL");

    header("Location: admin.php"); // Redirect back to admin page
    exit();
}

function resetScoresOnly($conn) {
    $conn->query("UPDATE players SET score = 0");
    echo json_encode(['status' => 'success']);
    exit();
}

function getCurrentMatchId($conn) {
    $stmt = $conn->query("SELECT id FROM matches WHERE status = 'active' LIMIT 1");
    $match = $stmt->fetch(PDO::FETCH_ASSOC);
    return $match ? $match['id'] : null;
}



function setScore($conn) {
    if (isset($_POST['id']) && isset($_POST['score'])) {
        $score = intval($_POST['score']);
        $id = intval($_POST['id']);
        $stmt = $conn->prepare("UPDATE players SET score = ? WHERE id = ?");
        $stmt->execute([$score, $id]);
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing parameters']);
    }
    exit();
}

function removePlayer($conn) {
    if (isset($_POST['id'])) {
        $id = intval($_POST['id']);
        $stmt = $conn->prepare("UPDATE players SET match_id = NULL WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing player ID']);
    }
    exit();
}

function updatePlayerName($conn) {
    if (isset($_POST['id']) && isset($_POST['player_name'])) {
        $id = intval($_POST['id']);
        $playerName = trim($_POST['player_name']);
        if (!empty($playerName)) {
            $stmt = $conn->prepare("UPDATE players SET player_name = ? WHERE id = ?");
            $stmt->execute([$playerName, $id]);
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Player name cannot be empty']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing parameters']);
    }
    exit();
}
?>
