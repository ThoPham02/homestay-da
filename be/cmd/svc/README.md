# ServiceContext

ServiceContext là trung tâm quản lý tất cả các dependencies và services trong ứng dụng, bao gồm database connection và các repository.

## Cấu trúc

```go
type ServiceContext struct {
    Config config.Config
    DB     *sqlx.DB
    
    // Repositories
    UserRepo             repo.UserRepository
    HomestayRepo         repo.HomestayRepository
    RoomRepo             repo.RoomRepository
    RoomAvailabilityRepo repo.RoomAvailabilityRepository
    BookingRequestRepo   repo.BookingRequestRepository
    BookingRepo          repo.BookingRepository
    PaymentRepo          repo.PaymentRepository
    ReviewRepo           repo.ReviewRepository
}
```

## Khởi tạo

```go
// Load config
config, err := config.LoadConfig("configs/config.yaml")
if err != nil {
    log.Fatal(err)
}

// Tạo ServiceContext
svc := svc.NewServiceContext(*config)
defer svc.Close() // Đóng database connection khi kết thúc
```

## Cách sử dụng

### 1. Sử dụng trực tiếp từ ServiceContext

```go
// Tạo user mới
userReq := &model.UserCreateRequest{
    Name:     "John Doe",
    Email:    "john@example.com",
    Password: "password123",
    Role:     "guest",
}

user, err := svc.UserRepo.Create(ctx, userReq)
if err != nil {
    log.Printf("Failed to create user: %v", err)
    return
}

// Tìm kiếm homestay
searchReq := &model.HomestaySearchRequest{
    Name:     &name,
    Page:     1,
    PageSize: 10,
}

homestays, total, err := svc.HomestayRepo.Search(ctx, searchReq)
if err != nil {
    log.Printf("Failed to search homestays: %v", err)
    return
}
```

### 2. Sử dụng RepositoryHelper (Khuyến nghị)

RepositoryHelper cung cấp các phương thức tiện ích với tên rõ ràng hơn:

```go
helper := svc.NewRepositoryHelper(svc)

// Tạo user
user, err := helper.CreateUser(ctx, userReq)

// Lấy user theo ID
user, err := helper.GetUserByID(ctx, userID)

// Lấy user theo email
user, err := helper.GetUserByEmail(ctx, email)

// Cập nhật user
updatedUser, err := helper.UpdateUser(ctx, userID, updateReq)

// Xóa user
err := helper.DeleteUser(ctx, userID)

// Danh sách user với phân trang
users, total, err := helper.ListUsers(ctx, page, pageSize)

// Tìm kiếm user
users, total, err := helper.SearchUsers(ctx, name, email, role, page, pageSize)
```

## Các Repository có sẵn

### User Repository
- `CreateUser()` - Tạo user mới
- `GetUserByID()` - Lấy user theo ID
- `GetUserByEmail()` - Lấy user theo email
- `UpdateUser()` - Cập nhật user
- `DeleteUser()` - Xóa user
- `ListUsers()` - Danh sách user
- `SearchUsers()` - Tìm kiếm user

### Homestay Repository
- `CreateHomestay()` - Tạo homestay mới
- `GetHomestayByID()` - Lấy homestay theo ID
- `UpdateHomestay()` - Cập nhật homestay
- `DeleteHomestay()` - Xóa homestay
- `ListHomestays()` - Danh sách homestay
- `SearchHomestays()` - Tìm kiếm homestay
- `GetHomestaysByOwner()` - Lấy homestay theo owner

### Room Repository
- `CreateRoom()` - Tạo room mới
- `GetRoomByID()` - Lấy room theo ID
- `UpdateRoom()` - Cập nhật room
- `DeleteRoom()` - Xóa room
- `ListRooms()` - Danh sách room
- `SearchRooms()` - Tìm kiếm room
- `GetRoomsByHomestay()` - Lấy room theo homestay
- `GetAvailableRooms()` - Lấy room có sẵn

### Booking Request Repository
- `CreateBookingRequest()` - Tạo booking request
- `GetBookingRequestByID()` - Lấy booking request theo ID
- `UpdateBookingRequest()` - Cập nhật booking request
- `DeleteBookingRequest()` - Xóa booking request
- `ListBookingRequests()` - Danh sách booking request
- `SearchBookingRequests()` - Tìm kiếm booking request
- `GetBookingRequestsByUser()` - Lấy booking request theo user
- `GetBookingRequestsByRoom()` - Lấy booking request theo room
- `GetBookingRequestsByStatus()` - Lấy booking request theo status

