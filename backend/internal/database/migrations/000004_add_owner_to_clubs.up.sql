ALTER TABLE clubs ADD COLUMN owner_id INT REFERENCES users(id);
