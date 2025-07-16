import api from './api';

export const bookingService = {
  // Lọc danh sách booking (filter)
  filterBookings: async (params: any): Promise<any> => {
    const response = await api.get('/api/booking', { params });
    return response.data;
  },

  // Tạo booking mới
  createBooking: async (bookingData: any): Promise<any> => {
    const response = await api.post('/api/booking', bookingData);
    return response.data;
  },

  // Lấy chi tiết booking
  getBookingDetail: async (id: number): Promise<any> => {
    const response = await api.get(`/api/booking/${id}`);
    return response.data;
  },

  // Cập nhật trạng thái booking
  updateBookingStatus: async (id: number, status: string): Promise<any> => {
    const response = await api.patch(`/api/booking/${id}/status`, { status });
    return response.data;
  },
};