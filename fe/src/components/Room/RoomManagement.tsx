// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Calendar, Users, DollarSign } from 'lucide-react';
// import { homestayService } from '../../services/homestayService';
// import { Room, CreateRoomRequest, UpdateRoomRequest } from '../../types';
// import { useConfirm } from '../ConfirmDialog';

// interface RoomManagementProps {
//   homestayId: number;
//   onRoomAdded?: () => void;
// }

// const RoomManagement: React.FC<RoomManagementProps> = ({ homestayId, onRoomAdded }) => {
//   const confirm = useConfirm();
//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editingRoom, setEditingRoom] = useState<Room | null>(null);
//   const [formData, setFormData] = useState<CreateRoomRequest>({
//     homestayId,
//     name: '',
//     description: '',
//     type: 'single',
//     capacity: 1,
//     price: 0,
//     priceType: 'per_night'
//   });

//   const loadRooms = async () => {
//     try {
//       setLoading(true);
//       const response = await homestayService.getRoomList({ homestayId });
//       setRooms(response.rooms);
//     } catch (error) {
//       console.error('Error loading rooms:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadRooms();
//   }, [homestayId]);

//   const handleInputChange = (field: keyof CreateRoomRequest, value: any) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const resetForm = () => {
//     setFormData({
//       homestayId,
//       name: '',
//       description: '',
//       type: 'single',
//       capacity: 1,
//       price: 0,
//       priceType: 'per_night'
//     });
//     setEditingRoom(null);
//     setShowAddForm(false);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.name || !formData.description || formData.price <= 0) {
//       alert('Vui lòng điền đầy đủ thông tin!');
//       return;
//     }

//     try {
//       if (editingRoom) {
//         const updateData: UpdateRoomRequest = {
//           name: formData.name,
//           description: formData.description,
//           type: formData.type,
//           capacity: formData.capacity,
//           price: formData.price,
//           priceType: formData.priceType
//         };
//         await homestayService.updateRoom(editingRoom.id, updateData);
//       } else {
//         await homestayService.createRoom(formData);
//       }
      
//       resetForm();
//       await loadRooms();
//       onRoomAdded?.();
//     } catch (error) {
//       console.error('Error saving room:', error);
//     }
//   };

//   const handleEdit = (room: Room) => {
//     setEditingRoom(room);
//     setFormData({
//       homestayId,
//       name: room.name,
//       description: room.description,
//       type: room.type,
//       capacity: room.capacity,
//       price: room.price,
//       priceType: room.priceType
//     });
//     setShowAddForm(true);
//   };

//   const handleDelete = async (roomId: number) => {
//     const result = await confirm({
//       title: 'Xác nhận xóa phòng',
//       description: `Bạn có chắc chắn muốn xóa phòng này?`
//     });

//     if (result) {
//       try {
//         await homestayService.deleteRoom(roomId);
//         await loadRooms();
//         onRoomAdded?.();
//       } catch (error) {
//         console.error('Error deleting room:', error);
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center py-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-semibold text-gray-900">Quản lý Phòng</h3>
//         <button
//           onClick={() => setShowAddForm(true)}
//           className="flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
//         >
//           <Plus className="h-4 w-4 mr-2" />
//           Thêm Phòng
//         </button>
//       </div>

//       {/* Add/Edit Form */}
//       {showAddForm && (
//         <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
//           <h4 className="text-lg font-medium text-gray-900 mb-4">
//             {editingRoom ? 'Chỉnh sửa Phòng' : 'Thêm Phòng Mới'}
//           </h4>
          
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Tên phòng *
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => handleInputChange('name', e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//                   placeholder="Phòng Deluxe View Núi"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Loại phòng *
//                 </label>
//                 <select
//                   value={formData.type}
//                   onChange={(e) => handleInputChange('type', e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//                   required
//                 >
//                   <option value="single">Phòng đơn</option>
//                   <option value="double">Phòng đôi</option>
//                   <option value="family">Phòng gia đình</option>
//                   <option value="dormitory">Phòng tập thể</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Sức chứa *
//                 </label>
//                 <input
//                   type="number"
//                   min="1"
//                   max="20"
//                   value={formData.capacity}
//                   onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Giá (VNĐ) *
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   value={formData.price}
//                   onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//                   placeholder="500000"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Loại giá *
//                 </label>
//                 <select
//                   value={formData.priceType}
//                   onChange={(e) => handleInputChange('priceType', e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//                   required
//                 >
//                   <option value="per_night">Theo đêm</option>
//                   <option value="per_person">Theo người</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Mô tả *
//               </label>
//               <textarea
//                 value={formData.description}
//                 onChange={(e) => handleInputChange('description', e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//                 placeholder="Mô tả chi tiết về phòng..."
//                 rows={3}
//                 required
//               />
//             </div>

//             <div className="flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//               >
//                 Hủy
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
//               >
//                 {editingRoom ? 'Cập nhật' : 'Thêm Phòng'}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Room List */}
//       <div className="space-y-4">
//         {rooms.length === 0 ? (
//           <div className="text-center py-8">
//             <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-600">Chưa có phòng nào</p>
//             <p className="text-sm text-gray-500">Bắt đầu bằng cách thêm phòng đầu tiên</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {rooms.map((room) => (
//               <div key={room.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
//                 <div className="flex justify-between items-start mb-3">
//                   <h4 className="font-medium text-gray-900 truncate">{room.name}</h4>
//                   <span className={`px-2 py-1 text-xs font-medium rounded-full ${homestayService.getStatusColor(room.status)}`}>
//                     {homestayService.formatStatus(room.status)}
//                   </span>
//                 </div>

//                 <p className="text-sm text-gray-600 mb-3 line-clamp-2">{room.description}</p>

//                 <div className="space-y-2 mb-4">
//                   <div className="flex items-center text-sm text-gray-600">
//                     <Users className="h-4 w-4 mr-2" />
//                     {room.capacity} người • {homestayService.formatRoomType(room.type)}
//                   </div>
//                   <div className="flex items-center text-sm text-gray-600">
//                     <DollarSign className="h-4 w-4 mr-2" />
//                     {homestayService.formatPrice(room.price)} {homestayService.formatPriceType(room.priceType)}
//                   </div>
//                 </div>

//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => handleEdit(room)}
//                     className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
//                   >
//                     <Edit className="h-4 w-4 mr-1" />
//                     Sửa
//                   </button>
//                   <button
//                     onClick={() => handleDelete(room.id)}
//                     className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
//                   >
//                     <Trash2 className="h-4 w-4 mr-1" />
//                     Xóa
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RoomManagement; 