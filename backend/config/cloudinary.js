const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Only configure Cloudinary if credentials are provided
const hasCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

let upload;

if (hasCloudinary) {
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'wander-india',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1200, height: 800, crop: 'fill', quality: 'auto' }],
    },
  });

  upload = multer({ storage });
} else {
  // Fallback: store in memory (image URL from req.body.imageUrl will be used instead)
  upload = multer({ storage: multer.memoryStorage() });
}

module.exports = { cloudinary, upload };
