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

//////END MULTER BOILERPLATE /////////

const express = require("express");
const app = express();
const db = require("./utils/db.js");

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(express.static("public")); // by default will look for a index.js file
app.use(express.static("public"));
app.use(express.json());

app.get("/images", (req, res) => {
    console.log("/images route has been hit!");

    ///////// BASIC AUTH ///////
    // var auth = require("basic-auth");
    // var credentials = auth(req);
    // if (!credentials || !check(credentials.name, credentials.pass)) {
    //     res.statusCode = 401;
    //     res.setHeader("WWW-Authenticate", 'Basic realm="example"');
    //     res.json("Access denied");
    // } else {
    //     res.json("Access granted");
    // }

    // // Basic function to validate credentials for example
    // function check(name, pass) {
    //     var valid = true;

    //     // Simple method to prevent short-circut and use timing-safe compare
    //     valid = compare(name, "john") && valid;
    //     valid = compare(pass, "secret") && valid;

    //     return valid;
    // }

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
    db.getImage(param)
        .then(data => {
            res.json(data);
        })
        .catch(e => console.log("eror in get image index", e));
});

app.post("/comment/", (req, res) => {
    let image_id = req.body.id;
    db.addComment(image_id, req.body.comment, req.body.username)
        .then(comments => {
            res.json(comments);
        })
        .catch(e => console.log("eror in post comment index", e));
});

app.get("/comments/:id", (req, res) => {
    let image_id = req.params.id;
    db.getComments(image_id)
        .then(comments => {
            res.json(comments);
        })
        .catch(e => console.log("eror in get comments index", e));
});
app.get("/more/:lastId", (req, res) => {
    let lastId = req.params.lastId;
    db.getMore(lastId)
        .then(moreImages => {
            res.json(moreImages);
        })
        .catch(e => console.log("eror in get moreImages index", e));
});

app.post("/delete/:id", (req, res) => {
    let imageId = req.params.id;
    console.log("req.params on delete", req.params.id);
    console.log("imageId on delete", imageId);

    db.deleteImage(imageId)
        .then(data => {
            console.log("deleted image", data);
            res.json(data);
        })
        .catch(e => console.log("eror in delete image index", e));
});

app.listen(process.env.PORT || 8080);