### Booking Repository
- `CreateBooking()` - Tạo booking
- `GetBookingByID()` - Lấy booking theo ID
- `UpdateBooking()` - Cập nhật booking
- `DeleteBooking()` - Xóa booking
- `ListBookings()` - Danh sách booking
- `SearchBookings()` - Tìm kiếm booking
- `GetBookingsByUser()` - Lấy booking theo user
- `GetBookingsByRoom()` - Lấy booking theo room
- `GetBookingsByStatus()` - Lấy booking theo status
- `GetBookingByRequestID()` - Lấy booking theo request ID

### Payment Repository
- `CreatePayment()` - Tạo payment
- `GetPaymentByID()` - Lấy payment theo ID
- `UpdatePayment()` - Cập nhật payment
- `DeletePayment()` - Xóa payment
- `ListPayments()` - Danh sách payment
- `SearchPayments()` - Tìm kiếm payment
- `GetPaymentsByBooking()` - Lấy payment theo booking
- `GetPaymentsByStatus()` - Lấy payment theo status
- `GetPaymentByTransactionID()` - Lấy payment theo transaction ID

### Review Repository
- `CreateReview()` - Tạo review
- `GetReviewByID()` - Lấy review theo ID
- `UpdateReview()` - Cập nhật review
- `DeleteReview()` - Xóa review
- `ListReviews()` - Danh sách review
- `SearchReviews()` - Tìm kiếm review
- `GetReviewsByUser()` - Lấy review theo user
- `GetReviewsByHomestay()` - Lấy review theo homestay
- `GetReviewsByRating()` - Lấy review theo rating
- `GetAverageRating()` - Lấy rating trung bình

### Room Availability Repository
- `CreateRoomAvailability()` - Tạo room availability
- `GetRoomAvailabilityByID()` - Lấy room availability theo ID
- `UpdateRoomAvailability()` - Cập nhật room availability
- `DeleteRoomAvailability()` - Xóa room availability
- `ListRoomAvailabilities()` - Danh sách room availability
- `SearchRoomAvailabilities()` - Tìm kiếm room availability
- `GetRoomAvailabilitiesByRoom()` - Lấy room availability theo room
- `GetRoomAvailabilitiesByDateRange()` - Lấy room availability theo khoảng thời gian
- `CreateRoomAvailabilityBatch()` - Tạo nhiều room availability cùng lúc
- `CheckRoomAvailability()` - Kiểm tra tính khả dụng của room

## Cấu hình Database

File `configs/config.yaml`:

```yaml
http:
  path: localhost
  port: 8080
database:
  driver: postgres
  host: localhost
  port: 5432
  user: postgres
  password: password
  dbname: homestay_db
  sslmode: disable
```

## Error Handling

Tất cả các repository đều trả về error chi tiết. Luôn kiểm tra error:

```go
user, err := helper.CreateUser(ctx, userReq)
if err != nil {
    log.Printf("Failed to create user: %v", err)
    return
}
```

## Context Support

Tất cả các phương thức đều hỗ trợ context để timeout và cancellation:

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

user, err := helper.GetUserByID(ctx, userID)
if err != nil {
    log.Printf("Failed to get user: %v", err)
    return
}
```

## Pagination

Các phương thức List và Search đều hỗ trợ phân trang:

```go
// Trang 1, 10 items mỗi trang
users, total, err := helper.ListUsers(ctx, 1, 10)
if err != nil {
    log.Printf("Failed to list users: %v", err)
    return
}

log.Printf("Found %d users (total: %d)", len(users), total)
```

## Transaction Support

Để sử dụng transaction, truy cập trực tiếp database connection:

```go
tx, err := svc.DB.BeginTxx(ctx, nil)
if err != nil {
    return err
}
defer tx.Rollback()

// Thực hiện các thao tác trong transaction
// ...

// Commit transaction
if err := tx.Commit(); err != nil {
    return err
}
```

## Testing

Để test với ServiceContext, bạn có thể:

1. Sử dụng test database
2. Mock các repository interface
3. Sử dụng test containers

```go
func TestUserService(t *testing.T) {
    // Setup test database
    config := &config.Config{
        Database: config.Database{
            Host:     "localhost",
            Port:     5432,
            User:     "test_user",
            Password: "test_password",
            DBName:   "test_db",
            SSLMode:  "disable",
        },
    }
    
    svc := svc.NewServiceContext(*config)
    defer svc.Close()
    
    // Run tests
    // ...
}
```

## Best Practices

1. **Luôn sử dụng RepositoryHelper** thay vì truy cập trực tiếp repositories
2. **Kiểm tra error** cho tất cả các thao tác database
3. **Sử dụng context** để timeout và cancellation
4. **Đóng ServiceContext** khi kết thúc để giải phóng resources
5. **Sử dụng transaction** cho các thao tác phức tạp
6. **Validate input** trước khi gọi repository methods 