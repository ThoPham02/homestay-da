// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';
// import HomestayDetailView from '../components/Homestay/HomestayDetailView';
// import { homestayService } from '../services/homestayService';
// import { useAuth } from '../contexts/AuthContext';
// import { Homestay, HomestayDetailResponse } from '../types';

// const HomestayDetail: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [homestayDetail, setHomestayDetail] = useState<HomestayDetailResponse | null>(null);
//   const [loading, setLoading] = useState(true);

//   const homestayId = parseInt(id || '0');

//   const loadHomestayDetail = async () => {
//     if (!homestayId) return;
    
//     try {
//       setLoading(true);
//       const response = await homestayService.getHomestayById(homestayId);
//       setHomestayDetail(response);
//     } catch (error) {
//       console.error('Error loading homestay detail:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadHomestayDetail();
//   }, [homestayId]);

//   const handleBack = () => {
//     navigate(-1);
//   };

//   const handleBooking = (bookingData: any) => {
//     if (!user) {
//       alert('Vui lòng đăng nhập để đặt phòng!');
//       return;
//     }

//     if (!homestayDetail) return;

//     // TODO: Implement booking API call
//     console.log('Booking data:', bookingData);
//     alert('Tính năng đặt phòng sẽ được cập nhật sớm!');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Đang tải thông tin homestay...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!homestayDetail) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy homestay</h2>
//           <button
//             onClick={handleBack}
//             className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700"
//           >
//             <ArrowLeft className="h-5 w-5" />
//             <span>Quay lại</span>
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <HomestayDetailView
//       homestay={homestayDetail.homestay}
//       onBack={handleBack}
//       onBook={handleBooking}
//     />
//   );
// };

// export default HomestayDetail;