-- Create database
CREATE DATABASE IF NOT EXISTS tennis_db;
USE tennis_db;

-- Players table
CREATE TABLE IF NOT EXISTS players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(255) NOT NULL,
    team INT NOT NULL,
    score INT DEFAULT 0,
    match_id INT DEFAULT 1
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'completed') DEFAULT 'active'
);
