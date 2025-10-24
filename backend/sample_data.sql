-- Sample data for tennis_db to test floating PiP widget
-- Insert into tennis_db database

-- First, let's insert some players
INSERT INTO players (player_name, team, score, match_id) VALUES
('Novak Djokovic', 'Team Serbia', '6', 1),
('Rafael Nadal', 'Team Spain', '4', 1),
('Roger Federer', 'Team Switzerland', '7', 2),
('Andy Murray', 'Team Britain', '5', 2),
('Carlos Alcaraz', 'Team Spain', '6', 3),
('Stefanos Tsitsipas', 'Team Greece', '3', 3),
('Daniil Medvedev', 'Team Russia', '4', 4),
('Alexander Zverev', 'Team Germany', '6', 4);

-- Insert sample matches
INSERT INTO matches (start_time, status, tournament, court, live_link, player1_id, player2_id) VALUES
('2025-10-24 14:30:00', 'live', 'Bhimavaram Open 2025', 'Court 1', 'https://live.tennis.com/match1', 1, 2),
('2025-10-24 16:00:00', 'upcoming', 'Bhimavaram Open 2025', 'Court 2', 'https://live.tennis.com/match2', 3, 4),
('2025-10-24 18:30:00', 'upcoming', 'Bhimavaram Open 2025', 'Court 1', 'https://live.tennis.com/match3', 5, 6),
('2025-10-23 15:00:00', 'completed', 'Bhimavaram Open 2025', 'Court 3', 'https://live.tennis.com/match4', 7, 8);

-- Update player scores for completed match
UPDATE players SET score = '6' WHERE id = 7;  -- Medvedev wins
UPDATE players SET score = '4' WHERE id = 8;  -- Zverev loses