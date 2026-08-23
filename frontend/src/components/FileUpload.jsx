import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, Trash2, CheckCircle2, AlertCircle, Loader2, Eye, Download, X } from 'lucide-react';
import { safeLocalStorage, safeSessionStorage } from '../utils/safeStorage';

const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5001/api'
  : (import.meta.env.VITE_API_URL || 'https://nexus-ai-production-72d2.up.railway.app/api');

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [uploadsList, setUploadsList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  
  // State for In-App Preview Modal
  const [viewingFile, setViewingFile] = useState(null);

  const token = safeLocalStorage.getItem('token') || safeSessionStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchUploads();
    }
  }, [token]);

  const fetchUploads = async () => {
    try {
      setIsFetching(true);
      const res = await fetch(`${API_URL}/uploads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setUploadsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching uploads:', err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleFileSelect = (selectedFile) => {
    setError('');
    setSuccessMsg('');

    if (!selectedFile) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Unsupported file type! Only images and PDFs are allowed.');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('File is too large! Maximum file size allowed is 10MB.');
      return;
    }

    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setUploadProgress(0);
    setError('');
    setSuccessMsg('');

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/uploads`, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setIsLoading(false);
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          setSuccessMsg('File successfully uploaded to Cloudinary!');
          setFile(null);
          setPreview(null);
          setUploadProgress(0);
          fetchUploads();
        } else {
          throw new Error(data.error || 'Failed to upload file.');
        }
      } catch (err) {
        setError(err.message || 'Server error during upload.');
      }
    };

    xhr.onerror = () => {
      setIsLoading(false);
      setError('Network error occurred during file upload.');
    };

    xhr.send(formData);
  };

  const handleDownload = async (fileUrl, originalName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = originalName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed, opening in new tab instead:', err);
      window.open(fileUrl, '_blank');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/uploads/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUploadsList(uploadsList.filter(item => item._id !== id && item.id !== id));
      }
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  return (
    <div className="w-full mx-auto p-6 md:p-8 bg-slate-900/50 text-white rounded-2xl shadow-xl border border-slate-800 backdrop-blur-xl relative">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
        <UploadCloud className="text-indigo-400" /> Secure File & Config Upload
      </h2>
      <p className="text-slate-400 text-sm mb-6">Upload images or server cluster documents securely with real-time preview and progress tracking.</p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle size={18} /> {error}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500 text-emerald-300 rounded-lg flex items-center gap-2 text-sm">
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      <form onSubmit={handleUploadSubmit} className="space-y-4">
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-8 text-center cursor-pointer bg-slate-800/50 transition duration-200 relative"
        >
          <input 
            type="file" 
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLoading}
          />
          
          {preview ? (
            <div className="flex flex-col items-center">
              <img src={preview} alt="Preview" className="h-32 object-contain rounded-lg mb-2 border border-slate-700" />
              <p className="text-sm text-slate-300">{file?.name}</p>
              <span className="text-xs text-indigo-400 mt-1">Click or drag to change file</span>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center">
              <FileText size={48} className="text-indigo-400 mb-2" />
              <p className="text-sm font-medium">{file.name}</p>
              <span className="text-xs text-slate-400">{(file.size / 1024).toFixed(2)} KB</span>
              <span className="text-xs text-indigo-400 mt-1">Ready for upload</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <UploadCloud size={48} className="text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-200">Drag & drop your file here, or <span className="text-indigo-400 underline">browse</span></p>
              <p className="text-xs text-slate-500 mt-1">Supports: PNG, JPG, WEBP, GIF, PDF (Max 10MB)</p>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Uploading to Cloudinary...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {file && !isLoading && (
          <button 
            type="submit" 
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
          >
            <UploadCloud size={20} />
            Upload File Now
          </button>
        )}
      </form>

      <div className="mt-8 pt-6 border-t border-slate-800/80">
        <h3 className="text-lg font-semibold mb-4 text-white">Your Uploaded Files</h3>
        
        {isFetching ? (
          <div className="flex justify-center py-6"><Loader2 className="animate-spin text-indigo-400" size={24} /></div>
        ) : (
          <div className="space-y-3">
            {uploadsList.length === 0 ? (
              <p className="text-sm text-slate-500">No files uploaded yet.</p>
            ) : (
              uploadsList.map((item) => (
                <div key={item._id || item.id} className="flex items-center justify-between p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {item.mimetype && item.mimetype.startsWith('image/') ? (
                      <img src={item.fileUrl} alt={`Thumbnail of ${item.originalName}`} className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-indigo-400"><FileText size={20} /></div>
                    )}
                    <div className="truncate">
                      <p className="text-sm font-medium truncate text-white">{item.originalName}</p>
                      <p className="text-xs text-slate-400">{(item.sizeBytes / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* View Button Triggers In-App Modal */}
                    <button 
                      type="button"
                      onClick={() => setViewingFile(item)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-xs rounded transition flex items-center gap-1 text-slate-200 border border-slate-700/50 cursor-pointer"
                      title="Preview File"
                    >
                      <Eye size={16} />
                    </button>

                    <button 
                      type="button"
                      onClick={() => handleDownload(item.fileUrl, item.originalName)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-xs rounded transition flex items-center gap-1 text-slate-200 border border-slate-700/50 cursor-pointer"
                      title="Download File"
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleDelete(item._id || item.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition cursor-pointer border border-red-500/20"
                      title="Delete File"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* --- IN-APP PREVIEW MODAL --- */}
      {viewingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2 truncate">
                <FileText className="text-indigo-400 shrink-0" size={20} />
                <h3 className="text-sm font-semibold text-white truncate">{viewingFile.originalName}</h3>
              </div>
              <button 
                onClick={() => setViewingFile(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Content Viewer */}
            <div className="flex-1 bg-slate-950 flex items-center justify-center overflow-hidden p-2">
              {viewingFile.mimetype && viewingFile.mimetype.startsWith('image/') ? (
                <img 
                  src={viewingFile.fileUrl} 
                  alt={`Full preview of ${viewingFile.originalName}`} 
                  className="max-h-full max-w-full object-contain rounded-lg" 
                />
              ) : (
                <iframe 
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(viewingFile.fileUrl)}&embedded=true`} 
                  className="w-full h-full rounded-lg border-0 bg-white"
                  title="PDF Preview"
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end px-6 py-3 border-t border-slate-800 bg-slate-950 gap-3">
              <button
                type="button"
                onClick={() => handleDownload(viewingFile.fileUrl, viewingFile.originalName)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Download size={14} /> Download File
              </button>
              <button
                type="button"
                onClick={() => setViewingFile(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}