import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://backend-rfyi.onrender.com'
  : 'http://localhost:5000';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
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
