// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Local onde as imagens vão ser guardadas
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // <- cria a pasta se não existir
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

module.exports = upload;
