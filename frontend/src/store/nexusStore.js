import { create } from 'zustand';
import { safeLocalStorage, safeSessionStorage } from '../utils/safeStorage';

const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5001/api'
  : (import.meta.env.VITE_API_URL || 'https://nexusaibackend-production.up.railway.app/api');

const getAuthHeaders = () => {
  const token = safeSessionStorage.getItem('token') || safeLocalStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const useNexusStore = create((set, get) => ({
  // --- AUTH STATE & ACTIONS ---
  token: safeSessionStorage.getItem('token') || safeLocalStorage.getItem('token') || null,
  isAuthenticated: !!(safeSessionStorage.getItem('token') || safeLocalStorage.getItem('token')),

  loginUser: (token, email) => {
    try {
      if (token) {
        safeSessionStorage.setItem('token', token);
        console.log("Token successfully saved to sessionStorage:", token);
      }
      if (email) {
        safeSessionStorage.setItem('userEmail', email);
        console.log("Email successfully saved to sessionStorage:", email);
      }
      set({ token, isAuthenticated: true });
    } catch (err) {
      console.error("Error saving to sessionStorage:", err);
    }
  },

  logoutUser: () => {
    safeSessionStorage.removeItem('token');
    safeSessionStorage.removeItem('userEmail');
    safeLocalStorage.removeItem('token');
    set({ token: null, isAuthenticated: false });
  },

  // --- NODES STATE & ACTIONS ---
  nodes: [],
  isLoading: false,

  fetchNodes: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/nodes`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        set({ nodes: data, isLoading: false });
      } else {
        set({ isLoading: false });
        console.error('Failed to fetch nodes');
      }
    } catch (err) {
      set({ isLoading: false });
      console.error('Error fetching nodes:', err);
    }
  },

  createNode: async (newTitle) => {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch(`${API_URL}/nodes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: newTitle, status: 'Active' })
      });
      if (res.ok) {
        get().fetchNodes();
      }
    } catch (err) {
      console.error('Error creating node:', err);
    }
  },

  deleteNode: async (id) => {
    try {
      const res = await fetch(`${API_URL}/nodes/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) get().fetchNodes();
    } catch (err) {
      console.error('Error deleting node:', err);
    }
  },

  updateNode: async (id, editTitle, callback) => {
    try {
      const res = await fetch(`${API_URL}/nodes/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: editTitle })
      });
      if (res.ok) {
        get().fetchNodes();
        if (callback) callback();
      }
    } catch (err) {
      console.error('Error updating node:', err);
    }
  },

  // --- DEPLOY NODE FORM: FULL CREATE/UPDATE ---
  // Yeh actions DeployNodeForm ke liye hain taake wo bhi shared nodes state use kare,
  // apna alag duplicate fetch/token logic na rakhe.
  deployNode: async (formData) => {
    const token = safeSessionStorage.getItem('token') || safeLocalStorage.getItem('token');
    const res = await fetch(`${API_URL}/nodes/deploy`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Server-side validation failed during node deployment.');
    get().fetchNodes();
    return result;
  },

  updateNodeFull: async (id, payload) => {
    const res = await fetch(`${API_URL}/nodes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update node.');
    get().fetchNodes();
    return result;
  }
}));