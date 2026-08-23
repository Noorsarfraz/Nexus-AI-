const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    // Cloudinary's secure URL - this is what the frontend renders/downloads directly.
    fileUrl: { type: String, required: true },
    // Cloudinary's public_id - needed to delete the file from Cloudinary later.
    publicId: { type: String, required: true },
    mimetype: { type: String },
    sizeBytes: { type: Number },
    resourceType: { type: String, default: 'raw' },
    // Every upload is tied to exactly one user, so each user only ever sees their own files.
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Upload', uploadSchema);
