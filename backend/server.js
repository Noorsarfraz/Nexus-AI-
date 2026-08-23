require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const connectDB = require('./config/db');
const User = require('./models/User');
const Node = require('./models/Node');
const Upload = require('./models/Upload');

const app = express();

// =====================================================
// MONGODB CONNECTION
// =====================================================

connectDB();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// =====================================================
// ENVIRONMENT / SECURITY CONFIGURATION
// =====================================================

const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set in environment variables.');
  process.exit(1);
}

// =====================================================
// CLOUDINARY CONFIGURATION
// =====================================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.warn('WARNING: Cloudinary environment variables are missing.');
}

// =====================================================
// CLOUDINARY STORAGE
// =====================================================

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith('image/');
    const safeName = file.originalname
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_');

    return {
      folder: 'nexus-ai-uploads',
      /*
       * Images -> image
       * PDFs -> raw
       */
      resource_type: isImage ? 'image' : 'raw',
      public_id: `${Date.now()}-${safeName}`,
      /*
       * Keep uploaded files accessible through Cloudinary URL
       */
      access_mode: 'public'
    };
  }
});

// =====================================================
// ALLOWED FILE TYPES
// =====================================================

const allowedMimeTypes = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/json',
  'text/plain',
  'application/x-yaml',
  'text/yaml'
];

// =====================================================
// MULTER CONFIGURATION
// =====================================================

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Unsupported file type. Only PNG, JPG, JPEG, WEBP, GIF and PDF are allowed.'
        )
      );
    }
  }
});

// =====================================================
// AUTHENTICATION
// =====================================================

// ---------------- SIGNUP ----------------

app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists with this email'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      plan: 'Developer'
    });

    res.status(201).json({
      message: 'User registered successfully'
    });
  } catch (err) {
    console.error('SIGNUP ERROR:', err);
    res.status(500).json({
      error: 'Server error during signup'
    });
  }
});

// ---------------- LOGIN ----------------

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        error: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      plan: user.plan
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({
      error: 'Server error during login'
    });
  }
});

// =====================================================
// JWT AUTHENTICATION MIDDLEWARE
// =====================================================

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Access denied. No token provided.'
    });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'Invalid authorization format.'
    });
  }

  const token = parts[1];

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error('JWT ERROR:', err.message);
    return res.status(403).json({
      error: 'Invalid or expired token.'
    });
  }
};

// =====================================================
// BILLING / PLAN ROUTES
// =====================================================

// ---------------- GET USER PLAN ----------------

app.get('/api/user/plan', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      plan: user.plan || 'Developer'
    });
  } catch (err) {
    console.error('GET PLAN ERROR:', err);
    res.status(500).json({
      success: false,
      error: 'Unable to fetch user plan.'
    });
  }
});

// ---------------- UPDATE BILLING / PLAN ----------------

app.post('/api/user/billing', verifyToken, async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({
        success: false,
        error: 'Plan name is required'
      });
    }

    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.plan = plan;
    await user.save();

    res.json({
      success: true,
      message: `Plan successfully updated to ${plan}`,
      plan: user.plan
    });
  } catch (err) {
    console.error('BILLING ERROR:', err);
    res.status(500).json({
      success: false,
      error: 'Unable to update billing plan.'
    });
  }
});

// =====================================================
// FILE UPLOAD ROUTES
// =====================================================

// ---------------- GET USER UPLOADS ----------------

app.get('/api/uploads', verifyToken, async (req, res) => {
  try {
    const userUploads = await Upload.find({ userEmail: req.user.email }).sort({ createdAt: -1 });
    res.json(userUploads);
  } catch (err) {
    console.error('GET UPLOADS ERROR:', err);
    res.status(500).json({
      error: 'Unable to fetch uploaded files.'
    });
  }
});

// ---------------- UPLOAD FILE ----------------

app.post('/api/uploads', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded or file format not supported.'
      });
    }

    const isImage = req.file.mimetype.startsWith('image/');
    const resourceType = req.file.resource_type || (isImage ? 'image' : 'raw');

    const newUpload = await Upload.create({
      originalName: req.file.originalname,
      fileUrl: req.file.path,
      publicId: req.file.filename,
      mimetype: req.file.mimetype,
      sizeBytes: req.file.size || 0,
      resourceType,
      user: req.user.id,
      userEmail: req.user.email
    });

    console.log(`FILE UPLOADED: ${req.file.originalname}`);

    res.status(201).json(newUpload);
  } catch (err) {
    console.error('UPLOAD ROUTE ERROR:', err);
    res.status(500).json({
      error: err.message || 'Server error during Cloudinary file upload.'
    });
  }
});

// ---------------- DELETE FILE ----------------

app.delete('/api/uploads/:id', verifyToken, async (req, res) => {
  const fileId = req.params.id;

  try {
    const fileItem = await Upload.findOne({
      _id: fileId,
      userEmail: req.user.email
    });

    if (!fileItem) {
      return res.status(404).json({
        error: 'File not found or unauthorized'
      });
    }

    if (fileItem.publicId) {
      await cloudinary.uploader.destroy(fileItem.publicId, {
        resource_type: fileItem.resourceType || 'image'
      });
    }

    await fileItem.deleteOne();

    res.json({
      message: 'File deleted successfully from Cloudinary and database'
    });
  } catch (err) {
    console.error('CLOUDINARY DELETE ERROR:', err);
    res.status(500).json({
      error: err.message || 'Unable to delete file from Cloudinary.'
    });
  }
});

// =====================================================
// AI NODE ROUTES
// =====================================================

// ---------------- GET NODES ----------------

