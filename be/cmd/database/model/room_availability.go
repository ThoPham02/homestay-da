package model

import (
	"time"
)

// RoomAvailability đại diện cho bảng room_availability
type RoomAvailability struct {
	ID        int       `db:"id" json:"id"`
	RoomID    int       `db:"room_id" json:"room_id"`
	Date      time.Time `db:"date" json:"date"`
	Status    string    `db:"status" json:"status"`
	Price     *float64  `db:"price" json:"price"` // Có thể null
	CreatedAt time.Time `db:"created_at" json:"created_at"`
	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}

// RoomAvailabilityCreateRequest request tạo room availability mới
type RoomAvailabilityCreateRequest struct {
	RoomID int       `json:"room_id" binding:"required"`
	Date   time.Time `json:"date" binding:"required"`
	Status string    `json:"status" binding:"required"`
	Price  *float64  `json:"price" binding:"omitempty,min=0"`
}

// RoomAvailabilityUpdateRequest request cập nhật room availability
type RoomAvailabilityUpdateRequest struct {
	Status *string  `json:"status"`
	Price  *float64 `json:"price" binding:"omitempty,min=0"`
}

// RoomAvailabilitySearchRequest request tìm kiếm room availability
type RoomAvailabilitySearchRequest struct {
	RoomID    *int       `json:"room_id"`
	StartDate *time.Time `json:"start_date"`
	EndDate   *time.Time `json:"end_date"`
	Status    *string    `json:"status"`
}

// RoomAvailabilityBatchRequest request tạo nhiều room availability cùng lúc
type RoomAvailabilityBatchRequest struct {
	RoomID    int       `json:"room_id" binding:"required"`
	StartDate time.Time `json:"start_date" binding:"required"`
	EndDate   time.Time `json:"end_date" binding:"required"`
	Status    string    `json:"status" binding:"required"`
	Price     *float64  `json:"price" binding:"omitempty,min=0"`
}
