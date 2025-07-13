import React, { useState } from 'react';
import { Calendar, MapPin, Users, Star, MessageCircle, CreditCard, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import ReviewModal from '../components/Review/ReviewModal';

const BookingHistory: React.FC = () => {
  const { user } = useAuth();
  const { homestays, getBookingsByUserId, addReview, getReviewByBookingId } = useData();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const bookings = user ? getBookingsByUserId(user.id) : [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const handleReviewHomestay = (booking: any) => {
    const homestay = homestays.find(h => h.id === booking.homestayId);
    if (homestay) {
      setSelectedBooking({ ...booking, homestay });
      setShowReviewModal(true);
    }
  };

  const handleSubmitReview = (review: any) => {
    addReview(review);
    alert('Cảm ơn bạn đã đánh giá! Đánh giá của bạn sẽ giúp ích cho những khách hàng khác.');
  };

  const canReview = (booking: any) => {
    return booking.status === 'completed' && !getReviewByBookingId(booking.id);
  };

  const hasReviewed = (booking: any) => {
    return !!getReviewByBookingId(booking.id);
  };

  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Chưa có đặt phòng nào</h2>
            <p className="text-gray-600 mb-8">Hãy khám phá và đặt homestay yêu thích của bạn!</p>
            <a
              href="/homestays"
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Khám phá homestay
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử đặt phòng</h1>
          <p className="text-gray-600">Quản lý và theo dõi các đặt phòng của bạn</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng đặt phòng</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã xác nhận</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoàn thành</p>
                <p className="text-2xl font-bold text-blue-600">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
              </div>
              <Star className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatPrice(bookings.reduce((sum, b) => sum + b.totalPrice, 0)).slice(0, -2)}đ
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Booking List */}
        <div className="space-y-6">
          {sortedBookings.map((booking) => {
            const homestay = homestays.find(h => h.id === booking.homestayId);
            if (!homestay) return null;

            return (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={homestay.images[0]}
                      alt={homestay.name}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {homestay.name}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{homestay.location}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div className="text-sm">
                          <div className="text-gray-600">Nhận phòng</div>
                          <div className="font-medium">{formatDate(booking.checkIn)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div className="text-sm">
                          <div className="text-gray-600">Trả phòng</div>
                          <div className="font-medium">{formatDate(booking.checkOut)}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <div className="text-sm">
                          <div className="text-gray-600">Số khách</div>
                          <div className="font-medium">{booking.guests} người</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Tổng tiền</div>
                        <div className="text-xl font-bold text-emerald-600">
                          {formatPrice(booking.totalPrice)}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        {canReview(booking) && (
                          <button
                            onClick={() => handleReviewHomestay(booking)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>Đánh giá</span>
                          </button>
                        )}

                        {hasReviewed(booking) && (
                          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1">
                            <Star className="h-4 w-4" />
                            <span>Đã đánh giá</span>
                          </span>
                        )}
                        
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                          Chi tiết
                        </button>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Ghi chú:</div>
                        <div className="text-sm text-gray-800">{booking.notes}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Review Modal */}
        {showReviewModal && selectedBooking && (
          <ReviewModal
            isOpen={showReviewModal}
            onClose={() => setShowReviewModal(false)}
            booking={selectedBooking}
            homestay={selectedBooking.homestay}
            onSubmit={handleSubmitReview}
          />
        )}
      </div>
    </div>
  );
};

export default BookingHistory;