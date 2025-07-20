// import { useNavigate, useParams } from "react-router-dom";
// import AddRoomModal from "../components/Room/AddRoomModal";
// import { useState } from "react";
// import { homestayService } from "../services/homestayService";

// // Trang riêng để hiển thị popup thêm phòng
// const RoomAddPage: React.FC = () => {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();
//     const [modalOpen, setModalOpen] = useState(true);

//     const handleClose = () => {
//         setModalOpen(false);
//         navigate(-1); // Quay lại trang trước
//     };

//     const handleSubmit = async (room: any) => {
//         if (!id) return;

//         console.log("Submitting room:", room);

//         try {
//             await homestayService.createRoom({
//                 homestayId: Number(id),
//                 name: room.name,
//                 description: room.description,
//                 type: room.type,
//                 capacity: room.capacity,
//                 price: room.price,
//                 priceType: room.priceType || 'per_night',
//                 amenities: room.amenities,
//                 images: room.images,
//             });
//             // Chuyển về trang quản lý homestay với state để reload danh sách phòng
//             navigate(`/management/homestay/${id}`, {
//                 state: {
//                     activeTab: 'rooms',
//                     refreshRooms: true
//                 }
//             });
//         } catch (error) {
//             // Có thể show toast lỗi ở đây nếu muốn
//         }
//     };

//     return (
//         <AddRoomModal
//             isOpen={modalOpen}
//             onClose={handleClose}
//             onSubmit={handleSubmit}
//             homestayId={id ? Number(id) : 0}
//         />
//     );
// };

// export default RoomAddPage;