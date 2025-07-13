import React, { useState } from 'react';
import { X, Plus, Upload } from 'lucide-react';
import { Room } from '../../types';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (room: Omit<Room, 'id' | 'createdAt'>) => void;
  homestayId: string;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({ isOpen, onClose, onSubmit, homestayId }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'double' as Room['type'],
    capacity: 2,
    price: '',
    description: '',
    amenities: [] as string[],
    images: [] as string[],
    status: 'available' as Room['status']
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const roomTypes = [
    { value: 'single', label: 'Phòng đơn' },
    { value: 'double', label: 'Phòng đôi' },
    { value: 'suite', label: 'Phòng suite' },
    { value: 'dormitory', label: 'Phòng tập thể' }
  ];

  const commonAmenities = [
    'Wi-Fi', 'Điều hòa', 'TV', 'Tủ lạnh', 'Máy sấy tóc', 'Két an toàn',
    'Ban công', 'Tầm nhìn ra biển', 'Tầm nhìn ra núi', 'Phòng tắm riêng',
    'Bồn tắm', 'Vòi sen', 'Đồ vệ sinh cá nhân', 'Khăn tắm'
  ];

  const sampleImages = [
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  const addAmenityToList = (amenity: string) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const addCustomAmenity = () => {
    if (newAmenity.trim()) {
      addAmenityToList(newAmenity.trim());
      setNewAmenity('');
    }
  };

  const addImage = (url: string) => {
    if (url && !formData.images.includes(url)) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
    }
  };

  const removeImage = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== url)
    }));
  };

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      addImage(imageUrl.trim());
      setImageUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.description) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    if (formData.images.length === 0) {
      alert('Vui lòng thêm ít nhất một hình ảnh!');
      return;
    }

    const roomData = {
      ...formData,
      homestayId,
      price: parseInt(formData.price)
    };

    onSubmit(roomData);
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      type: 'double',
      capacity: 2,
      price: '',
      description: '',
      amenities: [],
      images: [],
      status: 'available'
    });
    setNewAmenity('');
    setImageUrl('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Thêm phòng mới</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên phòng *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="VD: Phòng Deluxe 101"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại phòng *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as Room['type']})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  {roomTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sức chứa *
                </label>
                <select
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  {[1,2,3,4,5,6,8,10].map(num => (
                    <option key={num} value={num}>{num} người</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá phòng/đêm (VNĐ) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="500000"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả phòng *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Mô tả chi tiết về phòng..."
                required
              />
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tiện nghi phòng
              </label>
              
              {/* Common Amenities */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {commonAmenities.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => 
                      formData.amenities.includes(amenity) 
                        ? removeAmenity(amenity)
                        : addAmenityToList(amenity)
                    }
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      formData.amenities.includes(amenity)
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

              {/* Selected Amenities */}
              {formData.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                    >
                      <span>{amenity}</span>
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="text-emerald-600 hover:text-emerald-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Hình ảnh phòng *
              </label>
              
              {/* Sample Images */}
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Chọn từ thư viện mẫu:</div>
                <div className="grid grid-cols-4 gap-2">
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

              {/* Selected Images */}
              {formData.images.length > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-2">Hình ảnh đã chọn:</div>
                  <div className="grid grid-cols-4 gap-2">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Selected ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-emerald-600 text-white text-xs px-1 py-0.5 rounded">
                            Chính
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Thêm phòng
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;