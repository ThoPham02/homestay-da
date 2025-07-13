import api from './api';
import { User } from '../types';

export const authService = {
  // Login user
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      
      return { user, token };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Register user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'guest' | 'host';
  }): Promise<{ user: User; token: string }> => {
    try {
      const response = await api.post('/auth/register', userData);
      const { user, token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      
      return { user, token };
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error logging out:', error);
      localStorage.removeItem('authToken');
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  // Refresh token
  refreshToken: async (): Promise<string> => {
    try {
      const response = await api.post('/auth/refresh');
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      return token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
};