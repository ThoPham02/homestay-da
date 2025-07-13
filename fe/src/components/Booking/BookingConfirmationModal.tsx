import React from 'react';
import { X, Calendar, Users, MapPin, CreditCard, Check, Bed } from 'lucide-react';
import { Homestay, Room } from '../../types';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  homestay: Homestay;
  bookingData: any;
  totalPrice: number;
  selectedRoom?: Room;
}

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  homestay,
  bookingData,
  totalPrice,
  selectedRoom
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const pricePerNight = selectedRoom ? selectedRoom.price : homestay.price;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Xác nhận đặt phòng</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Homestay Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={homestay.images[0]}
                alt={homestay.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{homestay.name}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{homestay.location}</span>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-600 ml-1">
                    {homestay.rating} ({homestay.reviews} đánh giá)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Room Info */}
          {selectedRoom && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Bed className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-emerald-900">Phòng đã chọn</span>
              </div>
              <div className="flex items-center space-x-4">
                <img
                  src={selectedRoom.images[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={selectedRoom.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-emerald-900">{selectedRoom.name}</h4>
                  <p className="text-sm text-emerald-700">
                    {selectedRoom.type === 'single' ? 'Phòng đơn' :
                     selectedRoom.type === 'double' ? 'Phòng đôi' :
                     selectedRoom.type === 'suite' ? 'Phòng suite' : 'Phòng tập thể'} • 
                    {selectedRoom.capacity} khách
                  </p>
                  <p className="text-sm text-emerald-600 font-medium">
                    {formatPrice(selectedRoom.price)}/đêm
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Booking Details */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Chi tiết đặt phòng</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Nhận phòng</span>
                </div>
                <p className="text-blue-800">{formatDate(bookingData.checkIn)}</p>
                <p className="text-sm text-blue-600">Từ 14:00</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-orange-900">Trả phòng</span>
                </div>
                <p className="text-orange-800">{formatDate(bookingData.checkOut)}</p>
                <p className="text-sm text-orange-600">Trước 12:00</p>
              </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-emerald-900">Số khách</span>
              </div>
              <p className="text-emerald-800">{bookingData.guests} người</p>
            </div>
          </div>

          {/* Guest Information */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Thông tin khách hàng</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Họ tên:</span>
                  <p className="font-medium text-gray-900">{bookingData.guestName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-medium text-gray-900">{bookingData.email}</p>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Số điện thoại:</span>
                <p className="font-medium text-gray-900">{bookingData.phone}</p>
              </div>
              {bookingData.notes && (
                <div>
                  <span className="text-sm text-gray-600">Ghi chú:</span>
                  <p className="font-medium text-gray-900">{bookingData.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Chi tiết thanh toán</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  {formatPrice(pricePerNight)} x {nights} đêm
                  {selectedRoom && (
                    <span className="block text-sm text-gray-500">({selectedRoom.name})</span>
                  )}
                </span>
                <span className="font-medium">{formatPrice(pricePerNight * nights)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phí dịch vụ</span>
                <span className="font-medium">{formatPrice(0)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Thuế</span>
                <span className="font-medium">{formatPrice(0)}</span>
              </div>
              
              <hr className="border-gray-300" />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-gray-900">Tổng cộng</span>
                <span className="text-emerald-600">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-yellow-800 mb-2">Chính sách hủy phòng</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Hủy miễn phí trước 24 giờ check-in</li>
              <li>• Hủy trong vòng 24 giờ: phí 50% tổng tiền</li>
              <li>• Không hoàn tiền nếu không đến</li>
            </ul>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">Điều khoản và điều kiện</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Vui lòng mang theo CMND/CCCD khi check-in</li>
              <li>• Không được tổ chức tiệc tùng, gây ồn ào</li>
              <li>• Không hút thuốc trong phòng</li>
              <li>• Tuân thủ quy định về số lượng khách</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Quay lại chỉnh sửa
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Check className="h-5 w-5" />
              <span>Xác nhận đặt phòng</span>
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              <CreditCard className="h-4 w-4 inline mr-1" />
              Thông tin của bạn được bảo mật và an toàn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;