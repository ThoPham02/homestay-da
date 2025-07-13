package model

import (
	"time"
)

// Homestay đại diện cho bảng homestay
type Homestay struct {
	ID          int       `db:"id" json:"id"`
	Name        string    `db:"name" json:"name"`
	Description string    `db:"description" json:"description"`
	Address     string    `db:"address" json:"address"`
	City        string    `db:"city" json:"city"`
	District    string    `db:"district" json:"district"`
	Ward        string    `db:"ward" json:"ward"`
	Latitude    float64   `db:"latitude" json:"latitude"`
	Longitude   float64   `db:"longitude" json:"longitude"`
	OwnerID     int       `db:"owner_id" json:"owner_id"`
	Status      string    `db:"status" json:"status"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time `db:"updated_at" json:"updated_at"`
	// Thông tin bổ sung từ join
	OwnerName string `db:"owner_name" json:"owner_name,omitempty"`
}

// HomestayCreateRequest request tạo homestay mới
type HomestayCreateRequest struct {
	Name        string  `json:"name" binding:"required"`
	Description string  `json:"description"`
	Address     string  `json:"address" binding:"required"`
	City        string  `json:"city" binding:"required"`
	District    string  `json:"district" binding:"required"`
	Ward        string  `json:"ward" binding:"required"`
	Latitude    float64 `json:"latitude" binding:"required"`
	Longitude   float64 `json:"longitude" binding:"required"`
	OwnerID     int     `json:"owner_id" binding:"required"`
}

// HomestayUpdateRequest request cập nhật homestay
type HomestayUpdateRequest struct {
	Name        *string  `json:"name"`
	Description *string  `json:"description"`
	Address     *string  `json:"address"`
	City        *string  `json:"city"`
	District    *string  `json:"district"`
	Ward        *string  `json:"ward"`
	Latitude    *float64 `json:"latitude"`
	Longitude   *float64 `json:"longitude"`
	Status      *string  `json:"status"`
}

// HomestaySearchRequest request tìm kiếm homestay
type HomestaySearchRequest struct {
	Name     *string `json:"name"`
	Address  *string `json:"address"`
	City     *string `json:"city"`
	District *string `json:"district"`
	Status   *string `json:"status"`
	OwnerID  *int    `json:"owner_id"`
	Page     int     `json:"page" binding:"min=1"`
	PageSize int     `json:"page_size" binding:"min=1,max=100"`
}

// HomestayStats thống kê homestay
type HomestayStats struct {
	TotalHomestays    int `json:"total_homestays"`
	ActiveHomestays   int `json:"active_homestays"`
	PendingHomestays  int `json:"pending_homestays"`
	InactiveHomestays int `json:"inactive_homestays"`
}
