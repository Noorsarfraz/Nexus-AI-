// Some environments (e.g. Node.js 25+ running Vitest/jsdom) ship a broken or
// partial `localStorage`/`sessionStorage` global — the object exists but
// methods like `.getItem` are missing, which throws
// "TypeError: localStorage.getItem is not a function" the moment any code
// touches it at import time. This wrapper checks that the real Storage API
// actually works before using it, and transparently falls back to an
// in-memory store otherwise, so the rest of the app never has to care.

function createSafeStorage(storage) {
  try {
    if (storage && typeof storage.getItem === 'function' && typeof storage.setItem === 'function') {
      return storage;
    }
  } catch {
    // accessing the storage object itself threw — fall through to the memory store
  }

  const memory = new Map();
  return {
    getItem: (key) => (memory.has(key) ? memory.get(key) : null),
    setItem: (key, value) => memory.set(key, String(value)),
    removeItem: (key) => memory.delete(key),
    clear: () => memory.clear(),
  };
}

export const safeLocalStorage = createSafeStorage(
  typeof window !== 'undefined' ? window.localStorage : undefined
);

export const safeSessionStorage = createSafeStorage(
  typeof window !== 'undefined' ? window.sessionStorage : undefined
);