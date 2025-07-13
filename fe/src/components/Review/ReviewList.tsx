import React from 'react';
import { Star, User } from 'lucide-react';
import { Review } from '../../types';

interface ReviewListProps {
  reviews: Review[];
  showAll?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, showAll = false }) => {
  const displayReviews = showAll ? reviews : reviews.slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Chưa có đánh giá nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {displayReviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
          <div className="flex items-start space-x-4">
            <div className="bg-emerald-100 w-10 h-10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-emerald-600" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{review.guestName}</h4>
                  <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
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
      
      {!showAll && reviews.length > 3 && (
        <div className="text-center">
          <p className="text-gray-600">
            Hiển thị 3 trong {reviews.length} đánh giá
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewList;