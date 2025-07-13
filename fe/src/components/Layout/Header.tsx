import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Menu, X, Calendar, Building } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../Auth/LoginModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
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
              
              {user ? (
                <div className="flex items-center space-x-4">
                  {user.role === 'host' && (
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
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <div className="text-sm">
                      <div className="text-gray-700 font-medium">{user.name}</div>
                      <div className="text-gray-500 text-xs">
                        {user.role === 'host' ? 'Chủ nhà' : 'Khách hàng'}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-red-600 hover:text-red-700 ml-2"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Đăng nhập
                </button>
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
                {user ? (
                  <>
                    {user.role === 'host' && (
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
                    <div className="px-3 py-2 text-sm text-gray-600">
                      Xin chào, {user.name} ({user.role === 'host' ? 'Chủ nhà' : 'Khách hàng'})
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-left px-3 py-2 text-red-600 hover:text-red-700"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }}
                    className="text-left px-3 py-2 bg-emerald-600 text-white rounded-md mx-3"
                  >
                    Đăng nhập
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};

export default Header;