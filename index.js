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

app.get("/images", (req, res) => {
    console.log("/images route has been hit!");
    db.renderImages()
        .then(images => {
            res.json(images);
        })
        .catch(e => console.log("eror in renderImages", e));
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // insert a row in images table for the new image
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
    //send the url of the image as a response
    console.log("file in index post upload: ", req.file);
    // gives you access to the user input
    console.log("user input: ", req.body);
});

app.get("/image/" + this.id, (req, res) => {
    console.log("/image/id route runnin");
    db.getImage()
        .then(data => {
            res.json(data);
            console.log("data in getImage", data);
        })
        .catch(e => console.log("eror in renderImages", e));
});

app.listen(8080, () => console.log("listening from 8080"));
