const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

// Every file (images, PDFs, config files) is streamed straight into Cloudinary.
// No file ever touches the server's local disk.
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith('image/');
    const safeName = file.originalname.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    return {
      folder: 'nexus-ai-uploads',
      resource_type: isImage ? 'image' : 'raw', // raw = pdf / json / yaml / etc.
      public_id: `${Date.now()}-${safeName}`
    };
  }
});

module.exports = cloudinaryStorage;
