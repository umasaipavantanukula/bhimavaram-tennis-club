
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Scoreboard</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div id="scoreboard-container">
        </div>

    <script>
        // Function to fetch and display scores
        async function fetchScores() {
            try {
                const response = await fetch('api.php?action=get_scores');
                const html = await response.text();
                document.getElementById('scoreboard-container').innerHTML = html;
            } catch (error) {
                console.error('Error fetching scores:', error);
            }
        }

        // Fetch scores every 2 seconds
        setInterval(fetchScores, 2000);

        // Initial fetch on page load
        fetchScores();
    </script>

</body>
</html>