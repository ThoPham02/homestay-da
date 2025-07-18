package model

import (
	"time"
)

// Booking đại diện cho bảng booking
// Không còn trường RoomID, thay vào đó dùng bảng booking_room
// Thêm trường Rooms để join sang các phòng
// BookingRequestID, UserID giữ lại nếu cần
// Nếu không còn dùng BookingRequestID/UserID thì có thể bỏ

type Booking struct {
	ID          int           `db:"id" json:"id"`
	CheckIn     time.Time     `db:"check_in" json:"check_in"`
	CheckOut    time.Time     `db:"check_out" json:"check_out"`
	NumGuests   int           `db:"num_guests" json:"num_guests"`
	TotalAmount float64       `db:"total_amount" json:"total_amount"`
	Status      string        `db:"status" json:"status"`
	CreatedAt   time.Time     `db:"created_at" json:"created_at"`
	Name        string        `db:"name" json:"name"`
	Email       string        `db:"email" json:"email"`
	Phone       string        `db:"phone" json:"phone"`
	Rooms       []BookingRoom `json:"rooms"`
}

// BookingCreateRequest request tạo booking mới
// Bỏ RoomID, thêm Rooms
// Nếu cần truyền nhiều thông tin cho từng phòng, dùng []BookingRoom

type BookingCreateRequest struct {
	Name      string                     `json:"name" binding:"required"`
	Email     string                     `json:"email" binding:"required"`
	Phone     string                     `json:"phone" binding:"required"`
	CheckIn   time.Time                  `json:"check_in" binding:"required"`
	CheckOut  time.Time                  `json:"check_out" binding:"required"`
	NumGuests int                        `json:"num_guests" binding:"required,min=1"`
	Rooms     []BookingRoomCreateRequest `json:"rooms" binding:"required,dive"`
}

type BookingRoomCreateRequest struct {
	RoomID    int     `json:"room_id" binding:"required"`
	Capacity  int     `json:"capacity" binding:"required,min=1"`
	Price     float64 `json:"price" binding:"required,min=0"`
	PriceType string  `json:"price_type" binding:"required"`
}

// BookingUpdateRequest giữ nguyên nếu chỉ update status
type BookingUpdateRequest struct {
	Status *string `json:"status" binding:"omitempty,oneof=confirmed checked_in checked_out cancelled"`
}

// BookingSearchRequest request tìm kiếm booking
type BookingSearchRequest struct {
	UserID    *int       `json:"user_id"`
	RoomID    *int       `json:"room_id"`
	Status    *string    `json:"status"`
	StartDate *time.Time `json:"start_date"`
	EndDate   *time.Time `json:"end_date"`
	Page      int        `json:"page" binding:"min=1"`
	PageSize  int        `json:"page_size" binding:"min=1,max=100"`
}
