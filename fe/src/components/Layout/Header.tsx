import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Menu, X, Calendar, Building, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };



  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'host':
        return 'Chủ nhà';
      case 'admin':
        return 'Quản trị viên';
      case 'guest':
      default:
        return 'Khách hàng';
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">HomeStay Vietnam</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Trang chủ
              </Link>
              <Link
                to="/homestays"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/homestays') 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Homestay
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/about') 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                Giới thiệu
              </Link>
              
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  {(user.role === 'host' || user.role === 'admin') && (
                    <Link
                      to="/management"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                        isActive('/management') 
                          ? 'text-emerald-600 bg-emerald-50' 
                          : 'text-gray-700 hover:text-emerald-600'
                      }`}
                    >
                      <Building className="h-4 w-4" />
                      <span>Quản lý</span>
                    </Link>
                  )}
                  {user.role === 'guest' && (
                    <Link
                      to="/bookings"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                        isActive('/bookings') 
                          ? 'text-emerald-600 bg-emerald-50' 
                          : 'text-gray-700 hover:text-emerald-600'
                      }`}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Đặt phòng của tôi</span>
                    </Link>
                  )}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-700 font-medium">{user.name}</div>
                        <div className="text-gray-500 text-xs">
                          {getRoleDisplayName(user.role)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      title="Đăng xuất"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-left px-3 py-2 text-gray-700 hover:text-emerald-600"
                >
                  Trang chủ
                </Link>
                <Link
                  to="/homestays"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-left px-3 py-2 text-gray-700 hover:text-emerald-600"
                >
                  Homestay
                </Link>
                <Link
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-left px-3 py-2 text-gray-700 hover:text-emerald-600"
                >
                  Giới thiệu
                </Link>
                {isAuthenticated && user ? (
                  <>
                    {(user.role === 'host' || user.role === 'admin') && (
                      <Link
                        to="/management"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-left px-3 py-2 text-gray-700 hover:text-emerald-600"
                      >
                        Quản lý
                      </Link>
                    )}
                    {user.role === 'guest' && (
                      <Link
                        to="/bookings"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-left px-3 py-2 text-gray-700 hover:text-emerald-600"
                      >
                        Đặt phòng của tôi
                      </Link>
                    )}
                    <div className="px-3 py-2 text-sm text-gray-600 border-t border-gray-200 pt-2">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{getRoleDisplayName(user.role)}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-left px-3 py-2 text-red-600 hover:text-red-700 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <div className="px-3 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left px-3 py-2 bg-emerald-600 text-white rounded-md"
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

    </>
  );
};

export default Header;