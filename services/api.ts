import axios from 'axios';

// Use the Render backend URL
const API_URL = 'https://backend-rfyi.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Enable credentials for cross-origin requests
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      
      // Handle specific error cases
      if (error.response.status === 401) {
        // Clear token and redirect to login if unauthorized
        localStorage.removeItem('token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject({ msg: 'Session expired. Please login again.' });
      }
      
      if (error.response.status === 500) {
        return Promise.reject({ msg: 'Server error. Please try again later.' });
      }
      
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
      
      // Check if it's a network error
      if (error.message === 'Network Error') {
        return Promise.reject({ msg: 'Network error. Please check your internet connection.' });
      }
      
      return Promise.reject({ msg: 'No response from server. Please try again.' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
      return Promise.reject({ msg: error.message });
    }
  }
);

export const authService = {
  async register(userData: FormData) {
    const response = await api.post('/auth/register', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Also store token in cookie for middleware checks (expires in 1 day)
      if (typeof document !== 'undefined') {
        document.cookie = `token=${response.data.token}; path=/; max-age=86400`;
      }
    }
    return response.data;
  },

  async login(email: string, password: string, userType: string) {
    const response = await api.post('/auth/login', { email, password, userType });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Also store token in cookie for middleware checks (expires in 1 day)
      if (typeof document !== 'undefined') {
        document.cookie = `token=${response.data.token}; path=/; max-age=86400`;
      }
    }
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/user');
    return response.data;
  },

  async sendOTP(email: string) {
    const response = await api.post('/auth/send-otp', { email });
    return response.data;
  },

  async verifyOTP(email: string, otp: string) {
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

// Profile API functions
export const profileService = {
  getProfile: async () => {
    try {
      const response = await api.get('/profile/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to fetch profile');
    }
  },

  updateProfile: async (profileData: any) => {
    try {
      const response = await api.post('/profile', profileData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to update profile');
    }
  },

  deleteProfile: async () => {
    try {
      const response = await api.delete('/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to delete profile');
    }
  }
};

// Settings API functions
export const settingsService = {
  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    try {
      console.log('Sending password change request:', { 
        hasCurrentPassword: !!passwordData.currentPassword,
        hasNewPassword: !!passwordData.newPassword
      });
      
      const response = await api.post('/settings/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      console.log('Password change response:', response.data);
      
      // Update token in localStorage if a new one is provided
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Password change error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.msg || 'Failed to change password');
    }
  },

  getNotificationPreferences: async () => {
    try {
      const response = await api.get('/settings/notifications');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to fetch notification preferences');
    }
  },

  updateNotificationPreferences: async (preferences: {
    emailNotifications: boolean;
    jobAlerts: boolean;
    applicationUpdates: boolean;
    marketingEmails: boolean;
  }) => {
    try {
      const response = await api.post('/settings/notifications', preferences);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to update notification preferences');
    }
  }
};

export default api; 
