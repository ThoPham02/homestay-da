import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Phone,
  MapPin,
  Clock,
  CreditCard,
  User,
  MoreVertical,
  Check,
  X,
  Plus,
  DollarSign,
  Save,
  ArrowLeft,
  Mail,
  Home
} from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { useConfirm } from '../components/ConfirmDialog';

interface Booking {
  id: number;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  roomName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalAmount: number;
  paidAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingDate: string;
  paymentMethod: string;
}

function BookingList() {
  const confirm = useConfirm();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showNewBookingForm, setShowNewBookingForm] = useState(false);
  const [newBooking, setNewBooking] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    roomName: '',
    roomType: 'Standard',
    checkIn: '',
    checkOut: '',
    totalAmount: 0,
    paidAmount: 0,
    paymentMethod: 'Tiền mặt'
  });
  const [filters, setFilters] = useState({
    customerName: '',
    customerPhone: '',
    dateFrom: '',
    dateTo: '',
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800'
  };

  const statusLabels = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    cancelled: 'Đã hủy',
    completed: 'Hoàn thành'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Gọi API filterBookings khi filter thay đổi
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const params: any = {
          customerName: filters.customerName || undefined,
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          status: filters.status || undefined,
          page: currentPage,
          pageSize: itemsPerPage,
        };
        const resp = await bookingService.filterBookings(params);
        setBookings(resp.bookings || []);
        // Nếu backend trả về phân trang, có thể set lại totalPages, currentPage...
      } catch (err) {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [filters, currentPage]);

  const filteredBookings = bookings.filter(booking => {
    return (
      booking.customerName.toLowerCase().includes(filters.customerName.toLowerCase()) &&
      booking.customerPhone.includes(filters.customerPhone) &&
      (!filters.dateFrom || booking.bookingDate >= filters.dateFrom) &&
      (!filters.dateTo || booking.bookingDate <= filters.dateTo) &&
      (!filters.status || booking.status === filters.status)
    );
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      customerName: '',
      customerPhone: '',
      dateFrom: '',
      dateTo: '',
      status: ''
    });
    setCurrentPage(1);
  };

  const calculateNights = () => {
    if (newBooking.checkIn && newBooking.checkOut) {
      const checkIn = new Date(newBooking.checkIn);
      const checkOut = new Date(newBooking.checkOut);
      const diffTime = checkOut.getTime() - checkIn.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nights = calculateNights();
    if (nights <= 0) {
      alert('Ngày trả phòng phải sau ngày nhận phòng');
      return;
    }

    const newId = Math.max(...bookings.map(b => b.id)) + 1;
    const bookingCode = `BK${String(newId).padStart(3, '0')}`;
    
    const booking: Booking = {
      id: newId,
      bookingCode,
      customerName: newBooking.customerName,
      customerPhone: newBooking.customerPhone,
      customerEmail: newBooking.customerEmail,
      roomName: newBooking.roomName,
      roomType: newBooking.roomType,
      checkIn: newBooking.checkIn,
      checkOut: newBooking.checkOut,
      nights,
      totalAmount: newBooking.totalAmount,
      paidAmount: newBooking.paidAmount,
      status: 'pending',
      bookingDate: new Date().toISOString().split('T')[0],
      paymentMethod: newBooking.paymentMethod
    };

    setBookings(prev => [booking, ...prev]);
    setShowNewBookingForm(false);
    
    // Reset form
    setNewBooking({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      roomName: '',
      roomType: 'Standard',
      checkIn: '',
      checkOut: '',
      totalAmount: 0,
      paidAmount: 0,
      paymentMethod: 'Tiền mặt'
    });
  };

  const getAvailableActions = (booking: Booking) => {
    const actions = [];
    
    // Luôn có thao tác xem chi tiết
    actions.push({
      label: 'Xem chi tiết',
      icon: Eye,
      color: 'text-blue-600 hover:text-blue-800',
      action: () => console.log('View booking', booking.id)
    });

    // Thao tác theo trạng thái
    switch (booking.status) {
      case 'pending':
        actions.push(
          {
            label: 'Xác nhận',
            icon: Check,
            color: 'text-green-600 hover:text-green-800',
            action: () => {
              setBookings(prev => prev.map(b => 
                b.id === booking.id ? { ...b, status: 'confirmed' as const } : b
              ));
              setActiveDropdown(null);
            }
          },
          {
            label: 'Hủy đặt phòng',
            icon: X,
            color: 'text-red-600 hover:text-red-800',
            action: () => {
              setBookings(prev => prev.map(b => 
                b.id === booking.id ? { ...b, status: 'cancelled' as const } : b
              ));
              setActiveDropdown(null);
            }
          }
        );
        break;
      
      case 'confirmed':
        if (booking.paidAmount < booking.totalAmount) {
          actions.push({
            label: 'Thêm thanh toán',
            icon: Plus,
            color: 'text-green-600 hover:text-green-800',
            action: () => {
              const additionalPayment = prompt('Nhập số tiền thanh toán thêm:');
              if (additionalPayment) {
                const amount = parseFloat(additionalPayment);
                if (!isNaN(amount) && amount > 0) {
                  setBookings(prev => prev.map(b => 
                    b.id === booking.id ? { 
                      ...b, 
                      paidAmount: Math.min(b.paidAmount + amount, b.totalAmount)
                    } : b
                  ));
                }
              }
              setActiveDropdown(null);
            }
          });
        }
        actions.push({
          label: 'Hủy đặt phòng',
          icon: X,
          color: 'text-red-600 hover:text-red-800',
          action: async () => {
            var result = await confirm({
              title: 'Xác nhận hủy đặt phòng',
              description: `Bạn có chắc chắn muốn hủy đặt phòng này?`,
              confirmText: 'Hủy',
              cancelText: 'Không'
            });
            if (result) {
              setBookings(prev => prev.map(b => 
                b.id === booking.id ? { ...b, status: 'cancelled' as const } : b
              ));
            }
            setActiveDropdown(null);
          }
        });
        break;
      
      case 'completed':
        actions.push({
          label: 'Chỉnh sửa',
          icon: Edit,
          color: 'text-blue-600 hover:text-blue-800',
          action: () => console.log('Edit booking', booking.id)
        });
        break;
      
      case 'cancelled':
        actions.push({
          label: 'Xóa',
          icon: Trash2,
          color: 'text-red-600 hover:text-red-800',
          action: async () => {
            var result = await confirm({
              title: 'Xác nhận xóa đặt phòng',
              description: `Bạn có chắc chắn muốn xóa đặt phòng này?`,
              confirmText: 'Xóa',
              cancelText: 'Không'
            });

            if (result) {
              setBookings(prev => prev.filter(b => b.id !== booking.id));
            }
            setActiveDropdown(null);
          }
        });
        break;
    }

    return actions;
  };

  return (
    <div className="min-h-screen bg-gray-50" onClick={() => setActiveDropdown(null)}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đặt phòng</h1>
              <p className="text-gray-600">Quản lý tất cả đặt phòng của homestay</p>
            </div>
            <button
              onClick={() => setShowNewBookingForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tạo đặt phòng mới
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên người đặt
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nhập tên..."
                  value={filters.customerName}
                  onChange={(e) => handleFilterChange('customerName', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nhập số điện thoại..."
                  value={filters.customerPhone}
                  onChange={(e) => handleFilterChange('customerPhone', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày đặt từ
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày đặt đến
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="cancelled">Đã hủy</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredBookings.length)} của {filteredBookings.length} kết quả
            </div>
            <div className="text-sm font-medium text-gray-900">
              Tổng doanh thu: {formatCurrency(filteredBookings.reduce((sum, booking) => sum + booking.totalAmount, 0))}
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đặt phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin người đặt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày nhận/trả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">Đang tải dữ liệu...</td>
                  </tr>
                ) : currentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">Không tìm thấy đặt phòng nào.</td>
                  </tr>
                ) : (
                  currentBookings.map((booking, index) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {booking.bookingCode}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {booking.customerPhone}
                            </div>
                            <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.roomName}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {booking.roomType}
                        </div>
                        <div className="text-sm text-gray-500">{booking.nights} đêm</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar className="w-3 h-3 text-green-600" />
                            <span className="text-green-600">Nhận:</span> {formatDate(booking.checkIn)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-red-600" />
                            <span className="text-red-600">Trả:</span> {formatDate(booking.checkOut)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium text-lg">{formatCurrency(booking.paidAmount)}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <CreditCard className="w-3 h-3" />
                            {booking.paymentMethod}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[booking.status]}`}>
                          {statusLabels[booking.status]}
                        </span>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(booking.bookingDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === booking.id ? null : booking.id);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {activeDropdown === booking.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                              {getAvailableActions(booking).map((action, actionIndex) => (
                                <button
                                  key={actionIndex}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.action();
                                  }}
                                  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${action.color}`}
                                >
                                  <action.icon className="w-4 h-4" />
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Trang <span className="font-medium">{currentPage}</span> của{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Booking Modal */}
      {showNewBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Tạo đặt phòng mới</h2>
              <button
                onClick={() => setShowNewBookingForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <form onSubmit={handleCreateBooking} className="space-y-6">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Thông tin khách hàng</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên khách hàng *
                      </label>
                      <input
                        type="text"
                        required
                        value={newBooking.customerName}
                        onChange={(e) => setNewBooking(prev => ({ ...prev, customerName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập tên khách hàng"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        required
                        value={newBooking.customerPhone}
                        onChange={(e) => setNewBooking(prev => ({ ...prev, customerPhone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newBooking.customerEmail}
                        onChange={(e) => setNewBooking(prev => ({ ...prev, customerEmail: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập email"
                      />
                    </div>
                  </div>
                </div>

                {/* Room Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Home className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Thông tin phòng</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên phòng *
                      </label>
                      <input
                        type="text"
                        required
                        value={newBooking.roomName}
                        onChange={(e) => setNewBooking(prev => ({ ...prev, roomName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập tên phòng"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại phòng *
                      </label>
                      <select
                        required
                        value={newBooking.roomType}
                        onChange={(e) => setNewBooking(prev => ({ ...prev, roomType: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Standard">Standard</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Premium">Premium</option>
                        <option value="Suite">Suite</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Stay Duration */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Thời gian lưu trú</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày nhận phòng *
                      </label>
                      <input
                        type="date"
                        required
                        value={newBooking.checkIn}
                        onChange={(e) => setNewBooking(prev => ({ ...prev, checkIn: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày trả phòng *
                      </label>
                      <input
                        type="date"
                        required
                        value={newBooking.checkOut}
                        onChange={(e) => setNewBooking(prev => ({ ...prev, checkOut: e.target.value }))}
                        min={newBooking.checkIn}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số đêm
                      </label>
                      <input
                        type="number"
                        value={calculateNights()}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Thông tin thanh toán</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tổng tiền *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={newBooking.totalAmount}
                        onChange={(e) => setNewBooking(prev => ({ ...prev, totalAmount: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập tổng tiền"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đã thanh toán
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={newBooking.totalAmount}
                        value={newBooking.paidAmount}
                        onChange={(e) => setNewBooking(prev => ({ ...prev, paidAmount: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập số tiền đã thanh toán"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phương thức thanh toán
                      </label>
                      <select
                        value={newBooking.paymentMethod}
                        onChange={(e) => setNewBooking(prev => ({ ...prev, paymentMethod: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Tiền mặt">Tiền mặt</option>
                        <option value="Chuyển khoản">Chuyển khoản</option>
                        <option value="Thẻ tín dụng">Thẻ tín dụng</option>
                      </select>
                    </div>
                  </div>
                  
                  {newBooking.totalAmount > 0 && newBooking.paidAmount < newBooking.totalAmount && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Còn lại:</strong> {formatCurrency(newBooking.totalAmount - newBooking.paidAmount)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowNewBookingForm(false)}
                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Tạo đặt phòng
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingList;