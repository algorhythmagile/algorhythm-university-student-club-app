CREATE TABLE system_messages (
    id SERIAL PRIMARY KEY,
    message_text TEXT NOT NULL
);

INSERT INTO system_messages (message_text) VALUES
('Çok yakında hizmetinizdeyiz!');