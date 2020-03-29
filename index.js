const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const conf = require("./config.json");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//////END MULTER NOILERPLATE /////////

const express = require("express");
const app = express();
const db = require("./utils/db.js");

app.use(express.static("public")); // by default will look for a index.js file
app.use(express.static("public"));
app.use(express.json());

app.get("/images", (req, res) => {
    console.log("/images route has been hit!");
    db.renderImages()
        .then(images => {
            res.json(images);
        })
        .catch(e => console.log("eror in renderImages", e));
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    let imageUrl = conf.s3Url + req.file.filename;

    db.addImage(
        req.body.title,
        req.body.description,
        req.body.username,
        imageUrl
    )
        .then(image => {
            res.json(image);
        })
        .catch(err => {
            console.log("err in add image", err);
            res.sendStatus(500);
        });
});

app.get("/image/:id", (req, res) => {
    let param = req.params.id;
    console.log("req.params on get image/id", req.params);
    db.getImage(param)
        .then(data => {
            res.json(data);
        })
        .catch(e => console.log("eror in get image index", e));
});

app.post("/comment/", (req, res) => {
    let image_id = req.body.id;
    console.log("req.body on get comments", req.body);
    db.addComment(image_id, req.body.comment, req.body.username)
        .then(comments => {
            res.json(comments);
        })
        .catch(e => console.log("eror in post comment index", e));
});

app.get("/comments/:id", (req, res) => {
    let image_id = req.params.id;
    console.log("req.params on get comments", req.params);
    db.getComments(image_id)
        .then(comments => {
            res.json(comments);
            console.log("comments in getcomments", comments);
        })
        .catch(e => console.log("eror in get comments index", e));
});
app.get("/more/:lastId", (req, res) => {
    console.log("req.params on get /more", req.params);
    let lastId = req.params.lastId;
    db.getMore(lastId)
        .then(moreImages => {
            res.json(moreImages);
            console.log("moreImages", moreImages);

            console.log("moreImages[0].lowestId", moreImages[0].lowestId);

            const smallestId = moreImages.find(
                ({ id }) => id === moreImages[0].lowestId
            );
            console.log("smallestId", smallestId);

            if (smallestId != undefined) {
                const moreButton = window.document.getElementById("more");
                console.log(moreButton);
                moreButton.style.display = "none";
            }
        })
        .catch(e => console.log("eror in get moreImages index", e));
});

app.listen(8080, () => console.log("listening from 8080"));
