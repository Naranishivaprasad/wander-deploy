const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration (days) is required'],
      min: [1, 'Duration must be at least 1 day'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    facilities: {
      hotel: { type: Boolean, default: false },
      food: { type: Boolean, default: false },
      transport: { type: Boolean, default: false },
      guide: { type: Boolean, default: false },
    },
    maxGroupSize: {
      type: Number,
      default: 20,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Text index for search
packageSchema.index({ title: 'text', location: 'text', description: 'text' });

module.exports = mongoose.model('Package', packageSchema);
