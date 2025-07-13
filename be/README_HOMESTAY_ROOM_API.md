# API Homestay & Room Management

Tài liệu này mô tả các API để quản lý homestay và phòng dành cho người cho thuê (host).

## Tổng quan

Hệ thống cung cấp các API CRUD đầy đủ cho:
- **Homestay Management**: Tạo, đọc, cập nhật, xóa homestay
- **Room Management**: Tạo, đọc, cập nhật, xóa phòng
- **Room Availability**: Quản lý lịch trống của phòng
- **Statistics**: Thống kê homestay và phòng

## Authentication

Tất cả API đều yêu cầu authentication bằng JWT token với role `host` hoặc `admin`.

```http
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### 1. Homestay Management

#### 1.1 Tạo Homestay
```http
POST /api/host/homestays
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Homestay Sapa View",
  "description": "Homestay đẹp với view núi Sapa...",
  "address": "123 Đường Fansipan",
  "city": "Lào Cai",
  "district": "Sa Pa",
  "ward": "Phường Sa Pa",
  "latitude": 22.3361,
  "longitude": 103.8444
}
```

**Response:**
```json
{
  "result": {
    "code": 200,
    "message": "Tạo homestay thành công"
  },
  "data": {
    "id": 1,
    "name": "Homestay Sapa View",
    "description": "...",
    "address": "123 Đường Fansipan",
    "city": "Lào Cai",
    "district": "Sa Pa",
    "ward": "Phường Sa Pa",
    "latitude": 22.3361,
    "longitude": 103.8444,
    "host_id": 2,
    "status": "pending",
    "created_at": "2024-01-10T10:00:00Z",
    "updated_at": "2024-01-10T10:00:00Z"
  }
}
```

#### 1.2 Lấy Danh Sách Homestay
```http
GET /api/host/homestays?page=1&page_size=10&status=active&city=Lào Cai
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Số trang (default: 1)
- `page_size` (optional): Số lượng item mỗi trang (default: 10, max: 100)
- `status` (optional): Lọc theo trạng thái (active, inactive, pending)
- `city` (optional): Lọc theo thành phố
- `district` (optional): Lọc theo quận/huyện

#### 1.3 Lấy Chi Tiết Homestay
```http
GET /api/host/homestays/{id}
Authorization: Bearer <token>
```

**Response bao gồm:**
- Thông tin homestay
- Danh sách phòng thuộc homestay

#### 1.4 Cập Nhật Homestay
```http
PUT /api/host/homestays/{id}
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Homestay Sapa View Premium",
  "description": "Homestay cao cấp...",
  "status": "active"
}
```

#### 1.5 Xóa Homestay
```http
DELETE /api/host/homestays/{id}
Authorization: Bearer <token>
```

**Lưu ý:** Chỉ có thể xóa homestay khi không có booking đang hoạt động.

#### 1.6 Thống Kê Homestay
```http
GET /api/host/homestays/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "result": {
    "code": 200,
    "message": "Lấy thống kê homestay thành công"
  },
  "data": {
    "total_homestays": 5,
    "active_homestays": 3,
    "total_rooms": 15,
    "available_rooms": 10,
    "total_bookings": 25,
    "total_revenue": 50000000
  }
}
```

#### 1.7 Thống Kê Homestay Theo ID
```http
GET /api/host/homestays/{id}/stats
Authorization: Bearer <token>
```

### 2. Room Management

#### 2.1 Tạo Phòng
```http
POST /api/host/rooms
Content-Type: application/json
Authorization: Bearer <token>

{
  "homestay_id": 1,
  "name": "Phòng Deluxe View Núi",
  "description": "Phòng cao cấp với view núi Sapa...",
  "type": "double",
  "capacity": 2,
  "price": 800000,
  "price_type": "per_night"
}
```

**Room Types:**
- `single`: Phòng đơn
- `double`: Phòng đôi
- `family`: Phòng gia đình
- `dormitory`: Phòng tập thể

**Price Types:**
- `per_night`: Giá theo đêm
- `per_person`: Giá theo người

#### 2.2 Lấy Danh Sách Phòng
```http
GET /api/host/rooms?homestay_id=1&page=1&page_size=10&status=available&type=double&min_price=500000&max_price=1000000
Authorization: Bearer <token>
```

**Query Parameters:**
- `homestay_id` (required): ID của homestay
- `page` (optional): Số trang
- `page_size` (optional): Số lượng item mỗi trang
- `status` (optional): Lọc theo trạng thái (available, occupied, maintenance)
- `type` (optional): Lọc theo loại phòng
- `min_price` (optional): Giá tối thiểu
- `max_price` (optional): Giá tối đa

#### 2.3 Lấy Chi Tiết Phòng
```http
GET /api/host/rooms/{id}
Authorization: Bearer <token>
```

