import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Calendar, DollarSign, Users, TrendingUp, Building } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const Management: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { homestays, bookings, deleteHomestay } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  const userHomestays = user?.role === 'host' 
    ? homestays.filter(h => h.ownerId === user.id)
    : homestays;

  const userBookings = user?.role === 'host'
    ? bookings.filter(b => userHomestays.some(h => h.id === b.homestayId))
    : bookings;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getTotalRevenue = () => {
    return userBookings
      .filter(booking => booking.status === 'confirmed' || booking.status === 'completed')
      .reduce((total, booking) => total + booking.totalPrice, 0);
  };

  const getConfirmedBookings = () => {
    return userBookings.filter(booking => booking.status === 'confirmed').length;
  };

  const getPendingBookings = () => {
    return userBookings.filter(booking => booking.status === 'pending').length;
  };

  const getActiveHomestays = () => {
    return userHomestays.filter(h => h.status === 'active').length;
  };

  const handleAddHomestay = () => {
    navigate('/add-homestay');
  };

  const handleViewHomestay = (homestay: any) => {
    navigate(`/management/homestay/${homestay.id}`);
  };

  const handleDeleteHomestay = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa homestay này?')) {
      deleteHomestay(id);
      alert('Đã xóa homestay thành công!');
    }
  };

  const handleViewBookings = (homestayId: string) => {
    navigate(`/management/homestay/${homestayId}`, { state: { activeTab: 'bookings' } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Homestay</h1>
          <p className="text-gray-600">Quản lý homestay và đặt phòng của bạn</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Homestay hoạt động</p>
                <p className="text-2xl font-bold text-emerald-600">{getActiveHomestays()}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <Building className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đặt phòng chờ</p>
                <p className="text-2xl font-bold text-orange-600">{getPendingBookings()}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đặt phòng thành công</p>
                <p className="text-2xl font-bold text-green-600">{getConfirmedBookings()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-emerald-600">{formatPrice(getTotalRevenue()).slice(0, -2)}đ</p>
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
                onClick={() => setActiveTab('homestays')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'homestays'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Homestay của tôi
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Đặt phòng
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Hoạt động gần đây</h2>
                {userBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Chưa có đặt phòng nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userBookings.slice(0, 5).map((booking) => {
                      const homestay = homestays.find(h => h.id === booking.homestayId);
                      return (
                        <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${
                              booking.status === 'confirmed' || booking.status === 'completed' ? 'bg-green-400' :
                              booking.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                            }`}></div>
                            <div>
                              <p className="font-medium">{booking.guestName}</p>
                              <p className="text-sm text-gray-600">
                                Đặt {homestay?.name} từ {booking.checkIn} đến {booking.checkOut}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatPrice(booking.totalPrice)}</p>
                            <p className={`text-sm ${
                              booking.status === 'confirmed' || booking.status === 'completed' ? 'text-green-600' :
                              booking.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {booking.status === 'confirmed' ? 'Đã xác nhận' :
                               booking.status === 'completed' ? 'Hoàn thành' :
                               booking.status === 'pending' ? 'Chờ xác nhận' : 'Đã hủy'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'homestays' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Homestay của tôi</h2>
                  <button
                    onClick={handleAddHomestay}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Thêm homestay</span>
                  </button>
                </div>

                {userHomestays.length === 0 ? (
                  <div className="text-center py-12">
                    <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có homestay nào</h3>
                    <p className="text-gray-600 mb-6">Bắt đầu bằng cách thêm homestay đầu tiên của bạn</p>
                    <button
                      onClick={handleAddHomestay}
                      className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Thêm homestay đầu tiên</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userHomestays.map((homestay) => (
                      <div key={homestay.id} className="bg-gray-50 rounded-lg overflow-hidden">
                        <img
                          src={homestay.images[0]}
                          alt={homestay.name}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{homestay.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              homestay.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {homestay.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{homestay.location}</p>
                          <p className="text-emerald-600 font-semibold mb-3">{formatPrice(homestay.price)}/đêm</p>
                          
                          <div className="flex justify-between">
                            <button
                              onClick={() => handleViewBookings(homestay.id)}
                              className="text-blue-600 hover:text-blue-700 p-2"
                              title="Xem đặt phòng"
                            >
                              <Calendar className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleViewHomestay(homestay)}
                              className="text-gray-600 hover:text-gray-700 p-2"
                              title="Xem chi tiết"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleViewHomestay(homestay)}
                              className="text-emerald-600 hover:text-emerald-700 p-2"
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteHomestay(homestay.id)}
                              className="text-red-600 hover:text-red-700 p-2"
                              title="Xóa"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Danh sách Đặt phòng</h2>
                {userBookings.length === 0 ? (
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
                            Homestay
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày
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
                        {userBookings.map((booking) => {
                          const homestay = homestays.find(h => h.id === booking.homestayId);
                          return (
                            <tr key={booking.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                                  <div className="text-sm text-gray-500">{booking.email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{homestay?.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {booking.checkIn} - {booking.checkOut}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatPrice(booking.totalPrice)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  booking.status === 'confirmed' || booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {booking.status === 'confirmed' ? 'Đã xác nhận' :
                                   booking.status === 'completed' ? 'Hoàn thành' :
                                   booking.status === 'pending' ? 'Chờ xác nhận' : 'Đã hủy'}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Management;