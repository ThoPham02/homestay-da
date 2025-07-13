package repo

import (
	"context"
	"homestay-be/cmd/database/model"
)

// BookingRepository định nghĩa các phương thức thao tác với bảng booking
type BookingRepository interface {
	// Create tạo booking mới
	Create(ctx context.Context, booking *model.BookingCreateRequest) (*model.Booking, error)
	
	// GetByID lấy booking theo ID
	GetByID(ctx context.Context, id int) (*model.Booking, error)
	
	// Update cập nhật thông tin booking
	Update(ctx context.Context, id int, booking *model.BookingUpdateRequest) (*model.Booking, error)
	
	// Delete xóa booking
	Delete(ctx context.Context, id int) error
	
	// List lấy danh sách booking với phân trang
	List(ctx context.Context, page, pageSize int) ([]*model.Booking, int, error)
	
	// Search tìm kiếm booking
	Search(ctx context.Context, req *model.BookingSearchRequest) ([]*model.Booking, int, error)
	
	// GetByUserID lấy danh sách booking theo user
	GetByUserID(ctx context.Context, userID int, page, pageSize int) ([]*model.Booking, int, error)
	
	// GetByRoomID lấy danh sách booking theo room
	GetByRoomID(ctx context.Context, roomID int, page, pageSize int) ([]*model.Booking, int, error)
	
	// GetByStatus lấy danh sách booking theo status
	GetByStatus(ctx context.Context, status string, page, pageSize int) ([]*model.Booking, int, error)
	
	// GetByBookingRequestID lấy booking theo booking request ID
	GetByBookingRequestID(ctx context.Context, bookingRequestID int) (*model.Booking, error)
} 