**Response bao gồm:**
- Thông tin phòng
- Thông tin homestay
- Danh sách availability

#### 2.4 Cập Nhật Phòng
```http
PUT /api/host/rooms/{id}
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Phòng Deluxe View Núi Premium",
  "price": 900000,
  "status": "available"
}
```

#### 2.5 Xóa Phòng
```http
DELETE /api/host/rooms/{id}
Authorization: Bearer <token>
```

**Lưu ý:** Chỉ có thể xóa phòng khi không có booking đang hoạt động.

#### 2.6 Thống Kê Phòng
```http
GET /api/host/homestays/{homestay_id}/rooms/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "result": {
    "code": 200,
    "message": "Lấy thống kê phòng thành công"
  },
  "data": {
    "total_rooms": 5,
    "available_rooms": 3,
    "occupied_rooms": 1,
    "maintenance_rooms": 1,
    "average_price": 750000,
    "total_revenue": 15000000,
    "occupancy_rate": 60.0
  }
}
```

### 3. Room Availability Management

#### 3.1 Tạo Availability
```http
POST /api/host/rooms/availability
Content-Type: application/json
Authorization: Bearer <token>

{
  "room_id": 1,
  "date": "2024-01-15",
  "status": "available",
  "price": 950000
}
```

**Status Values:**
- `available`: Có thể đặt
- `booked`: Đã được đặt
- `blocked`: Bị chặn (không cho đặt)

#### 3.2 Cập Nhật Availability
```http
PUT /api/host/rooms/availability/{id}
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "booked",
  "price": 1100000
}
```

#### 3.3 Cập Nhật Availability Hàng Loạt
```http
POST /api/host/rooms/availability/bulk
Content-Type: application/json
Authorization: Bearer <token>

{
  "room_id": 1,
  "start_date": "2024-01-20",
  "end_date": "2024-01-25",
  "status": "available",
  "price": 1000000,
  "exclude_dates": ["2024-01-22"]
}
```

## Validation Rules

### Homestay Validation
- `name`: Required, 2-100 ký tự
- `description`: Required, 10-1000 ký tự
- `address`: Required, 5-200 ký tự
- `city`: Required, 2-50 ký tự
- `district`: Required, 2-50 ký tự
- `ward`: Required, 2-50 ký tự
- `latitude`: Required, số thực
- `longitude`: Required, số thực

### Room Validation
- `homestay_id`: Required, phải tồn tại
- `name`: Required, 2-100 ký tự
- `description`: Required, 10-500 ký tự
- `type`: Required, một trong: single, double, family, dormitory
- `capacity`: Required, 1-20 người
- `price`: Required, >= 0
- `price_type`: Required, một trong: per_night, per_person

### Availability Validation
- `room_id`: Required, phải tồn tại
- `date`: Required, định dạng YYYY-MM-DD
- `status`: Required, một trong: available, booked, blocked
- `price`: Optional, >= 0

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Dữ liệu không hợp lệ |
| 401 | Unauthorized | Không có token hoặc token không hợp lệ |
| 403 | Forbidden | Không có quyền truy cập |
| 404 | Not Found | Không tìm thấy resource |
| 500 | Internal Server Error | Lỗi server |

## Error Response Format

```json
{
  "result": {
    "code": 400,
    "message": "Dữ liệu không hợp lệ: Name is required"
  },
  "data": null
}
```

## Testing

Sử dụng file `test_homestay_room.http` để test các API:

1. Import file vào VS Code với extension REST Client
2. Thay đổi `@baseUrl` nếu cần
3. Chạy từng request để test

### Test Flow

1. **Login** để lấy token
2. **Tạo homestay** mới
3. **Tạo phòng** cho homestay
4. **Tạo availability** cho phòng
5. **Test các operation** khác
6. **Cleanup** (xóa test data)

## Security Considerations

1. **Authentication**: Tất cả API đều yêu cầu JWT token
2. **Authorization**: Chỉ host sở hữu hoặc admin mới có quyền truy cập
3. **Input Validation**: Tất cả input đều được validate
4. **SQL Injection**: Sử dụng prepared statements
5. **XSS Protection**: Validate và escape output

## Performance Considerations

1. **Pagination**: Tất cả list API đều hỗ trợ pagination
2. **Indexing**: Đảm bảo có index cho các field thường query
3. **Caching**: Có thể implement caching cho thống kê
4. **Connection Pooling**: Sử dụng connection pool cho database

## Future Enhancements

1. **Image Upload**: Hỗ trợ upload ảnh cho homestay và phòng
2. **Search & Filter**: Tìm kiếm nâng cao
3. **Calendar View**: Hiển thị availability dạng calendar
4. **Bulk Operations**: Thao tác hàng loạt
5. **Webhook**: Thông báo khi có thay đổi
6. **Analytics**: Thống kê chi tiết hơn 