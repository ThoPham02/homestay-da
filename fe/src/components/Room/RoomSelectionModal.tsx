import React, { useState } from 'react';
import { X, Users, Calendar } from 'lucide-react';
import { Room, Homestay } from '../../types';
import RoomCard from './RoomCard';

interface RoomSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoom: (room: Room) => void;
  homestay: Homestay;
  availableRooms: Room[];
  checkIn: string;
  checkOut: string;
  guests: number;
}

const RoomSelectionModal: React.FC<RoomSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectRoom,
  homestay,
  availableRooms,
  checkIn,
  checkOut,
  guests
}) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const handleConfirmSelection = () => {
    if (selectedRoom) {
      onSelectRoom(selectedRoom);
      onClose();
    }
  };

  const suitableRooms = availableRooms.filter(room => room.capacity >= guests);
  const nights = calculateNights();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Chọn phòng</h2>
              <p className="text-gray-600">{homestay.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Booking Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-gray-600">Nhận phòng</p>
                  <p className="font-medium">{formatDate(checkIn)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-gray-600">Trả phòng</p>
                  <p className="font-medium">{formatDate(checkOut)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-gray-600">Số khách</p>
                  <p className="font-medium">{guests} người</p>
                </div>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <span className="font-medium">{nights} đêm</span> • 
              <span className="ml-1">{suitableRooms.length} phòng phù hợp</span>
            </div>
          </div>

          {/* Room List */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Phòng có sẵn ({suitableRooms.length})
            </h3>
            
            {suitableRooms.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Không có phòng phù hợp cho {guests} khách</p>
                <p className="text-sm text-gray-500 mt-2">
                  Vui lòng thử giảm số lượng khách hoặc chọn ngày khác
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suitableRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    isSelected={selectedRoom?.id === room.id}
                    onSelect={() => setSelectedRoom(room)}
                    showPrice={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Selected Room Summary */}
          {selectedRoom && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-emerald-800 mb-2">Phòng đã chọn</h4>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-emerald-900">{selectedRoom.name}</p>
                  <p className="text-sm text-emerald-700">
                    {selectedRoom.capacity} khách • {nights} đêm
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-600">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(selectedRoom.price * nights)}
                  </p>
                  <p className="text-sm text-emerald-600">Tổng cộng</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmSelection}
              disabled={!selectedRoom}
              className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Xác nhận chọn phòng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomSelectionModal;