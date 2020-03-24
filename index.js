const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

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
            console.log("images in renderImages", images);
        })
        .catch(e => console.log("eror in renderImages", e));
});

app.post("/upload", uploader.single("file"), (req, res) => {
    // gives you access to your file
    console.log("file: ", req.file);
    // gives you access to the user input
    console.log("user input: ", req.body);

    if (req.file) {
        // you'll eventually want to make a db insert here for all the info!
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.listen(8080, () => console.log("listening from 8080"));
