const express = require("express");
const app = express();
const spicedPg = require("spiced-pg");
const db = spicedPg(
    "postgres:postgres:postgres:@localhost@localhost:5432/images"
);
app.use(express.static("public")); // by default will look for a index.js file

// let images = [
//     {
//         big: "Berlin",
//         country: "DE"
//     },
//     {
//         big: "Guayaquil",
//         country: "Ecuador"
//     },
//     {
//         big: "Ankara",
//         country: "Turkey"
//     },
//     {
//         big: "Bogotá",
//         country: "Colombia"
//     }
// ];

const renderImages = () => {
    const q = `SELECT 
    url, 
    title,
    description
    FROM
    images;`;
    return db.query(q);
};

app.get("/images", (req, res) => {
    console.log("/images route has been hit!");
    renderImages()
        .then(images => {
            res.json(images);
            console.log("images in renderImages", images);
        })
        .catch(e => console.log("eror in renderImages", e));
});

app.listen(8080, () => console.log("listening from 8080"));
