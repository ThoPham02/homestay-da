import React from 'react';
import { Users, Bed, Square, Star } from 'lucide-react';
import { Room } from '../../types';

interface RoomCardProps {
  room: Room;
  isSelected?: boolean;
  onSelect?: () => void;
  showPrice?: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, isSelected, onSelect, showPrice = true }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getRoomTypeText = (type: string) => {
    switch (type) {
      case 'single':
        return 'Phòng đơn';
      case 'double':
        return 'Phòng đôi';
      case 'suite':
        return 'Phòng suite';
      case 'dormitory':
        return 'Phòng tập thể';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Có sẵn';
      case 'occupied':
        return 'Đã đặt';
      case 'maintenance':
        return 'Bảo trì';
      default:
        return status;
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${
        isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
      } ${room.status !== 'available' ? 'opacity-60 cursor-not-allowed' : ''}`}
      onClick={room.status === 'available' ? onSelect : undefined}
    >
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <img
          src={room.images[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={room.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
            {getStatusText(room.status)}
          </span>
        </div>
        {isSelected && (
          <div className="absolute top-4 left-4 bg-emerald-600 text-white p-2 rounded-full">
            <Star className="h-4 w-4 fill-current" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
          {showPrice && (
            <div className="text-right">
              <p className="text-lg font-bold text-emerald-600">
                {formatPrice(room.price)}
              </p>
              <p className="text-sm text-gray-500">/đêm</p>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-3">{getRoomTypeText(room.type)}</p>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{room.capacity} người</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>25m²</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {room.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
            >
              {amenity}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="text-xs text-gray-500">+{room.amenities.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;