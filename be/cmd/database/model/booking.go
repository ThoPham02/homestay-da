package model

import (
	"time"
)

// Booking đại diện cho bảng booking
type Booking struct {
	ID                int       `db:"id" json:"id"`
	BookingRequestID  int       `db:"booking_request_id" json:"booking_request_id"`
	UserID            int       `db:"user_id" json:"user_id"`
	RoomID            int       `db:"room_id" json:"room_id"`
	CheckIn           time.Time `db:"check_in" json:"check_in"`
	CheckOut          time.Time `db:"check_out" json:"check_out"`
	NumGuests         int       `db:"num_guests" json:"num_guests"`
	TotalAmount       float64   `db:"total_amount" json:"total_amount"`
	Status            string    `db:"status" json:"status"`
	CreatedAt         time.Time `db:"created_at" json:"created_at"`
	// Thông tin bổ sung từ join
	UserName     string `db:"user_name" json:"user_name,omitempty"`
	RoomName     string `db:"room_name" json:"room_name,omitempty"`
	HomestayName string `db:"homestay_name" json:"homestay_name,omitempty"`
}

// BookingCreateRequest request tạo booking mới
type BookingCreateRequest struct {
	BookingRequestID int       `json:"booking_request_id" binding:"required"`
	UserID           int       `json:"user_id" binding:"required"`
	RoomID           int       `json:"room_id" binding:"required"`
	CheckIn          time.Time `json:"check_in" binding:"required"`
	CheckOut         time.Time `json:"check_out" binding:"required"`
	NumGuests        int       `json:"num_guests" binding:"required,min=1"`
	TotalAmount      float64   `json:"total_amount" binding:"required,min=0"`
	Status           string    `json:"status" binding:"required,oneof=confirmed checked_in checked_out cancelled"`
}

// BookingUpdateRequest request cập nhật booking
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