import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { homestayService } from '../services/homestayService';
import { Homestay, Room } from '../types';
import RoomList from './RoomList';

const HomestayDetailGuest: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [homestay, setHomestay] = useState<Homestay | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    const homestayId = parseInt(id || '0');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [homestayDetail, roomList] = await Promise.all([
                    homestayService.getPublicHomestayById(homestayId),
                    homestayService.getPublicRoomList({ homestayId, page: 1, pageSize: 100 })
                ]);
                setHomestay(homestayDetail.homestay);
                setRooms(roomList.rooms || []);
            } catch (error) {
                setHomestay(null);
            } finally {
                setLoading(false);
            }
        };
        if (homestayId) fetchData();
    }, [homestayId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!homestay) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600">Không tìm thấy homestay</p>
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
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Ảnh chính */}
                <div className="mb-6">
                    {rooms && rooms.length > 0 && rooms[0].images && rooms[0].images.length > 0 ? (
                        <img
                            src={rooms[0].images[0]}
                            alt={rooms[0].name || 'Room'}
                            className="w-full h-72 object-cover rounded-xl shadow"
                        />
                    ) : (
                        <div className="w-full h-72 bg-gray-200 flex items-center justify-center rounded-xl text-gray-400">
                            Không có ảnh
                        </div>
                    )}
                </div>

                {/* Thông tin chi tiết */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{homestay.name}</h1>
                    <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{homestay.address}, {homestay.ward}, {homestay.district}, {homestay.city}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span>{homestay.rating || 0} ({homestay.reviews || 0} đánh giá)</span>
                        </div>
                    </div>
                    {homestay.description && (
                        <div className="text-gray-700 mb-2">{homestay.description}</div>
                    )}
                </div>

                {/* Danh sách phòng */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Danh sách phòng</h2>
                    <RoomList rooms={rooms} onViewRoom={(roomId) => navigate(`/homestay/${homestayId}/room/${roomId}`)} />
                </div>
            </div>
        </div>
    );
};

export default HomestayDetailGuest;
