package model

import (
	"time"
)

// Review đại diện cho bảng review
type Review struct {
	ID         int       `db:"id" json:"id"`
	UserID     int       `db:"user_id" json:"user_id"`
	HomestayID int       `db:"homestay_id" json:"homestay_id"`
	BookingID  *int      `db:"booking_id" json:"booking_id"` // Có thể null
	Rating     int       `db:"rating" json:"rating"`
	Comment    string    `db:"comment" json:"comment"`
	CreatedAt  time.Time `db:"created_at" json:"created_at"`
	// Thông tin bổ sung từ join
	UserName     string `db:"user_name" json:"user_name,omitempty"`
	HomestayName string `db:"homestay_name" json:"homestay_name,omitempty"`
}

// ReviewCreateRequest request tạo review mới
type ReviewCreateRequest struct {
	UserID     int    `json:"user_id" binding:"required"`
	HomestayID int    `json:"homestay_id" binding:"required"`
	BookingID  *int   `json:"booking_id"`
	Rating     int    `json:"rating" binding:"required,min=1,max=5"`
	Comment    string `json:"comment"`
}

// ReviewUpdateRequest request cập nhật review
type ReviewUpdateRequest struct {
	Rating  *int    `json:"rating" binding:"omitempty,min=1,max=5"`
	Comment *string `json:"comment"`
}

// ReviewSearchRequest request tìm kiếm review
type ReviewSearchRequest struct {
	UserID     *int `json:"user_id"`
	HomestayID *int `json:"homestay_id"`
	Rating     *int `json:"rating"`
	Page       int  `json:"page" binding:"min=1"`
	PageSize   int  `json:"page_size" binding:"min=1,max=100"`
} 