app.get('/api/nodes', verifyToken, async (req, res) => {
  try {
    const userNodes = await Node.find({ userEmail: req.user.email }).sort({ createdAt: -1 });
    res.json(userNodes);
  } catch (err) {
    console.error('GET NODES ERROR:', err);
    res.status(500).json({
      error: 'Unable to fetch nodes.'
    });
  }
});

// ---------------- CREATE NODE ----------------

app.post('/api/nodes', verifyToken, async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({
        error: 'Node title is required.'
      });
    }

    const newNode = await Node.create({
      title: req.body.title,
      status: req.body.status || 'Active',
      user: req.user.id,
      userEmail: req.user.email
    });

    res.status(201).json(newNode);
  } catch (err) {
    console.error('CREATE NODE ERROR:', err);
    res.status(500).json({
      error: 'Unable to create node.'
    });
  }
});

// =====================================================
// DEPLOY AI NODE
// =====================================================

app.post('/api/nodes/deploy', verifyToken, upload.single('configFile'), async (req, res) => {
  try {
    const {
      nodeName,
      region,
      instanceType,
      deploymentDate,
      cpuCores,
      accessKey,
      status
    } = req.body;

    const configFile = req.file;

    // ---------------- VALIDATION ----------------

    if (!nodeName || nodeName.trim().length < 3) {
      return res.status(400).json({
        message: 'Server validation error: Node name must be at least 3 characters.'
      });
    }

    const regionMapping = {
      'US East (N. Virginia)': 'us-east',
      'US West (Oregon)': 'us-west',
      'EU Central (Frankfurt)': 'eu-central',
      'Asia Pacific (Mumbai)': 'ap-south',
      'us-east': 'us-east',
      'us-west': 'us-west',
      'eu-central': 'eu-central',
      'ap-south': 'ap-south'
    };

    const mappedRegion = regionMapping[region];
    const allowedRegions = ['us-east', 'us-west', 'eu-central', 'ap-south'];

    if (!mappedRegion || !allowedRegions.includes(mappedRegion)) {
      return res.status(400).json({
        message: 'Server validation error: Invalid region selected.'
      });
    }

    if (!deploymentDate) {
      return res.status(400).json({
        message: 'Server validation error: Deployment date is required.'
      });
    }

    if (!accessKey || accessKey.length < 8) {
      return res.status(400).json({
        message: 'Server validation error: Access key must be at least 8 characters.'
      });
    }

    if (!configFile) {
      return res.status(400).json({
        message: 'Server validation error: Configuration file upload is missing.'
      });
    }

    // ---------------- CREATE NODE ----------------

    const deployedNode = await Node.create({
      title: nodeName,
      status: status || 'Active (Deployed)',
      region: mappedRegion,
      instanceType,
      deploymentDate,
      cpuCores,
      accessKey,
      configFileName: configFile.originalname,
      configFileUrl: configFile.path,
      configFilePublicId: configFile.filename,
      user: req.user.id,
      userEmail: req.user.email
    });

    res.status(201).json({
      success: true,
      message: 'AI Node successfully validated and deployed!',
      node: deployedNode
    });
  } catch (err) {
    console.error('DEPLOY ERROR:', err);
    res.status(500).json({
      message: 'Internal server error during node deployment.'
    });
  }
});

// =====================================================
// UPDATE AI NODE
// =====================================================

app.put('/api/nodes/:id', verifyToken, async (req, res) => {
  try {
    const {
      title,
      status,
      region,
      instanceType,
      deploymentDate,
      cpuCores
    } = req.body;

    const node = await Node.findOne({
      _id: req.params.id,
      userEmail: req.user.email
    });

    if (!node) {
      return res.status(404).json({
        error: 'AI Node not found or unauthorized'
      });
    }

    node.title = title || node.title;
    node.status = status || node.status;
    node.region = region || node.region;
    node.instanceType = instanceType || node.instanceType;
    node.deploymentDate = deploymentDate || node.deploymentDate;
    node.cpuCores = cpuCores || node.cpuCores;

    await node.save();

    res.json(node);
  } catch (err) {
    console.error('UPDATE NODE ERROR:', err);
    res.status(500).json({
      error: 'Unable to update AI node.'
    });
  }
});

// =====================================================
// DELETE AI NODE
// =====================================================

app.delete('/api/nodes/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Node.findOneAndDelete({
      _id: req.params.id,
      userEmail: req.user.email
    });

    if (!deleted) {
      return res.status(404).json({
        error: 'AI Node not found or unauthorized'
      });
    }

    res.json({
      message: 'AI Node deleted successfully'
    });
  } catch (err) {
    console.error('DELETE NODE ERROR:', err);
    res.status(500).json({
      error: 'Unable to delete AI node.'
    });
  }
});

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error('GLOBAL BACKEND ERROR:', err);

  // Multer file-size error
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File is too large. Maximum size is 10MB.'
      });
    }
    return res.status(400).json({
      error: err.message
    });
  }

  // File type validation error
  if (err.message && err.message.includes('Unsupported file type')) {
    return res.status(400).json({
      error: err.message
    });
  }

  return res.status(500).json({
    error: err.message || 'Internal Server Error'
  });
});

// =====================================================
// START SERVER
// =====================================================
// Only bind to a port when this file is run directly (`node server.js`).
// When it's `require()`-d by test files (Supertest), we skip listening —
// Supertest spins up its own ephemeral server around the exported app.

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Nexus AI Backend running on port ${PORT} with Cloudinary connected!`);
    console.log(`Cloudinary Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'MISSING'}`);
    console.log(`Cloudinary API Key: ${process.env.CLOUDINARY_API_KEY ? 'Configured' : 'MISSING'}`);
    console.log(`Cloudinary API Secret: ${process.env.CLOUDINARY_API_SECRET ? 'Configured' : 'MISSING'}`);
  });
}

module.exports = app;