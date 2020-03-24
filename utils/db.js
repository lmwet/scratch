const spicedPg = require("spiced-pg");
const db = spicedPg(
    "postgres:postgres:postgres:@localhost@localhost:5432/images"
);

exports.renderImages = () => {
    const q = `SELECT 
    url, 
    title,
    description
    FROM
    images;`;
    return db.query(q);
};
