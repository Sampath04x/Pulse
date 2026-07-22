// services/api.js
const API_BASE = import.meta.env.VITE_API_URL || '';

export function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  return fetch(url, options);
}
