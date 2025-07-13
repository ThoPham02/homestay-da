package model

// Room đại diện cho bảng room
type Room struct {
	ID          int     `db:"id" json:"id"`
	HomestayID  int     `db:"homestay_id" json:"homestay_id"`
	Name        string  `db:"name" json:"name"`
	Description string  `db:"description" json:"description"`
	Price       float64 `db:"price" json:"price"`
	MaxGuests   int     `db:"max_guests" json:"max_guests"`
	IsActive    bool    `db:"is_active" json:"is_active"`
	// Thông tin bổ sung từ join
	HomestayName string `db:"homestay_name" json:"homestay_name,omitempty"`
}

// RoomCreateRequest request tạo room mới
type RoomCreateRequest struct {
	HomestayID  int     `json:"homestay_id" binding:"required"`
	Name        string  `json:"name" binding:"required"`
	Description string  `json:"description"`
	Price       float64 `json:"price" binding:"required,min=0"`
	MaxGuests   int     `json:"max_guests" binding:"required,min=1"`
	IsActive    bool    `json:"is_active"`
}

// RoomUpdateRequest request cập nhật room
type RoomUpdateRequest struct {
	Name        *string  `json:"name"`
	Description *string  `json:"description"`
	Price       *float64 `json:"price" binding:"omitempty,min=0"`
	MaxGuests   *int     `json:"max_guests" binding:"omitempty,min=1"`
	IsActive    *bool    `json:"is_active"`
}

// RoomSearchRequest request tìm kiếm room
type RoomSearchRequest struct {
	HomestayID *int     `json:"homestay_id"`
	Name       *string  `json:"name"`
	MinPrice   *float64 `json:"min_price"`
	MaxPrice   *float64 `json:"max_price"`
	MaxGuests  *int     `json:"max_guests"`
	IsActive   *bool    `json:"is_active"`
	Page       int      `json:"page" binding:"min=1"`
	PageSize   int      `json:"page_size" binding:"min=1,max=100"`
}
