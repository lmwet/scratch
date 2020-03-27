const spicedPg = require("spiced-pg");
const db = spicedPg(
    "postgres:postgres:postgres:@localhost@localhost:5432/images"
);

exports.renderImages = () => {
    const q = `SELECT 
    id,
    url, 
    title,
    description
    FROM
    images
    ORDER BY id DESC;`;
    return db.query(q);
};

exports.addImage = (title, description, username, url) => {
    const q = `INSERT into images (title, description, username, url)
    VALUES ($1, $2, $3, $4)
    RETURNING *`;
    const params = [title, description, username, url];
    return db.query(q, params);
};

exports.getImage = id => {
    const q = `SELECT 
    id,
    title, 
    description,
    username,
    url
    FROM
    images
    WHERE id = $1;`;
    const params = [id];
    return db.query(q, params);
};

exports.addComment = (image_id, comment, username, created_at) => {
    const q = `INSERT into comments (image_id, text, username, created_at)
    VALUES ($1, $2, $3, $4)
    RETURNING *`;
    const params = [image_id, comment, username, created_at];
    return db.query(q, params);
};

exports.getComments = id => {
    const q = `SELECT 
    id,
    username,
    text,
    created_at,
    image_id
    FROM
    comments
    WHERE id = $1;`;
    const params = [id];
    return db.query(q, params);
};
