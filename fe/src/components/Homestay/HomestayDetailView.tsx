import React, { useState } from 'react';
import { Star, MapPin, Users, Bed, Bath, Square, ArrowLeft, Calendar, CreditCard } from 'lucide-react';
import { Homestay } from '../../types';
import { useData } from '../../contexts/DataContext';
import ReviewList from '../Review/ReviewList';
import BookingConfirmationModal from '../Booking/BookingConfirmationModal';
import RoomSelectionModal from '../Room/RoomSelectionModal';

interface HomestayDetailViewProps {
  homestay: Homestay;
  onBack: () => void;
  onBook: (bookingData: any) => void;
}

const HomestayDetailView: React.FC<HomestayDetailViewProps> = ({ homestay, onBack, onBook }) => {
  const { getReviewsByHomestayId, getRoomsByHomestayId, getAvailableRooms } = useData();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    guestName: '',
    email: '',
    phone: '',
    notes: '',
    roomId: ''
  });
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showRoomSelection, setShowRoomSelection] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const reviews = getReviewsByHomestayId(homestay.id);
  const rooms = getRoomsByHomestayId(homestay.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateTotalPrice = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const price = selectedRoom ? selectedRoom.price : 0;
    return nights > 0 ? nights * price : 0;
  };

  const handleBookingFormSubmit = () => {
    // Validate form data
    if (!bookingData.checkIn || !bookingData.checkOut || !bookingData.guestName || !bookingData.email || !bookingData.phone) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    // Validate dates
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      alert('Ngày nhận phòng không thể là ngày trong quá khứ!');
      return;
    }

    if (checkOut <= checkIn) {
      alert('Ngày trả phòng phải sau ngày nhận phòng!');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      alert('Vui lòng nhập email hợp lệ!');
      return;
    }

    // Validate phone
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(bookingData.phone.replace(/\s/g, ''))) {
      alert('Vui lòng nhập số điện thoại hợp lệ (10-11 số)!');
      return;
    }

    // Check if homestay has rooms
    if (rooms.length > 0) {
      // Show room selection modal
      setShowRoomSelection(true);
    } else {
      // Show confirmation modal directly for homestay without rooms
      setShowConfirmationModal(true);
    }
  };

  const handleRoomSelection = (room: any) => {
    setSelectedRoom(room);
    setBookingData(prev => ({ ...prev, roomId: room.id }));
    setShowRoomSelection(false);
    setShowConfirmationModal(true);
  };

  const handleConfirmBooking = () => {
    const totalPrice = calculateTotalPrice();
    onBook({
      ...bookingData,
      homestayId: homestay.id,
      totalPrice,
      roomId: selectedRoom?.id || undefined
    });
    setShowConfirmationModal(false);
    setShowBookingForm(false);
    
    // Reset form
    setBookingData({
      checkIn: '',
      checkOut: '',
      guests: 1,
      guestName: '',
      email: '',
      phone: '',
      notes: '',
      roomId: ''
    });
    setSelectedRoom(null);
  };

  const getAvailableRoomsForDates = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return [];
    return getAvailableRooms(homestay.id, bookingData.checkIn, bookingData.checkOut);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Quay lại</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="relative h-96">
            <img
              src={homestay.images[currentImageIndex]}
              alt={homestay.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 flex space-x-2">
              {homestay.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md text-sm">
              {currentImageIndex + 1} / {homestay.images.length}
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{homestay.name}</h1>
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{homestay.rating}</span>
                    <span className="text-gray-500">({homestay.reviews} đánh giá)</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-6">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-lg">{homestay.location}</span>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'overview'
                          ? 'border-emerald-500 text-emerald-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Tổng quan
                    </button>
                    {rooms.length > 0 && (
                      <button
                        onClick={() => setActiveTab('rooms')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === 'rooms'
                            ? 'border-emerald-500 text-emerald-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Phòng ({rooms.length})
                      </button>
                    )}
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'reviews'
                          ? 'border-emerald-500 text-emerald-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Đánh giá ({reviews.length})
                    </button>
                  </nav>
                </div>

                {activeTab === 'overview' && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
                        <Users className="h-6 w-6 text-emerald-600" />
                        <div>
                          <p className="font-medium">{homestay.maxGuests}</p>
                          <p className="text-sm text-gray-500">Khách</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
                        <Bed className="h-6 w-6 text-emerald-600" />
                        <div>
                          <p className="font-medium">{homestay.bedrooms}</p>
                          <p className="text-sm text-gray-500">Phòng ngủ</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
                        <Bath className="h-6 w-6 text-emerald-600" />
                        <div>
                          <p className="font-medium">{homestay.bathrooms}</p>
                          <p className="text-sm text-gray-500">Phòng tắm</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
                        <Square className="h-6 w-6 text-emerald-600" />
                        <div>
                          <p className="font-medium">{homestay.area}m²</p>
                          <p className="text-sm text-gray-500">Diện tích</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">Mô tả</h2>
                      <p className="text-gray-700 leading-relaxed">{homestay.description}</p>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">Tiện nghi</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {homestay.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center space-x-2 p-3 bg-emerald-50 rounded-lg">
                            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                            <span className="text-emerald-800">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'rooms' && rooms.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">Phòng có sẵn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {rooms.map((room) => (
                        <div key={room.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={room.images[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400'}
                            alt={room.name}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-gray-900">{room.name}</h3>
                              <span className="text-emerald-600 font-bold">{formatPrice(room.price)}/đêm</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {room.type === 'single' ? 'Phòng đơn' :
                               room.type === 'double' ? 'Phòng đôi' :
                               room.type === 'suite' ? 'Phòng suite' : 'Phòng tập thể'} • {room.capacity} khách
                            </p>
                            <p className="text-sm text-gray-700 mb-3">{room.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {room.amenities.slice(0, 3).map((amenity, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                  {amenity}
                                </span>
                              ))}
                              {room.amenities.length > 3 && (
                                <span className="text-xs text-gray-500">+{room.amenities.length - 3}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">Đánh giá từ khách hàng</h2>
                    <ReviewList reviews={reviews} showAll={true} />
                  </div>
                )}
              </div>

              {/* Booking Card */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-xl sticky top-8">
                  <div className="text-center mb-6">
                    <p className="text-3xl font-bold text-emerald-600">
                      {rooms.length > 0 ? 'Từ ' + formatPrice(Math.min(...rooms.map(r => r.price))) : formatPrice(homestay.price)}
                    </p>
                    <p className="text-gray-500">/đêm</p>
                    {rooms.length > 0 && (
                      <p className="text-sm text-gray-600 mt-1">{rooms.length} phòng có sẵn</p>
                    )}
                  </div>

                  {!showBookingForm ? (
                    <button
                      onClick={() => setShowBookingForm(true)}
                      className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>Đặt phòng</span>
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nhận phòng *
                        </label>
                        <input
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          value={bookingData.checkIn}
                          onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Trả phòng *
                        </label>
                        <input
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          value={bookingData.checkOut}
                          onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                          min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số khách *
                        </label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          value={bookingData.guests}
                          onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                          required
                        >
                          {Array.from({length: homestay.maxGuests}, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>{num} khách</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Họ tên *
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          value={bookingData.guestName}
                          onChange={(e) => setBookingData({...bookingData, guestName: e.target.value})}
                          placeholder="Nhập họ tên"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          value={bookingData.email}
                          onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                          placeholder="Nhập email"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          value={bookingData.phone}
                          onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                          placeholder="Nhập số điện thoại"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ghi chú
                        </label>
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          value={bookingData.notes}
                          onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                          placeholder="Ghi chú thêm (tùy chọn)"
                          rows={3}
                        />
                      </div>

                      {calculateTotalPrice() > 0 && (
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Tổng tiền:</span>
                            <span className="text-xl font-bold text-emerald-600">
                              {formatPrice(calculateTotalPrice())}
                            </span>
                          </div>
                          {selectedRoom && (
                            <p className="text-sm text-gray-600 mt-1">
                              Phòng: {selectedRoom.name}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowBookingForm(false)}
                          className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={handleBookingFormSubmit}
                          className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <CreditCard className="h-5 w-5" />
                          <span>Tiếp tục</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room Selection Modal */}
      <RoomSelectionModal
        isOpen={showRoomSelection}
        onClose={() => setShowRoomSelection(false)}
        onSelectRoom={handleRoomSelection}
        homestay={homestay}
        availableRooms={getAvailableRoomsForDates()}
        checkIn={bookingData.checkIn}
        checkOut={bookingData.checkOut}
        guests={bookingData.guests}
      />

      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmBooking}
        homestay={homestay}
        bookingData={bookingData}
        totalPrice={calculateTotalPrice()}
        selectedRoom={selectedRoom}
      />
    </div>
  );
};

export default HomestayDetailView;