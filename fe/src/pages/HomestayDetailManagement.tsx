import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X, Plus, MapPin, Building, Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { homestayService } from '../services/homestayService';
import { Homestay, HomestayDetailResponse, UpdateHomestayRequest, RoomStats } from '../types';
import RoomManagement from '../components/Room/RoomManagement';

const HomestayDetailManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [homestayDetail, setHomestayDetail] = useState<HomestayDetailResponse | null>(null);
  const [roomStats, setRoomStats] = useState<RoomStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateHomestayRequest>({});
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');

  const homestay = homestayDetail?.homestay;
  const rooms = homestayDetail?.rooms || [];

  const loadData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [detailResponse, statsResponse] = await Promise.all([
        homestayService.getHomestayById(parseInt(id)),
        homestayService.getRoomStats(parseInt(id))
      ]);
      setHomestayDetail(detailResponse);
      setRoomStats(statsResponse);
    } catch (error) {
      console.error('Error loading homestay detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleBack = () => {
    navigate('/management');
  };

  const handleEdit = () => {
    if (!homestay) return;
    setEditData({
      name: homestay.name,
      description: homestay.description,
      address: homestay.address,
      city: homestay.city,
      district: homestay.district,
      ward: homestay.ward,
      latitude: homestay.latitude,
      longitude: homestay.longitude,
      status: homestay.status
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!homestay || !editData.name || !editData.description) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      await homestayService.updateHomestay(homestay.id, editData);
      await loadData(); // Reload data after update
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating homestay:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleRoomAdded = () => {
    loadData(); // Reload data when room is added/updated/deleted
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại</span>
          </button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name || homestay.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                ) : (
                  homestay.name
                )}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${homestayService.getStatusColor(homestay.status)}`}>
                  {homestayService.formatStatus(homestay.status)}
                </span>
                <span>ID: {homestay.id}</span>
                <span>Tạo ngày: {new Date(homestay.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng phòng</p>
                <p className="text-2xl font-bold text-blue-600">
                  {roomStats?.totalRooms || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Phòng có sẵn</p>
                <p className="text-2xl font-bold text-green-600">
                  {roomStats?.availableRooms || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tỷ lệ lấp đầy</p>
                <p className="text-2xl font-bold text-orange-600">
                  {roomStats?.occupancyRate?.toFixed(1) || 0}%
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Doanh thu</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {homestayService.formatPrice(roomStats?.totalRevenue || 0)}
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
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
                Tổng quan
              </button>
              <button
                onClick={() => setActiveTab('rooms')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rooms'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Quản lý Phòng ({rooms.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Thông tin cơ bản
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mô tả
                        </label>
                        {isEditing ? (
                          <textarea
                            value={editData.description || homestay.description}
                            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            rows={4}
                          />
                        ) : (
                          <p className="text-gray-700">{homestay.description}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Trạng thái
                        </label>
                        {isEditing ? (
                          <select
                            value={editData.status || homestay.status}
                            onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as any }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          >
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                            <option value="pending">Chờ duyệt</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${homestayService.getStatusColor(homestay.status)}`}>
                            {homestayService.formatStatus(homestay.status)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Thông tin địa chỉ
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Địa chỉ chi tiết
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.address || homestay.address}
                            onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-700">{homestay.address}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phường/Xã
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.ward || homestay.ward}
                            onChange={(e) => setEditData(prev => ({ ...prev, ward: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-700">{homestay.ward}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quận/Huyện
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.district || homestay.district}
                            onChange={(e) => setEditData(prev => ({ ...prev, district: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-700">{homestay.district}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tỉnh/Thành phố
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.city || homestay.city}
                            onChange={(e) => setEditData(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-700">{homestay.city}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tọa độ địa lý
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Vĩ độ:</span>
                          {isEditing ? (
                            <input
                              type="number"
                              step="any"
                              value={editData.latitude || homestay.latitude}
                              onChange={(e) => setEditData(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                          ) : (
                            <span className="ml-2 text-gray-700">{homestay.latitude}</span>
                          )}
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Kinh độ:</span>
                          {isEditing ? (
                            <input
                              type="number"
                              step="any"
                              value={editData.longitude || homestay.longitude}
                              onChange={(e) => setEditData(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                          ) : (
                            <span className="ml-2 text-gray-700">{homestay.longitude}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rooms' && (
              <RoomManagement 
                homestayId={homestay.id} 
                onRoomAdded={handleRoomAdded}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomestayDetailManagement;