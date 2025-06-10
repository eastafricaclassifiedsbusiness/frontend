import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const register = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      return { success: true, data: response.data };
    }
    return { success: true, data: response.data };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.msg || 'Registration failed' 
    };
  }
};

export const login = async (email: string, password: string, userType: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password, userType });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      return { success: true, data: response.data };
    }
    return { success: true, data: response.data };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.msg || 'Login failed' 
    };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const response = await axios.get(`${API_URL}/auth/user`, {
      headers: { 'x-auth-token': token }
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    logout();
    return { 
      success: false, 
      error: error.response?.data?.msg || 'Failed to get user data' 
    };
  }
};

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

export const sendVerificationOTP = async (phoneNumber: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/send-otp`, { phoneNumber });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.msg || 'Failed to send OTP' 
    };
  }
};