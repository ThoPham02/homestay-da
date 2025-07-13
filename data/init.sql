-- Tạo bảng user
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'host', 'guest')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng homestay
CREATE TABLE homestay (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    owner_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng room
CREATE TABLE room (
    id SERIAL PRIMARY KEY,
    homestay_id INTEGER NOT NULL REFERENCES homestay(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('single', 'double', 'family', 'dormitory')),
    capacity INTEGER NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    price_type VARCHAR(20) NOT NULL DEFAULT 'per_night' CHECK (price_type IN ('per_night', 'per_person')),
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng room_availability để quản lý tình trạng phòng theo ngày
CREATE TABLE room_availability (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL REFERENCES room(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked', 'blocked')),
    price DECIMAL(12,2), -- Giá có thể thay đổi theo ngày
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(room_id, date)
);

-- Tạo bảng booking_request để lưu yêu cầu đặt phòng
CREATE TABLE booking_request (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    room_id INTEGER NOT NULL REFERENCES room(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    num_guests INTEGER NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    host_note TEXT, -- Ghi chú từ chủ nhà
    guest_note TEXT, -- Ghi chú từ khách
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng booking (sau khi được xác nhận)
CREATE TABLE booking (
    id SERIAL PRIMARY KEY,
    booking_request_id INTEGER NOT NULL REFERENCES booking_request(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    room_id INTEGER NOT NULL REFERENCES room(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    num_guests INTEGER NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'checked_in', 'checked_out', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng payment để quản lý thanh toán
CREATE TABLE payment (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES booking(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'cash', 'bank_transfer', 'credit_card', etc.
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(100), -- Mã giao dịch từ cổng thanh toán
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng review
CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    homestay_id INTEGER NOT NULL REFERENCES homestay(id) ON DELETE CASCADE,
    booking_id INTEGER REFERENCES booking(id) ON DELETE SET NULL, -- Liên kết với booking cụ thể
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo indexes để tối ưu hiệu suất truy vấn
CREATE INDEX idx_homestay_owner_id ON homestay(owner_id);
CREATE INDEX idx_homestay_status ON homestay(status);
CREATE INDEX idx_homestay_city ON homestay(city);
CREATE INDEX idx_homestay_district ON homestay(district);
CREATE INDEX idx_room_homestay_id ON room(homestay_id);
CREATE INDEX idx_room_status ON room(status);
CREATE INDEX idx_booking_request_user_id ON booking_request(user_id);
CREATE INDEX idx_booking_request_room_id ON booking_request(room_id);
CREATE INDEX idx_booking_request_status ON booking_request(status);
CREATE INDEX idx_booking_user_id ON booking(user_id);
CREATE INDEX idx_booking_room_id ON booking(room_id);
CREATE INDEX idx_booking_status ON booking(status);
CREATE INDEX idx_room_availability_room_date ON room_availability(room_id, date);
CREATE INDEX idx_payment_booking_id ON payment(booking_id);
CREATE INDEX idx_payment_status ON payment(payment_status);
