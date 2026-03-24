const Package = require('../models/Package');
const { cloudinary } = require('../config/cloudinary');

// @GET /api/packages
exports.getPackages = async (req, res, next) => {
  try {
    const { location, minPrice, maxPrice, minDays, maxDays, search, featured } = req.query;
    const filter = {};

    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minDays || maxDays) {
      filter.duration = {};
      if (minDays) filter.duration.$gte = Number(minDays);
      if (maxDays) filter.duration.$lte = Number(maxDays);
    }
    if (featured === 'true') filter.featured = true;
    if (search) filter.$text = { $search: search };

    const packages = await Package.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: packages.length, data: packages });
  } catch (err) {
    next(err);
  }
};

// @GET /api/packages/:id
exports.getPackage = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id).populate('createdBy', 'name email');
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
};

// @POST /api/packages  [Admin]
exports.createPackage = async (req, res, next) => {
  try {
    const { title, description, price, duration, location, facilities, maxGroupSize, featured, imageUrl } = req.body;

    // Image: from Cloudinary upload OR direct URL in body
    let image = { url: '', publicId: '' };
    if (req.file) {
      image = { url: req.file.path || req.file.location || '', publicId: req.file.filename || '' };
    } else if (imageUrl) {
      image = { url: imageUrl, publicId: '' };
    }

    const pkg = await Package.create({
      title,
      description,
      price: Number(price),
      duration: Number(duration),
      location,
      facilities: typeof facilities === 'string' ? JSON.parse(facilities) : (facilities || {}),
      maxGroupSize: Number(maxGroupSize) || 20,
      featured: featured === 'true' || featured === true,
      image,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
};

// @PUT /api/packages/:id  [Admin]
exports.updatePackage = async (req, res, next) => {
  try {
    let pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });

    const updateData = { ...req.body };

    // Parse JSON strings from FormData
    if (updateData.facilities && typeof updateData.facilities === 'string') {
      try { updateData.facilities = JSON.parse(updateData.facilities); } catch {}
    }
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.duration) updateData.duration = Number(updateData.duration);
    if (updateData.maxGroupSize) updateData.maxGroupSize = Number(updateData.maxGroupSize);
    if (updateData.featured !== undefined) {
      updateData.featured = updateData.featured === 'true' || updateData.featured === true;
    }

    // Handle image update
    if (req.file) {
      // Delete old Cloudinary image if it exists
      if (pkg.image.publicId && cloudinary.config().cloud_name) {
        await cloudinary.uploader.destroy(pkg.image.publicId).catch(() => {});
      }
      updateData.image = { url: req.file.path || req.file.location || '', publicId: req.file.filename || '' };
    } else if (updateData.imageUrl) {
      updateData.image = { url: updateData.imageUrl, publicId: '' };
      delete updateData.imageUrl;
    }

    pkg = await Package.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
};

// @DELETE /api/packages/:id  [Admin]
exports.deletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });

    // Delete image from Cloudinary if exists
    if (pkg.image.publicId && cloudinary.config && cloudinary.config().cloud_name) {
      await cloudinary.uploader.destroy(pkg.image.publicId).catch(() => {});
    }

    await pkg.deleteOne();
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (err) {
    next(err);
  }
};
