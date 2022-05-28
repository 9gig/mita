const multer = require('multer');
const path   = require('path');
const { callbackify } = require('util');

const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null, './uploads')
    },
    filename: (req, file,cb) =>{
        cb(null, Date.now()+ "-" + path.extname(file.originalname) );
    }

});
const fileFilter = (req, file, callback) =>{
    const validExts = ['.png', '.jpg', '.jpeg'];

    if(!validExts.includes(path.extname(file.originalname))){
        return callback(new Error("only .png, .jpg and .jpeg format is allowed"));
    }
    const fileSize = parseInt(req.headers["content-length"]);
    if(fileSize > 12048576){
        return callback(new Error("File is larger than 10mb"));
    }
    callback(null, true);
};

let upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    fileSize: 12048576
});

module.exports = upload.array("images", 3);