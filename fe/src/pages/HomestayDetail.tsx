import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import HomestayDetailView from '../components/Homestay/HomestayDetailView';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const HomestayDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getHomestayById, addBooking } = useData();
  const { user } = useAuth();

  const homestay = id ? getHomestayById(id) : undefined;

  const handleBack = () => {
    navigate(-1);
  };

  const handleBooking = (bookingData: any) => {
    if (!user) {
      alert('Vui lòng đăng nhập để đặt phòng!');
      return;
    }

    if (!homestay) return;

    const newBooking = {
      id: Date.now().toString(),
      homestayId: homestay.id,
      guestId: user.id,
      guestName: bookingData.guestName,
      email: bookingData.email,
      phone: bookingData.phone,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      totalPrice: bookingData.totalPrice,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      notes: bookingData.notes
    };
    
    addBooking(newBooking);
    alert('Đặt phòng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
    navigate('/bookings');
  };

  if (!homestay) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy homestay</h2>
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <HomestayDetailView
      homestay={homestay}
      onBack={handleBack}
      onBook={handleBooking}
    />
  );
};

export default HomestayDetail;