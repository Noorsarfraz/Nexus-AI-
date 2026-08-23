const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    status: { type: String, default: 'Active' },
    region: { type: String },
    instanceType: { type: String },
    deploymentDate: { type: String },
    cpuCores: { type: String },
    accessKey: { type: String },
    configFileName: { type: String },
    configFileUrl: { type: String },
    configFilePublicId: { type: String },
    // Every node belongs to exactly one user's dashboard.
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Node', nodeSchema);
