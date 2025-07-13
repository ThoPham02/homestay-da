import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { homestayService } from '../services/homestayService';
import { Room, RoomDetailResponse } from '../types';
import { X } from 'lucide-react';

const RoomDetailPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) return;
      try {
        setLoading(true);
        const res: RoomDetailResponse = await homestayService.getRoomById(Number(roomId));
        setRoom(res.room);
      } catch (error) {
        // Xử lý lỗi nếu cần
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin phòng...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy phòng</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Chi tiết phòng: {room.name}</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tên phòng</label>
          <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">{room.name}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Loại phòng</label>
          <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">{room.type}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sức chứa</label>
          <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">{room.capacity} người</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Giá phòng/đêm</label>
          <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">{room.price.toLocaleString()} VNĐ</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
          <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">{room.status}</div>
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
        <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">{room.description}</div>
      </div>
      {/* Nếu có images thì hiển thị */}
      {Array.isArray((room as any).images) && (room as any).images.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh</label>
          <div className="flex flex-wrap gap-4">
            {(room as any).images.map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                alt={`Hình phòng ${idx + 1}`}
                className="w-32 h-24 object-cover rounded-lg border"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetailPage;
