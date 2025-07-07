const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const authAdmin = require('../middleware/authAdmin');
const {
  getAllCourts,
  createCourt,
  updateCourt,
  deleteCourt,
} = require('../controllers/courtController');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


router.get('/', authAdmin, getAllCourts);
router.post('/', authAdmin, upload.single('image'), createCourt);
router.put('/:id', authAdmin, upload.single('image'), updateCourt);
router.delete('/:id', authAdmin, deleteCourt);

module.exports = router;
