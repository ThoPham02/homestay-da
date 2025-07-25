// components/UserUpdateModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { User } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

interface UserUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

const UserUpdateModal: React.FC<UserUpdateModalProps> = ({ isOpen, onClose, userId }) => {
    const [form, setForm] = useState<{ name: string; email: string }>({
        name: '',
        email: ''
    });

    useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authService.getProfile();
        if (response.user.id === userId) {
          setForm({
            name: response.user.name,
            email: response.user.email
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    //   const resp =  await authService.updateUser();
      onClose();
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Cập nhật thông tin</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Họ tên</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
              disabled // Không cho đổi email nếu bạn muốn
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserUpdateModal;
