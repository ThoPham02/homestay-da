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
	OwnerID     int       `db:"owner_id" json:"owner_id"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
	// Thông tin bổ sung từ join
	OwnerName string `db:"owner_name" json:"owner_name,omitempty"`
}

// HomestayCreateRequest request tạo homestay mới
type HomestayCreateRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	Address     string `json:"address" binding:"required"`
	OwnerID     int    `json:"owner_id" binding:"required"`
}

// HomestayUpdateRequest request cập nhật homestay
type HomestayUpdateRequest struct {
	Name        *string `json:"name"`
	Description *string `json:"description"`
	Address     *string `json:"address"`
}

// HomestaySearchRequest request tìm kiếm homestay
type HomestaySearchRequest struct {
	Name     *string `json:"name"`
	Address  *string `json:"address"`
	OwnerID  *int    `json:"owner_id"`
	Page     int     `json:"page" binding:"min=1"`
	PageSize int     `json:"page_size" binding:"min=1,max=100"`
} 