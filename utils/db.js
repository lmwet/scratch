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
    console.log("query from addimages", q);
    const params = [title, description, username, url];
    return db.query(q, params);
};
