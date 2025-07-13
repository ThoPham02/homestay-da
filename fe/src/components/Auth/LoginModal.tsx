import React from 'react';
import { User, Building, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();

  const handleLogin = (role: 'guest' | 'host') => {
    login(role);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Chọn loại tài khoản</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6 text-center">Bạn muốn đăng nhập với vai trò gì?</p>
        
        <div className="space-y-4">
          <button
            onClick={() => handleLogin('guest')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <User className="h-5 w-5" />
            <span>Khách hàng (Thuê phòng)</span>
          </button>
          
          <button
            onClick={() => handleLogin('host')}
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Building className="h-5 w-5" />
            <span>Chủ nhà (Cho thuê phòng)</span>
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-4 text-gray-600 hover:text-gray-800 py-2"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export default LoginModal;