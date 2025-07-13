import api from './api';
import { Booking } from '../types';

export const bookingService = {
  // Get all bookings for a user
  getUserBookings: async (userId: string): Promise<Booking[]> => {
    try {
      const response = await api.get(`/api/bookings/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  // Get bookings for a homestay
  getHomestayBookings: async (homestayId: string): Promise<Booking[]> => {
    try {
      const response = await api.get(`/api/bookings/homestay/${homestayId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching homestay bookings:', error);
      throw error;
    }
  },

  // Create new booking
  createBooking: async (bookingData: Omit<Booking, 'id'>): Promise<Booking> => {
    try {
      const response = await api.post('/api/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Update booking status
  updateBookingStatus: async (id: string, status: Booking['status']): Promise<Booking> => {
    try {
      const response = await api.patch(`/api/bookings/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/bookings/${id}`);
    } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;
    }
  },

  // Get booking by ID
  getBookingById: async (id: string): Promise<Booking> => {
    try {
      const response = await api.get(`/api/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }
};