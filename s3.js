const aws = require("aws-sdk"); // amazone soft dev kit
const fs = require("fs");
let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});
exports.upload = function(req, res, next) {
    const { filename, mimetype, size, path } = req.file;
    //filename is from uidSafe (the 24 thingy) mimetyype is extension type and path is full path: read stream actually to pipe the files to amazone
    s3.putObject({
        Bucket: "spicedling",
        ACL: "public-read", // accesscontrol
        Key: filename, // called keys uidsafe + ext
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    })
        .promise()
        .then(() => {
            // it worked!!!
            next();
            fs.unlink(path, () => {});
        })
        .catch(err => {
            console.log("err in putObject s3", err);
            res.sendStatus(500);
        });
};
