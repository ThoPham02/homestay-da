package model

import (
	"time"
)

// RoomAvailability đại diện cho bảng room_availability
type RoomAvailability struct {
	ID          int       `db:"id" json:"id"`
	RoomID      int       `db:"room_id" json:"room_id"`
	Date        time.Time `db:"date" json:"date"`
	IsAvailable bool      `db:"is_available" json:"is_available"`
	Price       *float64  `db:"price" json:"price"` // Có thể null
}

// RoomAvailabilityCreateRequest request tạo room availability mới
type RoomAvailabilityCreateRequest struct {
	RoomID      int       `json:"room_id" binding:"required"`
	Date        time.Time `json:"date" binding:"required"`
	IsAvailable bool      `json:"is_available"`
	Price       *float64  `json:"price" binding:"omitempty,min=0"`
}

// RoomAvailabilityUpdateRequest request cập nhật room availability
type RoomAvailabilityUpdateRequest struct {
	IsAvailable *bool     `json:"is_available"`
	Price       *float64  `json:"price" binding:"omitempty,min=0"`
}

// RoomAvailabilitySearchRequest request tìm kiếm room availability
type RoomAvailabilitySearchRequest struct {
	RoomID      *int       `json:"room_id"`
	StartDate   *time.Time `json:"start_date"`
	EndDate     *time.Time `json:"end_date"`
	IsAvailable *bool      `json:"is_available"`
}

// RoomAvailabilityBatchRequest request tạo nhiều room availability cùng lúc
type RoomAvailabilityBatchRequest struct {
	RoomID      int       `json:"room_id" binding:"required"`
	StartDate   time.Time `json:"start_date" binding:"required"`
	EndDate     time.Time `json:"end_date" binding:"required"`
	IsAvailable bool      `json:"is_available"`
	Price       *float64  `json:"price" binding:"omitempty,min=0"`
} 