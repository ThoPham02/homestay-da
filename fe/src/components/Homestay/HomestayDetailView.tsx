import { MapPin, Users, Wifi, Car, Coffee, Tv, Bath, Wind, Star, Camera } from 'lucide-react';
import { Homestay } from '../../types';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { homestayService } from '../../services/homestayService';

const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
        case 'wi-fi miễn phí':
            return <Wifi className="w-4 h-4" />;
        case 'điều hòa':
            return <Wind className="w-4 h-4" />;
        case 'tv màn hình phẳng':
            return <Tv className="w-4 h-4" />;
        case 'phòng tắm riêng':
            return <Bath className="w-4 h-4" />;
        case 'bãi đỗ xe':
            return <Car className="w-4 h-4" />;
        case 'bếp nhỏ':
            return <Coffee className="w-4 h-4" />;
        default:
            return <Coffee className="w-4 h-4" />;
    }
};

function HomestayDetailView() {
    const { id } = useParams<{ id: string }>();
    const [homestay, setHomestay] = useState<Homestay>({} as Homestay);

    useEffect(() => {
        const fetchHomestay = async () => {
            const data = await homestayService.getPublicHomestayDetail(Number(id));

            console.log('Fetched Homestay:', data);

            setHomestay(data);
        };

        fetchHomestay();
    }, [id]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-emerald-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold mb-3">{homestay.name}</h1>
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-emerald-200" />
                                <span className="text-emerald-100">{homestay.address}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                    <span className="font-semibold">{homestay.rating}</span>
                                    <span className="text-emerald-200">({homestay.reviews} đánh giá)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
                        <p className="text-emerald-100 leading-relaxed">{homestay.description}</p>
                    </div>
                </div>
            </div>

            {/* Rooms Section */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="space-y-6 mt-12">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Danh sách chi tiết phòng</h2>
                        <p className="text-gray-600">Xem thông tin chi tiết từng phòng</p>
                    </div>

                    {homestay?.rooms?.map((room) => (
                        <div
                            key={room.id}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            {/* Room Image - Full Width at Top */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={room.images?.[0] || ''}
                                    alt={room.name}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {room.type}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                                    <Camera className="w-4 h-4 text-emerald-600" />
                                </div>
                            </div>

                            {/* Room Details */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-2xl font-bold text-gray-800">{room.name}</h3>
                                    <div className="flex items-center gap-1 text-emerald-600">
                                        <Users className="w-5 h-5" />
                                        <span className="font-medium">{room.capacity} khách</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-4 leading-relaxed">{room.description}</p>

                                {/* Amenities */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Tiện nghi:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {room?.amenities?.map((amenity, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm"
                                            >
                                                {getAmenityIcon(amenity)}
                                                <span>{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Price and CTA */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div>
                                        <div className="text-2xl font-bold text-emerald-600">
                                            {formatPrice(room.price)}
                                        </div>
                                        <div className="text-sm text-gray-500">/ đêm</div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                                            Chi tiết phòng
                                        </button>
                                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 transform hover:scale-105">
                                            Đặt phòng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Gallery Section */}
                <div className="mt-12 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-8 text-white">
                    <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold mb-2">Thư viện ảnh</h3>
                        <p className="text-emerald-100">Khám phá không gian đẹp của homestay</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {homestay?.rooms?.map((room, index) => (
                            <div key={index} className="relative group overflow-hidden rounded-xl">
                                <img
                                    src={room.images?.[0] || ''}
                                    alt={`Gallery ${index + 1}`}
                                    className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                    <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-6">
                        <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 backdrop-blur-sm">
                            Xem tất cả ảnh
                        </button>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-12">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Đánh giá từ khách hàng</h2>
                        <p className="text-gray-600">Những trải nghiệm thực tế từ khách đã lưu trú</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Nguyễn Văn A",
                                rating: 5,
                                comment: "Homestay rất đẹp và sạch sẽ. Chủ nhà thân thiện, phục vụ tốt. Sẽ quay lại lần sau!",
                                date: "2 tuần trước"
                            },
                            {
                                name: "Trần Thị B",
                                rating: 4,
                                comment: "Vị trí thuận tiện, phòng ốc thoải mái. View đẹp và yên tĩnh. Giá cả hợp lý.",
                                date: "1 tháng trước"
                            },
                            {
                                name: "Lê Minh C",
                                rating: 5,
                                comment: "Trải nghiệm tuyệt vời! Homestay có đầy đủ tiện nghi, không gian xanh mát.",
                                date: "3 tuần trước"
                            }
                        ].map((review, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-gray-800">{review.name}</h4>
                                    <div className="flex items-center gap-1">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-3 leading-relaxed">{review.comment}</p>
                                <p className="text-sm text-gray-400">{review.date}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Location Section */}
                <div className="mt-12">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Vị trí</h2>
                        <p className="text-gray-600">Homestay nằm ở vị trí thuận tiện, dễ dàng di chuyển</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="bg-emerald-100 p-3 rounded-full">
                                <MapPin className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Địa chỉ chi tiết</h3>
                                <p className="text-gray-600">{homestay.address}, {homestay.city}, {homestay.district}, </p>
                            </div>
                        </div>

                        <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <MapPin className="w-12 h-12 mx-auto mb-2 text-emerald-600" />
                                <p>Bản đồ sẽ được hiển thị tại đây</p>
                            </div>
                        </div>

                        {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="font-semibold text-emerald-700">5 phút</div>
                <div className="text-sm text-gray-600">đến trung tâm thành phố</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="font-semibold text-emerald-700">10 phút</div>
                <div className="text-sm text-gray-600">đến sân bay</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="font-semibold text-emerald-700">2 phút</div>
                <div className="text-sm text-gray-600">đến bến xe bus</div>
              </div>
            </div> */}
                    </div>
                </div>

                {/* Policies Section */}
                <div className="mt-12">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Chính sách homestay</h2>
                        <p className="text-gray-600">Những quy định cần biết khi lưu trú</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="font-semibold text-gray-800 mb-3">Check-in / Check-out</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Check-in: 14:00 - 22:00</li>
                                <li>• Check-out: 06:00 - 12:00</li>
                                <li>• Check-in sớm/muộn: Liên hệ trước</li>
                            </ul>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="font-semibold text-gray-800 mb-3">Hủy đặt phòng</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Miễn phí hủy trước 24h</li>
                                <li>• Hủy trong 24h: Phí 50%</li>
                                <li>• No-show: Phí 100%</li>
                            </ul>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="font-semibold text-gray-800 mb-3">Quy định chung</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Không hút thuốc trong phòng</li>
                                <li>• Không mang thú cưng</li>
                                <li>• Giữ yên lặng sau 22:00</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-12">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Câu hỏi thường gặp</h2>
                        <p className="text-gray-600">Những thắc mắc phổ biến về homestay</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                question: "Homestay có wifi miễn phí không?",
                                answer: "Có, chúng tôi cung cấp wifi miễn phí tốc độ cao trong toàn bộ khu vực homestay."
                            },
                            {
                                question: "Có dịch vụ đưa đón sân bay không?",
                                answer: "Có, chúng tôi cung cấp dịch vụ đưa đón sân bay với phí phụ thu. Vui lòng liên hệ trước để đặt lịch."
                            },
                            {
                                question: "Homestay có phù hợp cho gia đình có trẻ em không?",
                                answer: "Hoàn toàn phù hợp! Chúng tôi có các phòng family suite và nhiều tiện ích dành cho trẻ em."
                            },
                            {
                                question: "Có thể nấu ăn tại homestay không?",
                                answer: "Một số phòng có bếp nhỏ để nấu ăn đơn giản. Ngoài ra, chúng tôi cũng có dịch vụ ăn uống."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Booking Summary */}
                <div className="mt-12 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-8 text-white">
                    <div className="text-center">
                        <h3 className="text-3xl font-bold mb-4">Sẵn sàng đặt phòng?</h3>
                        <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
                            Trải nghiệm kỳ nghỉ tuyệt vời tại {homestay.name} với dịch vụ chất lượng cao và không gian thoải mái
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200">
                                Xem tất cả phòng
                            </button>
                            <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl font-semibold transition-colors duration-200">
                                Đặt ngay
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="mt-12 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-bold text-emerald-800 mb-2">Cần hỗ trợ?</h3>
                    <p className="text-emerald-700 mb-4">
                        Liên hệ với chúng tôi để được tư vấn và hỗ trợ đặt phòng
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200">
                            Gọi ngay: 0123 456 789
                        </button>
                        <button className="bg-white hover:bg-gray-50 text-emerald-600 border-2 border-emerald-600 px-6 py-3 rounded-xl font-medium transition-colors duration-200">
                            Chat với chúng tôi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomestayDetailView;