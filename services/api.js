import axios from 'axios';

let API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL && typeof window !== 'undefined') {
  // If no env variable is set, fall back to the same host the frontend is served from
  API_URL = `${window.location.origin}/api`;
}

if (!API_URL) {
  // Final fallback (useful for server-side rendering)
  API_URL = 'http://localhost:5000/api';
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add retry logic for failed requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is a network error and we haven't retried yet
    if (error.message === 'Network Error' && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Wait for 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Retry the request
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

// Add a request interceptor to include JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------- Auth ----------
export const authService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (typeof document !== 'undefined') {
          document.cookie = `token=${response.data.token}; path=/; max-age=86400`;
        }
      }
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please check your internet connection and try again.');
      }
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to the server. Please check if the server is running and try again.');
      }
      throw error;
    }
  },

  async login(email, password, userType) {
    try {
      const response = await api.post('/auth/login', { email, password, userType });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (typeof document !== 'undefined') {
          document.cookie = `token=${response.data.token}; path=/; max-age=86400`;
        }
      }
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please check your internet connection and try again.');
      }
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to the server. Please check if the server is running and try again.');
      }
      throw error;
    }
  },

  async getCurrentUser() {
    const response = await api.get('/auth/user');
    return response.data;
  },

  async sendOTP(email) {
    const response = await api.post('/auth/send-otp', { email });
    return response.data;
  },

  async verifyOTP(email, otp) {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

// ---------- Profile ----------
export const profileService = {
  async getProfile() {
    try {
      const response = await api.get('/profile/me');
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.msg || 'Failed to fetch profile');
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await api.post('/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.msg || 'Failed to update profile');
    }
  },

  async deleteProfile() {
    try {
      const response = await api.delete('/profile');
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.msg || 'Failed to delete profile');
    }
  },
};

// ---------- Settings ----------
export const settingsService = {
  async changePassword({ currentPassword, newPassword }) {
    try {
      const response = await api.post('/settings/password', { currentPassword, newPassword });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (typeof document !== 'undefined') {
          document.cookie = `token=${response.data.token}; path=/; max-age=86400`;
        }
      }
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.msg || 'Failed to change password');
    }
  },

  async getNotificationPreferences() {
    try {
      const response = await api.get('/settings/notifications');
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.msg || 'Failed to fetch notification preferences');
    }
  },

  async updateNotificationPreferences(preferences) {
    try {
      const response = await api.post('/settings/notifications', preferences);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.msg || 'Failed to update notification preferences');
    }
  },
};

export default api; 