import axios from 'axios';

const API_URL = '/api/auth';

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Get current user
const getCurrentUser = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    throw new Error('No user found');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  
  const response = await axios.get(`${API_URL}/me`, config);
  
  return response.data;
};

// Update profile
const updateProfile = async (userData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    throw new Error('No user found');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  
  const response = await axios.put(`${API_URL}/profile`, userData, config);
  
  // Update user in localStorage
  const updatedUser = { ...user, ...response.data };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  return response.data;
};

// Change password
const changePassword = async (passwordData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    throw new Error('No user found');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  
  const response = await axios.put(`${API_URL}/password`, passwordData, config);
  
  return response.data;
};

// Forgot password
const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  
  return response.data;
};

// Reset password
const resetPassword = async (token, password) => {
  const response = await axios.post(`${API_URL}/reset-password`, {
    token,
    password,
  });
  
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};

export default authService;
