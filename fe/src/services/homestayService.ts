import api from './api';
import { Homestay } from '../types';

export const homestayService = {
  // Get all homestays
  getHomestays: async (filters?: any): Promise<Homestay[]> => {
    try {
      const response = await api.get('/homestays', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching homestays:', error);
      throw error;
    }
  },

  // Get homestay by ID
  getHomestayById: async (id: string): Promise<Homestay> => {
    try {
      const response = await api.get(`/homestays/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching homestay:', error);
      throw error;
    }
  },

  // Create new homestay
  createHomestay: async (homestayData: Omit<Homestay, 'id'>): Promise<Homestay> => {
    try {
      const response = await api.post('/homestays', homestayData);
      return response.data;
    } catch (error) {
      console.error('Error creating homestay:', error);
      throw error;
    }
  },

  // Update homestay
  updateHomestay: async (id: string, homestayData: Partial<Homestay>): Promise<Homestay> => {
    try {
      const response = await api.put(`/homestays/${id}`, homestayData);
      return response.data;
    } catch (error) {
      console.error('Error updating homestay:', error);
      throw error;
    }
  },

  // Delete homestay
  deleteHomestay: async (id: string): Promise<void> => {
    try {
      await api.delete(`/homestays/${id}`);
    } catch (error) {
      console.error('Error deleting homestay:', error);
      throw error;
    }
  },

  // Search homestays
  searchHomestays: async (query: string, filters?: any): Promise<Homestay[]> => {
    try {
      const response = await api.get('/homestays/search', { 
        params: { q: query, ...filters } 
      });
      return response.data;
    } catch (error) {
      console.error('Error searching homestays:', error);
      throw error;
    }
  }
};