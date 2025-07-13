# Database Layer

Layer database được thiết kế theo mô hình Repository Pattern với các thành phần sau:

## Cấu trúc thư mục

```
database/
├── model/           # Các struct đại diện cho database entities
├── repo/            # Interface định nghĩa các phương thức repository
├── mysql/           # Implementation của các repository
└── README.md        # File hướng dẫn này
```

## Models

### User
- **File**: `model/user.go`
- **Bảng**: `user`
- **Chức năng**: Quản lý thông tin người dùng (admin, host, guest)

### Homestay
- **File**: `model/homestay.go`
- **Bảng**: `homestay`
- **Chức năng**: Quản lý thông tin homestay

### Room
- **File**: `model/room.go`
- **Bảng**: `room`
- **Chức năng**: Quản lý thông tin phòng trong homestay

### RoomAvailability
- **File**: `model/room_availability.go`
- **Bảng**: `room_availability`
- **Chức năng**: Quản lý tính khả dụng của phòng theo ngày

### BookingRequest
- **File**: `model/booking_request.go`
- **Bảng**: `booking_request`
- **Chức năng**: Quản lý yêu cầu đặt phòng

### Booking
- **File**: `model/booking.go`
- **Bảng**: `booking`
- **Chức năng**: Quản lý booking đã được xác nhận

### Payment
- **File**: `model/payment.go`
- **Bảng**: `payment`
- **Chức năng**: Quản lý thanh toán

### Review
- **File**: `model/review.go`
- **Bảng**: `review`
- **Chức năng**: Quản lý đánh giá của khách hàng

## Repository Interfaces

Mỗi model có một interface repository tương ứng trong thư mục `repo/` với các phương thức CRUD cơ bản:

- `Create()` - Tạo mới
- `GetByID()` - Lấy theo ID
- `Update()` - Cập nhật
- `Delete()` - Xóa
- `List()` - Lấy danh sách với phân trang
- `Search()` - Tìm kiếm

## Repository Implementations

Các implementation được đặt trong thư mục `mysql/` với các tính năng:

- Sử dụng `sqlx` để tương tác với PostgreSQL
- Hỗ trợ context để timeout và cancellation
- Xử lý lỗi chi tiết
- Hỗ trợ transaction cho các thao tác phức tạp
- Tối ưu query với prepared statements

## Cách sử dụng

### 1. Khởi tạo database connection

```go
import "homestay-be/cmd/database/mysql"

config := &mysql.Config{
    Host:     "localhost",
    Port:     5432,
    User:     "postgres",
    Password: "password",
    DBName:   "homestay_db",
    SSLMode:  "disable",
}

db, err := mysql.NewConnection(config)
if err != nil {
    log.Fatal(err)
}
defer mysql.CloseConnection(db)
```

### 2. Khởi tạo repository factory

```go
repoFactory := mysql.NewRepositoryFactory(db)
```

### 3. Sử dụng các repository

```go
// Tạo user mới
userReq := &model.UserCreateRequest{
    Name:     "John Doe",
    Email:    "john@example.com",
    Password: "password123",
    Role:     "guest",
}

user, err := repoFactory.UserRepo.Create(ctx, userReq)
if err != nil {
    log.Printf("Failed to create user: %v", err)
}

// Tìm kiếm homestay
searchReq := &model.HomestaySearchRequest{
    Name:     &name,
    Address:  &address,
    Page:     1,
    PageSize: 10,
}

homestays, total, err := repoFactory.HomestayRepo.Search(ctx, searchReq)
if err != nil {
    log.Printf("Failed to search homestays: %v", err)
}

// Lấy danh sách room có sẵn
rooms, err := repoFactory.RoomRepo.GetAvailableRooms(ctx, homestayID, checkIn, checkOut, numGuests)
if err != nil {
    log.Printf("Failed to get available rooms: %v", err)
}
```

## Tính năng đặc biệt

### 1. Password Hashing
- Tự động hash password khi tạo/cập nhật user
- Sử dụng bcrypt với cost mặc định

### 2. Pagination
- Tất cả các phương thức List và Search đều hỗ trợ phân trang
- Trả về tổng số records để tính toán pagination

### 3. Dynamic Queries
- Các phương thức Update sử dụng dynamic query building
- Chỉ cập nhật các trường được cung cấp

### 4. Batch Operations
- RoomAvailability hỗ trợ tạo nhiều records cùng lúc
- Sử dụng transaction để đảm bảo consistency

### 5. Availability Checking
- Kiểm tra tính khả dụng của phòng trong khoảng thời gian
- Xem xét cả booking requests và bookings

## Error Handling

Tất cả các repository đều trả về error chi tiết với context:

```go
if err != nil {
    return fmt.Errorf("failed to create user: %w", err)
}
```

## Performance Considerations

1. **Indexes**: Database đã có các index cần thiết cho các trường thường query
2. **Prepared Statements**: Sử dụng sqlx để tận dụng prepared statements
3. **Connection Pooling**: sqlx tự động quản lý connection pool
4. **Context**: Sử dụng context để timeout và cancellation

## Testing

Để test các repository, bạn có thể:

1. Sử dụng test database
2. Mock các interface repository
3. Sử dụng test containers cho integration tests

## Migration

Database schema được định nghĩa trong file `data/init.sql`. Để cập nhật schema:

1. Tạo migration script
2. Chạy migration
3. Cập nhật models nếu cần 