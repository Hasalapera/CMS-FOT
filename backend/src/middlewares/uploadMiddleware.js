const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the directory for SDS files
const sdsDir = path.join(__dirname, '../../uploads/sds');

// Ensure the upload directory exists
fs.mkdirSync(sdsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, sdsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `sds-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Allowed file types: pdf, doc, docx
  const allowedTypes = /pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document/;
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  }
  cb(new Error('File type not supported. Only PDF and Word documents are allowed.'), false);
};

const uploadSds = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: fileFilter,
}).single('sdsFile'); // 'sdsFile' is the name of the form field

module.exports = uploadSds;