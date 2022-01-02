var multer = require('multer')

//File Upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        console.log("Helper file > ", file);
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split(".").pop())
    }
})

module.exports.Uploader = multer({ storage: storage })