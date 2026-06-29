import axios from 'axios';

export const BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to admin requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token && config.url && !config.url.startsWith('/public')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses by clearing token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
    return Promise.reject(error);
  }
);

// =============== PUBLIC API ===============

export const publicApi = {
  getServices: () => api.get('/public/services'),
  getGallery: () => api.get('/public/gallery'),
  getContact: () => api.get('/public/contact'),
};

// =============== ADMIN AUTH API ===============

export const authApi = {
  login: (credentials) => api.post('/admin/auth/login', credentials),
};

// =============== ADMIN CMS API ===============

export const adminServicesApi = {
  getAll: () => api.get('/admin/services'),
  create: (formData) => api.post('/admin/services', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  update: (id, formData) => api.put(`/admin/services/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  delete: (id) => api.delete(`/admin/services/${id}`),
};

export const adminGalleryApi = {
  getAll: () => api.get('/admin/gallery'),
  create: (formData) => api.post('/admin/gallery', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  update: (id, formData) => api.put(`/admin/gallery/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  delete: (id) => api.delete(`/admin/gallery/${id}`),
};

export const adminContactApi = {
  getAll: () => api.get('/admin/contact'),
  update: (id, data) => api.put(`/admin/contact/${id}`, data),
};

export default api;
