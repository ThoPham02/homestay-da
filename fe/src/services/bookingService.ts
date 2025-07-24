import api from './api';
import { toastService } from './toastService';

export const bookingService = {
  // Lọc danh sách booking (filter)
  filterBookings: async (params: any): Promise<any> => {
    const response = await api.get('/api/host/booking', { params });
    return response.data;
  },

  // Tạo booking mới
  createBooking: async (bookingData: any): Promise<any> => {
    const response = await api.post('/api/host/booking', bookingData);

    toastService.success('Tạo booking thành công');
    return response.data;
  },

  // Tạo booking cho khách
  createGuestBooking: async (bookingData: any): Promise<any> => {
    const response = await api.post('/api/guest/booking', bookingData);

    toastService.success('Tạo booking thành công');
    return response.data;
  },

  // Lấy chi tiết booking
  getBookingDetail: async (id: number): Promise<any> => {
    const response = await api.get(`/api/booking/${id}`);
    return response.data;
  },

  // Cập nhật trạng thái booking
  updateBookingStatus: async (id: number, status: string): Promise<any> => {
    const response = await api.put(`/api/host/booking/${id}/status`, { status });

    if (response.status === 200) {
      toastService.success('Cập nhật trạng thái booking thành công');
    } else {
      toastService.error('Cập nhật trạng thái booking thất bại');
    }
    return response.data;
  },
};