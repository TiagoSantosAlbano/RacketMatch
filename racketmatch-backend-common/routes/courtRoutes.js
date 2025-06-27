const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courtController');
const multer = require('multer');
const path = require('path');

// 📁 Certifica-te que a pasta 'public/uploads/' existe
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Rotas das courts
router.get('/', courtController.getAllCourts);
router.post('/', upload.single('image'), courtController.createCourt);
router.put('/:id', upload.single('image'), courtController.updateCourt);
router.delete('/:id', courtController.deleteCourt);

// ✅ ESSENCIAL para não dar erro no app.js ou index.js
module.exports = router;
