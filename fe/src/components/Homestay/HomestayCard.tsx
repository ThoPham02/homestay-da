import React from 'react';
import { Star, MapPin, Users, Bed, Bath, Square } from 'lucide-react';
import { Homestay } from '../../types';

interface HomestayCardProps {
  homestay: Homestay;
  onClick: () => void;
}

const HomestayCard: React.FC<HomestayCardProps> = ({ homestay, onClick }) => {
  const firstRoom = homestay.rooms?.[0];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src="/placeholder.jpg"
          alt={homestay.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 truncate">{homestay.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{homestay.rating ?? 0}</span>
            <span className="text-sm text-gray-500">({homestay.reviews ?? 0})</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{`${homestay.address}, ${homestay.ward}, ${homestay.district}, ${homestay.city}`}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{firstRoom?.capacity ?? '-'}</span>
            </div>
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{firstRoom ? 1 : '-'}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>-</span> {/* nếu có trường bathrooms, thay thế tại đây */}
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>- m²</span> {/* nếu có area */}
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {homestay.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600">
              {firstRoom ? formatPrice(firstRoom.price) : 'Đang cập nhật'}
            </p>
            <p className="text-sm text-gray-500">/đêm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomestayCard;
