DROP TABLE IF EXISTS comments;

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    image_id INTEGER NOT NULL,
    comment VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (image_id)
        REFERENCES images(id)
        ON DELETE CASCADE
);

