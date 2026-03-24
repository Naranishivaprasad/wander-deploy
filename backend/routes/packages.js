const express = require('express');
const router = express.Router();
const {
  getPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
} = require('../controllers/packageController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getPackages);
router.get('/:id', getPackage);
router.post('/', protect, adminOnly, upload.single('image'), createPackage);
router.put('/:id', protect, adminOnly, upload.single('image'), updatePackage);
router.delete('/:id', protect, adminOnly, deletePackage);

module.exports = router;
