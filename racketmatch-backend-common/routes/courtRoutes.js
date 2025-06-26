const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courtController');
const multer = require('multer');
const path = require('path');

// Configuração do destino e nome dos ficheiros
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Certifica-te que esta pasta existe
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Rotas para quadras com upload de imagem
router.get('/', courtController.getAllCourts);
router.post('/', upload.single('image'), courtController.createCourt);
router.put('/:id', upload.single('image'), courtController.updateCourt);
router.delete('/:id', courtController.deleteCourt);

module.exports = router;
