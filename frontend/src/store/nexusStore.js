import { create } from 'zustand';
import { safeLocalStorage, safeSessionStorage } from '../utils/safeStorage';
import { getSocket } from '../utils/socket';

const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5001/api'
  : (import.meta.env.VITE_API_URL || 'https://nexus-ai-production-72d2.up.railway.app/api');

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
  role: safeSessionStorage.getItem('role') || safeLocalStorage.getItem('role') || 'user',

  loginUser: (token, email, role) => {
    try {
      if (token) {
        safeSessionStorage.setItem('token', token);
        console.log("Token successfully saved to sessionStorage:", token);
      }
      if (email) {
        safeSessionStorage.setItem('userEmail', email);
        console.log("Email successfully saved to sessionStorage:", email);
      }
      if (role) {
        safeSessionStorage.setItem('role', role);
      }
      set({ token, isAuthenticated: true, role: role || 'user' });

      // Join this user's private room so real-time node events (deploy/
      // update/delete) are scoped to them instead of broadcast globally.
      if (email) {
        getSocket().emit('join', email);
      }
    } catch (err) {
      console.error("Error saving to sessionStorage:", err);
    }
  },

  logoutUser: () => {
    safeSessionStorage.removeItem('token');
    safeSessionStorage.removeItem('userEmail');
    safeSessionStorage.removeItem('role');
    safeLocalStorage.removeItem('token');
    safeLocalStorage.removeItem('role');
    set({ token: null, isAuthenticated: false, role: 'user' });
  },

  // --- THEME (light / dark) ---
  theme: safeLocalStorage.getItem('theme') || 'dark',

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    safeLocalStorage.setItem('theme', next);
    set({ theme: next });
  },

  // --- NODES STATE & ACTIONS ---
  nodes: [],
  isLoading: false,

  // Wires up the socket.io listeners once (e.g. from a top-level effect
  // in App.jsx) so any node created/updated/deleted — from this tab,
  // another tab, or another device logged into the same account — is
  // reflected in the dashboard immediately without a manual refresh.
  subscribeToNodeEvents: () => {
    const socket = getSocket();

    socket.off('node:created');
    socket.off('node:updated');
    socket.off('node:deleted');

    socket.on('node:created', (node) => {
      set((state) => (
        state.nodes.some((n) => n._id === node._id)
          ? state
          : { nodes: [node, ...state.nodes] }
      ));
    });

    socket.on('node:updated', (node) => {
      set((state) => ({
        nodes: state.nodes.map((n) => (n._id === node._id ? node : n))
      }));
    });

    socket.on('node:deleted', ({ id }) => {
      set((state) => ({
        nodes: state.nodes.filter((n) => n._id !== id)
      }));
    });
  },

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