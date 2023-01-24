// import multer
const multer = require('multer');

// upload product
exports.uploadFile = (file) => {
  // code here
  // Tujuan / Tempat penyimpanan
  const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ''));
    },
  });

  //File extension
  const fileFilter = function (req, file, cb) {
    if (file.fieldname === file) {
      if (!file.originalname.match(/\.(jpg|JPG|png|PNG|jpeg|JPEG|PDF|pdf|docx|DOCX)$/)) {
        req.fileValidationError = {
          message: 'Unsupported File',
        };
        return cb(new Error('Unsupported File'), false);
      }
    }
    cb(null, true);
  };

  //size file
  const sizeInMB = 10;
  const maxSize = sizeInMB * 1000 * 1000;

  // generate configuration multer
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).single(file);

  // middleware handler
  return (req, res, next) => {
    upload(req, res, function (err) {
      //  validation gagal
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }

      // ukuran file melebihi limit
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).send({
            message: 'Max size file 10MB',
          });
        }

        return res.status(400).send(err);
      }

      return next();
    });
  };
};
