CREATE TABLE IF NOT EXISTS club_members (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    club_id INT NOT NULL REFERENCES clubs(id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, club_id)
);
