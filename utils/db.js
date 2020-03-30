const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres:@localhost@localhost:5432/images"
);

exports.renderImages = () => {
    const q = `SELECT *
    FROM
    images
    ORDER BY id DESC
    LIMIT 12;`;
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

exports.addComment = (image_id, comment, username) => {
    const q = `INSERT into comments (image_id, comment, username)
    VALUES ($1, $2, $3)
    RETURNING *`;
    const params = [image_id, comment, username];
    return db.query(q, params);
};

exports.getComments = id => {
    const q = `SELECT 
    image_id,
    comment,
    username,
    created_at
    FROM
    comments
    WHERE image_id = $1;`;
    const params = [id];
    return db.query(q, params);
};

exports.getMore = lastId =>
    db
        .query(
            `SELECT * , (
    SELECT id FROM images
    ORDER BY id ASC
    LIMIT 1
    ) AS "lowestId" FROM images
    WHERE id < $1
    ORDER BY id DESC
    LIMIT 9`,
            [lastId]
        )
        .then(({ rows }) => rows);

exports.deleteImage = imageId => {
    const q = `DELETE FROM images
    WHERE id = $1`;

    const params = [imageId];
    return db.query(q, params);
};
