import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Server, Calendar, Upload, ShieldCheck, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';

export default function DeployNodeForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('editId');

  // Ab shared Zustand store se — apna alag duplicate fetch/token logic nahi
  const { nodes, fetchNodes, deployNode, updateNodeFull } = useNexusStore();

  const [formData, setFormData] = useState({
    nodeName: '',
    status: 'Active',
    region: 'us-east',
    instanceType: 't3.medium',
    deploymentDate: '',
    cpuCores: '4',
    accessKey: '',
    configFile: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  
  // New State for Success Screen View
  const [isSuccess, setIsSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState('');

  // Fetch node details if editing — ab store ke shared nodes se
  useEffect(() => {
    if (editId) {
      const populateFromStore = (list) => {
        const currentMode = list.find(n => n._id === editId);
        if (currentMode) {
          setFormData(prev => ({
            ...prev,
            nodeName: currentMode.title || '',
            status: currentMode.status || 'Active',
            region: currentMode.region || 'us-east',
            instanceType: currentMode.instanceType || 't3.medium',
            deploymentDate: currentMode.deploymentDate || '',
            cpuCores: currentMode.cpuCores || '4',
          }));
        }
      };

      if (nodes && nodes.length > 0) {
        populateFromStore(nodes);
      } else {
        fetchNodes().then(() => populateFromStore(useNexusStore.getState().nodes));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const validateForm = () => {
    const newErrors = {};
    
    const nameVal = formData.nodeName ? String(formData.nodeName).trim() : '';
    if (!nameVal) {
      newErrors.nodeName = 'Node designation name is required.';
    } else if (nameVal.length < 3) {
      newErrors.nodeName = 'Node name must be at least 3 characters long.';
    }

    if (!formData.deploymentDate) {
      newErrors.deploymentDate = 'Please select a valid scheduled deployment date.';
    }

    const keyVal = formData.accessKey ? String(formData.accessKey).trim() : '';
    if (!editId && (!keyVal || keyVal.length < 8)) {
      newErrors.accessKey = 'Secure API access key must be at least 8 characters.';
    }

    if (!editId && !formData.configFile) {
      newErrors.configFile = 'A configuration setup file (.json or .yaml) is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'configFile') {
      const file = files && files[0] ? files[0] : null;
      setFormData(prev => ({ ...prev, configFile: file }));
      if (file) setErrors(prev => ({ ...prev, configFile: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (value) setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmitClick = async () => {
    setToast({ message: '', type: '' });

    if (!validateForm()) {
      setToast({ message: 'Please fix the highlighted field errors before submission.', type: 'error' });
      return;
    }

    setIsSubmitting(true);

    try {
      if (editId) {
        await updateNodeFull(editId, {
          title: formData.nodeName,
          status: formData.status,
          region: formData.region,
          instanceType: formData.instanceType,
          deploymentDate: formData.deploymentDate,
          cpuCores: formData.cpuCores
        });

        setSuccessDetails(`AI Server Node "${formData.nodeName}" has been updated successfully!`);
      } else {
        const data = new FormData();
        data.append('nodeName', formData.nodeName);
        data.append('status', formData.status);
        data.append('region', formData.region);
        data.append('instanceType', formData.instanceType);
        data.append('deploymentDate', formData.deploymentDate);
        data.append('cpuCores', formData.cpuCores);
        data.append('accessKey', formData.accessKey);
        if (formData.configFile) data.append('configFile', formData.configFile);

        await deployNode(data);

        setSuccessDetails(`AI Server Node "${formData.nodeName}" deployed successfully in ${formData.region}!`);
      }

      // Trigger Success Screen State
      setIsSuccess(true);

    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If successfully submitted, show clean Success Screen View
  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto mt-16 p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-slate-100 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Operation Successful!</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto">{successDetails}</p>
        </div>
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-400 space-y-1">
          <p><strong className="text-slate-300">Status:</strong> {formData.status}</p>
          <p><strong className="text-slate-300">Region:</strong> {formData.region}</p>
          <p><strong className="text-slate-300">CPU Cores:</strong> {formData.cpuCores} vCPUs</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/30 text-sm cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <Server className="w-8 h-8 text-indigo-400" />
        <div>
          <h2 className="text-xl font-bold text-white">
            {editId ? 'Edit AI Cluster Node' : 'Deploy New AI Cluster Node'}
          </h2>
          <p className="text-xs text-slate-400">Configure telemetry credentials, parameters, and configuration bundle securely.</p>
        </div>
      </div>

      {toast.message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
          toast.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/15 border border-red-500/30 text-red-400'
        }`}>
          {toast.type === 'success' ? <ShieldCheck className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-medium mb-1 text-slate-300">Node Designation Name</label>
          <input
            type="text"
            name="nodeName"
            value={formData.nodeName}
            onChange={handleChange}
            placeholder="e.g., node-cluster-us-west-01"
            className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 ${
              errors.nodeName ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800'
            }`}
          />
          {errors.nodeName && <p className="mt-1 text-xs text-red-400 font-medium">{errors.nodeName}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium mb-1 text-slate-300">Node Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
          >
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Optimizing">Optimizing</option>
            <option value="Active (Updated)">Active (Updated)</option>
            <option value="Stopped">Stopped</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1 text-slate-300">Deployment Region</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="us-east">US East (N. Virginia)</option>
              <option value="us-west">US West (Oregon)</option>
              <option value="eu-central">EU Central (Frankfurt)</option>
              <option value="ap-south">AP South (Mumbai)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-slate-300">Instance Specification</label>
            <select
              name="instanceType"
              value={formData.instanceType}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="t3.medium">t3.medium (Standard Compute)</option>
              <option value="c6i.xlarge">c6i.xlarge (Compute Optimized)</option>
              <option value="g4dn.xlarge">g4dn.xlarge (GPU Accelerated AI)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1 text-slate-300">Scheduled Date</label>
            <input
              type="date"
              name="deploymentDate"
              value={formData.deploymentDate}
              onChange={handleChange}
              className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 ${
                errors.deploymentDate ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800'
              }`}
            />
            {errors.deploymentDate && <p className="mt-1 text-xs text-red-400 font-medium">{errors.deploymentDate}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-slate-300">Allocated CPU Cores</label>
            <select
              name="cpuCores"
              value={formData.cpuCores}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="2">2 vCPUs</option>
              <option value="4">4 vCPUs</option>
              <option value="8">8 vCPUs</option>
              <option value="16">16 vCPUs</option>
            </select>
          </div>
        </div>

        {!editId && (
          <div>
            <label className="block text-xs font-medium mb-1 text-slate-300">Cluster Access Key</label>
            <input
              type="password"
              name="accessKey"
              value={formData.accessKey}
              onChange={handleChange}
              placeholder="Enter minimum 8-character secure key"
              className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 ${
                errors.accessKey ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800'
              }`}
            />
            {errors.accessKey && <p className="mt-1 text-xs text-red-400 font-medium">{errors.accessKey}</p>}
          </div>
        )}

        {!editId && (
          <div>
            <label className="block text-xs font-medium mb-1 text-slate-300">Node Config / Schema File</label>
            <div className="flex items-center justify-center w-full">
              <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer bg-slate-950 hover:bg-slate-900 ${
                errors.configFile ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800'
              }`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                  <Upload className="w-6 h-6 mb-2 text-indigo-400" />
                  <p className="text-xs text-slate-300 text-center">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">JSON, YAML or PEM (MAX. 5MB)</p>
                  {formData.configFile && <p className="text-xs text-emerald-400 mt-1 font-medium">Selected: {formData.configFile.name}</p>}
                </div>
                <input type="file" name="configFile" onChange={handleChange} className="hidden" accept=".json,.yaml,.yml,.pem" />
              </label>
            </div>
            {errors.configFile && <p className="mt-1 text-xs text-red-400 font-medium">{errors.configFile}</p>}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmitClick}
          disabled={isSubmitting}
          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-medium py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30 text-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span>{editId ? 'Updating Cluster Node...' : 'Deploying Cluster Node...'}</span>
            </>
          ) : (
            <span>🚀 {editId ? 'Save Changes' : 'Execute Secure Deployment'}</span>
          )}
        </button>
      </div>
    </div>
  );
}