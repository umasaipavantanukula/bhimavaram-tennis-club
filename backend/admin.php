    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Scoreboard Admin</title>
    <style>
        body { font-family: sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 800px; margin: auto; background: white; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        h1, h2 { text-align: center; }
        form { display: flex; gap: 10px; margin-bottom: 20px; justify-content: center; }
        input, select, button { padding: 10px; font-size: 16px; }
        .players-list { list-style: none; padding: 0; }
        .player-item { display: flex; align-items: center; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee; }
        .player-item:last-child { border-bottom: none; }
        .player-name { font-weight: bold; }
        .score-controls button { font-size: 20px; width: 40px; height: 40px; cursor: pointer; }
        #reset-btn { background-color: #dc3545; color: white; border: none; }
    </style>
</head>
<body>

<div class="container">
    <h1>Tennis Scoreboard Admin</h1>

    <h2>Manage Players</h2>
    <div id="manage-players">
        <!-- Players will be loaded here -->
    </div>
    
    <hr>
    
    <h2>Manage Scores</h2>
    <div id="manage-players">
        </div>
    
    <hr>
    <form action="api.php?action=start_match" method="POST" onsubmit="return confirm('Are you sure you want to start a new match? This will reset all scores.');">
        <button type="submit">START NEW MATCH</button>
    </form>

    <hr>
    <button onclick="resetScores()" style="background-color: #ffc107; color: black; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer;">RESET SCORES ONLY</button>

    <hr>
    <form action="api.php?action=reset" method="POST" onsubmit="return confirm('Are you sure you want to reset all scores to 0?');">
        <button id="reset-btn" type="submit">RESET ALL SCORES</button>
    </form>
</div>

<script>
    // Function to handle score updates without reloading the page
    async function updateScore(playerId, change) {
        const formData = new FormData();
        formData.append('id', playerId);
        formData.append('change', change);

        await fetch('api.php?action=update_score', {
            method: 'POST',
            body: formData
        });

        // Refresh the list after updating
        loadPlayers();
    }

    // Function to set score directly
    async function setScore(playerId) {
        const score = document.getElementById('score-' + playerId).value;
        const formData = new FormData();
        formData.append('id', playerId);
        formData.append('score', score);

        await fetch('api.php?action=set_score', {
            method: 'POST',
            body: formData
        });

        // Refresh the list after updating
        loadPlayers();
    }

    // Function to remove player from match
    async function removePlayer(playerId) {
        if (confirm('Are you sure you want to remove this player from the match?')) {
            const formData = new FormData();
            formData.append('id', playerId);

            await fetch('api.php?action=remove_player', {
                method: 'POST',
                body: formData
            });

            // Refresh the list after removing
            loadPlayers();
        }
    }

    // Function to update player name
    async function updatePlayerName(playerId) {
        const playerName = document.getElementById('name-' + playerId).value.trim();
        if (!playerName) {
            alert('Player name cannot be empty');
            return;
        }

        const formData = new FormData();
        formData.append('id', playerId);
        formData.append('player_name', playerName);

        await fetch('api.php?action=update_player_name', {
            method: 'POST',
            body: formData
        });

        // Refresh the list after updating
        loadPlayers();
    }

    // Function to add player
    async function addPlayer(slot) {
        const playerName = document.getElementById('new-player-' + slot).value.trim();
        if (!playerName) {
            alert('Player name cannot be empty');
            return;
        }

        const formData = new FormData();
        formData.append('player_name', playerName);

        await fetch('api.php?action=add_player', {
            method: 'POST',
            body: formData
        });

        // Refresh the list after adding
        loadPlayers();
    }

    // Function to set score for new player slot
    async function setScoreForNew(slot) {
        // This is a placeholder - scores can only be set after player is added
        alert('Please add the player first before setting scores.');
    }

    // Function to update score for new player slot
    async function updateScoreForNew(slot, change) {
        // This is a placeholder - scores can only be updated after player is added
        alert('Please add the player first before updating scores.');
    }

    // Function to load the player list
    async function loadPlayers() {
        const response = await fetch('api.php?action=get_admin_list');
        const html = await response.text();
        document.getElementById('manage-players').innerHTML = html;
    }
    
    // Function to reset scores only
    async function resetScores() {
        if (confirm('Are you sure you want to reset all scores to 0?')) {
            await fetch('api.php?action=reset_scores', {
                method: 'POST'
            });
            // Refresh the list after resetting
            loadPlayers();
        }
    }

    // Initial load
    loadPlayers();
</script>

</body>
</html>