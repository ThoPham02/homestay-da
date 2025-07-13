import React from 'react';
import { Shield, Award, Users, Heart, MapPin, Phone, Mail } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-emerald-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Về HomeStay Vietnam
          </h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Chúng tôi kết nối du khách với những homestay tuyệt vời nhất khắp Việt Nam, 
            mang đến trải nghiệm du lịch đích thực và đáng nhớ.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sứ mệnh của chúng tôi</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            HomeStay Vietnam được thành lập với mục tiêu tạo ra một nền tảng tin cậy, 
            kết nối du khách với những chủ nhà thân thiện và homestay chất lượng cao. 
            Chúng tôi tin rằng du lịch không chỉ là việc tham quan các địa điểm, 
            mà còn là cơ hội để trải nghiệm văn hóa địa phương một cách chân thực nhất.
          </p>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">An toàn & Tin cậy</h3>
            <p className="text-gray-600">
              Tất cả homestay được kiểm duyệt kỹ lưỡng để đảm bảo chất lượng và an toàn cho khách hàng.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Chất lượng cao</h3>
            <p className="text-gray-600">
              Chúng tôi chỉ hợp tác với những homestay có tiêu chuẩn cao về dịch vụ và tiện nghi.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cộng đồng</h3>
            <p className="text-gray-600">
              Xây dựng cộng đồng du lịch bền vững, mang lại lợi ích cho cả du khách và người dân địa phương.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Trải nghiệm đáng nhớ</h3>
            <p className="text-gray-600">
              Mỗi chuyến đi đều là một câu chuyện đẹp, một kỷ niệm khó quên trong cuộc đời.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Những con số ấn tượng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">500+</div>
              <div className="text-gray-600">Homestay đối tác</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">10,000+</div>
              <div className="text-gray-600">Khách hàng hài lòng</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">63</div>
              <div className="text-gray-600">Tỉnh thành</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">4.8★</div>
              <div className="text-gray-600">Đánh giá trung bình</div>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Câu chuyện của chúng tôi</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                HomeStay Vietnam ra đời từ niềm đam mê du lịch và mong muốn chia sẻ vẻ đẹp của Việt Nam 
                với bạn bè quốc tế. Chúng tôi bắt đầu với một ý tưởng đơn giản: tạo ra một nền tảng 
                kết nối du khách với những gia đình Việt Nam hiếu khách.
              </p>
              <p>
                Qua nhiều năm phát triển, chúng tôi đã xây dựng được một mạng lưới homestay trải khắp 
                từ Bắc đến Nam, từ những thành phố sôi động đến những vùng quê yên bình. Mỗi homestay 
                đều mang một câu chuyện riêng, một nét văn hóa độc đáo.
              </p>
              <p>
                Ngày nay, HomeStay Vietnam tự hào là cầu nối tin cậy giữa du khách và chủ homestay, 
                góp phần thúc đẩy du lịch bền vững và phát triển kinh tế địa phương.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Về chúng tôi"
              className="rounded-2xl shadow-lg w-full h-96 object-cover"
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-emerald-50 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Liên hệ với chúng tôi</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Bạn có câu hỏi hoặc cần hỗ trợ? Đội ngũ chăm sóc khách hàng của chúng tôi 
            luôn sẵn sàng giúp đỡ bạn 24/7.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <MapPin className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-1">Địa chỉ</h3>
              <p className="text-gray-600 text-sm">
                123 Đường Lê Lợi, Quận 1<br />
                Thành phố Hồ Chí Minh
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <Phone className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-1">Điện thoại</h3>
              <p className="text-gray-600 text-sm">
                +84 28 1234 5678<br />
                Hotline: 1900 1234
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-gray-600 text-sm">
                info@homestayvietnam.com<br />
                support@homestayvietnam.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;