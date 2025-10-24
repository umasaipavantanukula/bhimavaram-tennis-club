<?php
require 'db.php';

try {
    $sql = file_get_contents('database.sql');
    $conn->exec($sql);
    echo "Database setup completed successfully.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
