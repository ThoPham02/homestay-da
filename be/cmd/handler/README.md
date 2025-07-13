# API Authentication Documentation

## Tổng quan

API Authentication cung cấp các endpoint để quản lý xác thực người dùng trong hệ thống homestay, bao gồm đăng ký, đăng nhập, quản lý profile và phân quyền.

## Format Response

Tất cả API đều trả về response theo format chuẩn:

```json
{
  "result": {
    "code": 0,
    "message": "Thành công"
  },
  "data": {
    // Dữ liệu thực tế ở đây
  }
}
```

### Mã lỗi (Code)
- `0`: Thành công
- `400`: Bad Request - Dữ liệu không hợp lệ
- `401`: Unauthorized - Chưa xác thực hoặc token không hợp lệ
- `403`: Forbidden - Không có quyền truy cập
- `404`: Not Found - Không tìm thấy tài nguyên
- `500`: Internal Server Error - Lỗi server

## Endpoints

### 1. Đăng ký (Register)

**POST** `/api/auth/register`

Đăng ký tài khoản mới với các role: `admin`, `host`, `guest`.

#### Request Body
```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123",
  "role": "guest"
}
```

#### Response Success
```json
{
  "result": {
    "code": 0,
    "message": "Thành công"
  },
  "data": {
    "user": {
      "id": 1,
      "name": "Nguyễn Văn A",
      "email": "user@example.com",
      "role": "guest"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 2592000
  }
}
```

#### Response Error
```json
{
  "result": {
    "code": 400,
    "message": "email đã được sử dụng"
  },
  "data": null
}
```

### 2. Đăng nhập (Login)

**POST** `/api/auth/login`

Đăng nhập với email và password.

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Response Success
```json
{
  "result": {
    "code": 0,
    "message": "Thành công"
  },
  "data": {
    "user": {
      "id": 1,
      "name": "Nguyễn Văn A",
      "email": "user@example.com",
      "role": "guest"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 2592000
  }
}
```

### 3. Lấy Profile (Get Profile)

**GET** `/api/auth/profile`

Lấy thông tin profile của user hiện tại. Yêu cầu xác thực.

#### Headers
```
Authorization: Bearer <access_token>
```

#### Response Success
```json
{
  "result": {
    "code": 0,
    "message": "Thành công"
  },
  "data": {
    "user": {
      "id": 1,
      "name": "Nguyễn Văn A",
      "email": "user@example.com",
      "role": "guest"
    }
  }
}
```

### 4. Đăng xuất (Logout)

**POST** `/api/auth/logout`

Đăng xuất và vô hiệu hóa token. Yêu cầu xác thực.

#### Headers
```
Authorization: Bearer <access_token>
```

#### Response Success
```json
{
  "result": {
    "code": 0,
    "message": "Thành công"
  },
  "data": {
    "message": "Đăng xuất thành công"
  }
}
```

## Middleware

### AuthMiddleware

Xác thực JWT token trong header `Authorization: Bearer <token>`.

### RoleMiddleware

Kiểm tra quyền truy cập dựa trên role của user.

#### Sử dụng trong Router
```go
// Route chỉ dành cho admin
adminGroup.GET("/dashboard", AuthMiddleware(svc), RoleMiddleware("admin"), handler.AdminDashboard)

// Route dành cho host và admin
hostGroup.GET("/my-homestays", AuthMiddleware(svc), RoleMiddleware("host", "admin"), handler.MyHomestays)
```

## Bảo mật

### JWT Token
- **Access Token**: Có hiệu lực 30 ngày (2,592,000 giây)
- **Không có Refresh Token**: Người dùng cần đăng nhập lại khi token hết hạn
- **Secret Key**: Cần cấu hình trong environment variables

### Password
- Được hash bằng bcrypt với cost mặc định
- Yêu cầu tối thiểu 6 ký tự

### Validation
- Email phải đúng định dạng
- Role chỉ chấp nhận: `admin`, `host`, `guest`
- Tên phải từ 2-100 ký tự

## Ví dụ sử dụng

### 1. Đăng ký và đăng nhập
```bash
# Đăng ký
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "guest"
  }'

# Đăng nhập
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Sử dụng token
```bash
# Lấy profile
curl -X GET http://localhost:8080/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Đăng xuất
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Error Handling

Tất cả lỗi đều trả về format chuẩn với code và message phù hợp:

```json
{
  "result": {
    "code": 400,
    "message": "Mô tả lỗi chi tiết"
  },
  "data": null
}
```

## Best Practices

1. **Luôn sử dụng HTTPS** trong production
2. **Lưu trữ token an toàn** ở client side
3. **Đăng nhập lại** khi access token hết hạn (sau 30 ngày)
4. **Validate input** ở cả client và server
5. **Log các hoạt động** quan trọng
6. **Rate limiting** để tránh brute force
7. **CORS configuration** phù hợp
8. **Environment variables** cho secret keys

## Cấu hình

### Environment Variables
```bash
JWT_SECRET_KEY=your-secret-key-here
JWT_ACCESS_TOKEN_EXPIRY=720h  # 30 days
```

### Database
Đảm bảo bảng `user` đã được tạo với schema:
```sql
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'host', 'guest')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Lưu ý quan trọng

### Token Management
- **Không có refresh token**: Đơn giản hóa hệ thống, giảm độ phức tạp
- **30 ngày**: Thời gian hợp lý cho user experience
- **Re-login**: Người dùng cần đăng nhập lại khi token hết hạn
- **Security**: Token dài hạn cần được bảo vệ tốt hơn

### Trade-offs
- ✅ **Đơn giản**: Không cần quản lý refresh token
- ✅ **Ít phức tạp**: Giảm surface area cho security issues
- ❌ **User experience**: Cần đăng nhập lại sau 30 ngày
- ❌ **Security**: Token dài hạn có thể bị lạm dụng nếu bị đánh cắp 