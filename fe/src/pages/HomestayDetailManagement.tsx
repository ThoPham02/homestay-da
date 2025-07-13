import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X, Plus, Upload, Calendar, Users, DollarSign, Bed } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import RoomCard from '../components/Room/RoomCard';
import AddRoomModal from '../components/Room/AddRoomModal';

const HomestayDetailManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { 
    getHomestayById, 
    updateHomestay, 
    getBookingsByHomestayId, 
    getReviewsByHomestayId,
    getRoomsByHomestayId,
    addRoom,
    updateRoom,
    deleteRoom,
    getRoomById
  } = useData();

  const homestay = id ? getHomestayById(id) : undefined;
  const bookings = homestay ? getBookingsByHomestayId(homestay.id) : [];
  const reviews = homestay ? getReviewsByHomestayId(homestay.id) : [];
  const rooms = homestay ? getRoomsByHomestayId(homestay.id) : [];

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(homestay || {});
  const [newAmenity, setNewAmenity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);

  const commonAmenities = [
    'Wi-Fi', 'Điều hòa', 'Bếp đầy đủ', 'Máy giặt', 'Hồ bơi', 'Bãi đậu xe',
    'BBQ', 'Sân vườn', 'Netflix', 'Lò sưởi', 'Thang máy', 'An ninh 24/7',
    'Xe đạp miễn phí', 'Dịch vụ dọn phòng', 'Hồ bơi riêng', 'Bếp mini'
  ];

  const sampleImages = [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleBack = () => {
    navigate('/management');
  };

  const handleEdit = () => {
    setEditData(homestay || {});
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!homestay || !editData.name || !editData.location || !editData.price) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    updateHomestay(homestay.id, {
      ...editData,
      price: typeof editData.price === 'string' ? parseInt(editData.price) : editData.price,
      area: typeof editData.area === 'string' ? parseInt(editData.area) : editData.area
    });
    
    setIsEditing(false);
    alert('Cập nhật homestay thành công!');
  };

  const handleCancel = () => {
    setEditData(homestay || {});
    setIsEditing(false);
  };

  const handleAddRoom = (roomData: any) => {
    const newRoom = {
      ...roomData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    addRoom(newRoom);
    alert('Thêm phòng thành công!');
  };

  const handleDeleteRoom = (roomId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      deleteRoom(roomId);
      alert('Đã xóa phòng thành công!');
    }
  };

  const addAmenityToList = (amenity: string) => {
    if (amenity && !editData.amenities?.includes(amenity)) {
      setEditData(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), amenity]
      }));
    }
  };

  const removeAmenity = (amenity: string) => {
    setEditData(prev => ({
      ...prev,
      amenities: (prev.amenities || []).filter(a => a !== amenity)
    }));
  };

  const addCustomAmenity = () => {
    if (newAmenity.trim()) {
      addAmenityToList(newAmenity.trim());
      setNewAmenity('');
    }
  };

  const addImage = (url: string) => {
    if (url && !editData.images?.includes(url)) {
      setEditData(prev => ({
        ...prev,
        images: [...(prev.images || []), url]
      }));
    }
  };

  const removeImage = (url: string) => {
    setEditData(prev => ({
      ...prev,
      images: (prev.images || []).filter(img => img !== url)
    }));
  };

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      addImage(imageUrl.trim());
      setImageUrl('');
    }
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

  if (user?.id !== homestay.ownerId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không có quyền truy cập</h2>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại</span>
          </button>

          <div className="flex space-x-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
              >
                <Edit className="h-5 w-5" />
                <span>Chỉnh sửa</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center space-x-2"
                >
                  <X className="h-5 w-5" />
                  <span>Hủy</span>
                </button>
                <button
                  onClick={handleSave}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Lưu</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng đặt phòng</p>
                <p className="text-2xl font-bold text-emerald-600">{bookings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Số phòng</p>
                <p className="text-2xl font-bold text-blue-600">{rooms.length}</p>
              </div>
              <Bed className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đánh giá</p>
                <p className="text-2xl font-bold text-yellow-600">{reviews.length}</p>
              </div>
              <Users className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Doanh thu</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').reduce((sum, b) => sum + b.totalPrice, 0)).slice(0, -2)}đ
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Thông tin homestay
              </button>
              <button
                onClick={() => setActiveTab('rooms')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rooms'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Phòng ({rooms.length})
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Đặt phòng ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Đánh giá ({reviews.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên homestay *
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name || ''}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">{homestay.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa điểm *
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.location || ''}
                        onChange={(e) => setEditData({...editData, location: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-lg text-gray-900">{homestay.location}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá thuê/đêm (VNĐ) *
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.price || ''}
                        onChange={(e) => setEditData({...editData, price: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-emerald-600">{formatPrice(homestay.price)}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diện tích (m²)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.area || ''}
                        onChange={(e) => setEditData({...editData, area: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-lg text-gray-900">{homestay.area}m²</p>
                    )}
                  </div>
                </div>

                {/* Capacity */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số khách tối đa
                    </label>
                    {isEditing ? (
                      <select
                        value={editData.maxGuests || 1}
                        onChange={(e) => setEditData({...editData, maxGuests: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        {[1,2,3,4,5,6,7,8,9,10,12,15,20].map(num => (
                          <option key={num} value={num}>{num} khách</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-lg text-gray-900">{homestay.maxGuests} khách</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số phòng ngủ
                    </label>
                    {isEditing ? (
                      <select
                        value={editData.bedrooms || 1}
                        onChange={(e) => setEditData({...editData, bedrooms: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <option key={num} value={num}>{num} phòng</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-lg text-gray-900">{homestay.bedrooms} phòng ngủ</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số phòng tắm
                    </label>
                    {isEditing ? (
                      <select
                        value={editData.bathrooms || 1}
                        onChange={(e) => setEditData({...editData, bathrooms: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        {[1,2,3,4,5,6].map(num => (
                          <option key={num} value={num}>{num} phòng</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-lg text-gray-900">{homestay.bathrooms} phòng tắm</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả *
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editData.description || ''}
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{homestay.description}</p>
                  )}
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Tiện nghi
                  </label>
                  
                  {isEditing ? (
                    <>
                      {/* Common Amenities */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        {commonAmenities.map((amenity) => (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() => 
                              editData.amenities?.includes(amenity) 
                                ? removeAmenity(amenity)
                                : addAmenityToList(amenity)
                            }
                            className={`p-2 text-sm rounded-lg border transition-colors ${
                              editData.amenities?.includes(amenity)
                                ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {amenity}
                          </button>
                        ))}
                      </div>

                      {/* Custom Amenity */}
                      <div className="flex space-x-2 mb-4">
                        <input
                          type="text"
                          value={newAmenity}
                          onChange={(e) => setNewAmenity(e.target.value)}
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Thêm tiện nghi khác..."
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())}
                        />
                        <button
                          type="button"
                          onClick={addCustomAmenity}
                          className="bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                    </>
                  ) : null}

                  {/* Selected Amenities */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(isEditing ? editData.amenities : homestay.amenities)?.map((amenity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                          <span className="text-emerald-800">{amenity}</span>
                        </div>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeAmenity(amenity)}
                            className="text-emerald-600 hover:text-emerald-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Hình ảnh *
                  </label>
                  
                  {isEditing && (
                    <>
                      {/* Sample Images */}
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-2">Chọn từ thư viện mẫu:</div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          {sampleImages.map((url, index) => (
                            <div key={index} className="relative">
                              <img
                                src={url}
                                alt={`Sample ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-emerald-300"
                                onClick={() => addImage(url)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Custom Image URL */}
                      <div className="flex space-x-2 mb-4">
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Hoặc nhập URL hình ảnh..."
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                        />
                        <button
                          type="button"
                          onClick={addImageUrl}
                          className="bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          <Upload className="h-5 w-5" />
                        </button>
                      </div>
                    </>
                  )}

                  {/* Current Images */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(isEditing ? editData.images : homestay.images)?.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeImage(url)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                            Ảnh chính
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rooms' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Quản lý phòng</h2>
                  <button
                    onClick={() => setShowAddRoomModal(true)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Thêm phòng</span>
                  </button>
                </div>

                {rooms.length === 0 ? (
                  <div className="text-center py-12">
                    <Bed className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có phòng nào</h3>
                    <p className="text-gray-600 mb-6">Bắt đầu bằng cách thêm phòng đầu tiên cho homestay của bạn</p>
                    <button
                      onClick={() => setShowAddRoomModal(true)}
                      className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Thêm phòng đầu tiên</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                      <div key={room.id} className="relative">
                        <RoomCard room={room} showPrice={true} />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <button
                            onClick={() => alert('Chỉnh sửa phòng - Chức năng sẽ được phát triển sớm!')}
                            className="bg-white bg-opacity-90 text-emerald-600 p-2 rounded-full hover:bg-emerald-100 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="bg-white bg-opacity-90 text-red-600 p-2 rounded-full hover:bg-red-100 transition-colors"
                            title="Xóa"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Danh sách đặt phòng</h2>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Chưa có đặt phòng nào</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Khách hàng
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phòng
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Khách
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tổng tiền
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng thái
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((booking) => {
                          const room = booking.roomId ? getRoomById(booking.roomId) : null;
                          return (
                            <tr key={booking.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                                  <div className="text-sm text-gray-500">{booking.email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {room ? room.name : 'Toàn bộ homestay'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{booking.guests} người</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatPrice(booking.totalPrice)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                  {getStatusText(booking.status)}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Đánh giá từ khách hàng</h2>
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Chưa có đánh giá nào</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start space-x-4">
                          <div className="bg-emerald-100 w-10 h-10 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-emerald-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">{review.guestName}</h4>
                                <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                              </div>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    className={`text-lg ${
                                      star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                                <span className="ml-1 text-sm font-medium">{review.rating}</span>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 mb-3">{review.comment}</p>
                            
                            {review.images && review.images.length > 0 && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {review.images.map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Review image ${index + 1}`}
                                    className="w-full h-20 object-cover rounded-lg"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Room Modal */}
      <AddRoomModal
        isOpen={showAddRoomModal}
        onClose={() => setShowAddRoomModal(false)}
        onSubmit={handleAddRoom}
        homestayId={homestay.id}
      />
    </div>
  );
};

export default HomestayDetailManagement;