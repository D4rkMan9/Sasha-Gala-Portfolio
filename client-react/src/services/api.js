const BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const apiFetch = async (endpoint, options = {}) => {
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (response.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
      throw new Error('Session expired');
    }
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const uploadWithAuth = (url, formData) => {
  const token = localStorage.getItem('adminToken');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  }).then(res => {
    if (res.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
      throw new Error('Session expired');
    }
    return res.json();
  });
};

export const projectService = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/projects${qs ? '?' + qs : ''}`);
  },
  getById: (id) => apiFetch(`/projects/${id}`),
  getByName: (name) => apiFetch(`/projects/name/${encodeURIComponent(name)}`),
  getImages: () => apiFetch('/projectimages'),
  getArchive: () => apiFetch('/archive'),
  add: (data) => apiFetch('/add-project', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/projects/${id}`, { method: 'DELETE' }),
  update: (id, data) => apiFetch(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteImage: (imgId) => apiFetch(`/images/${imgId}`, { method: 'DELETE' }),
  uploadImage: (formData) => uploadWithAuth('/api/upload', formData),
};

export const archiveService = {
  getAll: () => apiFetch('/archive'),
  upload: (formData) => uploadWithAuth('/api/archive', formData),
  reorder: (items) => apiFetch('/archive/reorder', { method: 'PUT', body: JSON.stringify({ items }) }),
  deleteImage: (imgId) => apiFetch(`/images/${imgId}`, { method: 'DELETE' }),
};

export const siteConfigService = {
  get: () => apiFetch('/site-config'),
  update: (configData) => apiFetch('/site-config', { method: 'PUT', body: JSON.stringify({ config_data: configData }) }),
};
