import React, { useState } from 'react';
import { Star, X, Camera, Upload } from 'lucide-react';
import { Review, Booking, Homestay } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  homestay: Homestay;
  onSubmit: (review: Review) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ 
  isOpen, 
  onClose, 
  booking, 
  homestay, 
  onSubmit 
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const sampleImages = [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];

  const addImage = (url: string) => {
    if (url && !images.includes(url) && images.length < 5) {
      setImages(prev => [...prev, url]);
    }
  };

  const removeImage = (url: string) => {
    setImages(prev => prev.filter(img => img !== url));
  };

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      addImage(imageUrl.trim());
      setImageUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      alert('Vui lòng nhập nhận xét!');
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      homestayId: homestay.id,
      bookingId: booking.id,
      guestId: user?.id || '',
      guestName: user?.name || booking.guestName,
      rating,
      comment: comment.trim(),
      images: images.length > 0 ? images : undefined,
      createdAt: new Date().toISOString()
    };

    onSubmit(review);
    onClose();
    
    // Reset form
    setRating(5);
    setComment('');
    setImages([]);
    setImageUrl('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Đánh giá homestay</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={homestay.images[0]}
                alt={homestay.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{homestay.name}</h3>
                <p className="text-sm text-gray-600">{homestay.location}</p>
                <p className="text-sm text-gray-500">
                  {booking.checkIn} - {booking.checkOut}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Đánh giá tổng thể
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {rating === 1 && 'Rất tệ'}
                  {rating === 2 && 'Tệ'}
                  {rating === 3 && 'Bình thường'}
                  {rating === 4 && 'Tốt'}
                  {rating === 5 && 'Tuyệt vời'}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhận xét chi tiết *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Chia sẻ trải nghiệm của bạn về homestay này..."
                required
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Hình ảnh (tùy chọn)
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
                        className="w-full h-16 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-emerald-300"
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
              {images.length > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-2">Hình ảnh đã chọn:</div>
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Selected ${index + 1}`}
                          className="w-full h-16 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
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
                Gửi đánh giá
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;