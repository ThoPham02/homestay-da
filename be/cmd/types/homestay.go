package types

import "time"

// Homestay types
type Homestay struct {
	ID          int       `json:"id" db:"id"`
	Name        string    `json:"name" db:"name"`
	Description string    `json:"description" db:"description"`
	Address     string    `json:"address" db:"address"`
	City        string    `json:"city" db:"city"`
	District    string    `json:"district" db:"district"`
	Ward        string    `json:"ward" db:"ward"`
	Latitude    float64   `json:"latitude" db:"latitude"`
	Longitude   float64   `json:"longitude" db:"longitude"`
	HostID      int       `json:"host_id" db:"host_id"`
	Status      string    `json:"status" db:"status"` // active, inactive, pending
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

// CreateHomestayRequest - Request to create a new homestay
type CreateHomestayRequest struct {
	Name        string  `json:"name" validate:"required,min=2,max=100"`
	Description string  `json:"description" validate:"required,min=10,max=1000"`
	Address     string  `json:"address" validate:"required,min=5,max=200"`
	City        string  `json:"city" validate:"required,min=2,max=50"`
	District    string  `json:"district" validate:"required,min=2,max=50"`
	Ward        string  `json:"ward" validate:"required,min=2,max=50"`
	Latitude    float64 `json:"latitude" validate:"required"`
	Longitude   float64 `json:"longitude" validate:"required"`
}

// UpdateHomestayRequest - Request to update a homestay
type UpdateHomestayRequest struct {
	Name        *string  `json:"name,omitempty" validate:"omitempty,min=2,max=100"`
	Description *string  `json:"description,omitempty" validate:"omitempty,min=10,max=1000"`
	Address     *string  `json:"address,omitempty" validate:"omitempty,min=5,max=200"`
	City        *string  `json:"city,omitempty" validate:"omitempty,min=2,max=50"`
	District    *string  `json:"district,omitempty" validate:"omitempty,min=2,max=50"`
	Ward        *string  `json:"ward,omitempty" validate:"omitempty,min=2,max=50"`
	Latitude    *float64 `json:"latitude,omitempty" validate:"omitempty"`
	Longitude   *float64 `json:"longitude,omitempty" validate:"omitempty"`
	Status      *string  `json:"status,omitempty" validate:"omitempty,oneof=active inactive pending"`
}

// HomestayListRequest - Request to get list of homestays
type HomestayListRequest struct {
	Page     int    `json:"page" form:"page" validate:"min=1"`
	PageSize int    `json:"page_size" form:"page_size" validate:"min=1,max=100"`
	Status   string `json:"status" form:"status" validate:"omitempty,oneof=active inactive pending"`
	City     string `json:"city" form:"city" validate:"omitempty"`
	District string `json:"district" form:"district" validate:"omitempty"`
}

// HomestayListResponse - Response for homestay list
type HomestayListResponse struct {
	Homestays []Homestay `json:"homestays"`
	Total     int        `json:"total"`
	Page      int        `json:"page"`
	PageSize  int        `json:"page_size"`
	TotalPage int        `json:"total_page"`
}

// HomestayDetailResponse - Response for homestay detail
type HomestayDetailResponse struct {
	Homestay Homestay `json:"homestay"`
	Rooms    []Room   `json:"rooms,omitempty"`
}

// HomestayStatsResponse - Response for homestay statistics
type HomestayStatsResponse struct {
	TotalHomestays int `json:"total_homestays"`
	ActiveHomestays int `json:"active_homestays"`
	TotalRooms     int `json:"total_rooms"`
	AvailableRooms int `json:"available_rooms"`
	TotalBookings  int `json:"total_bookings"`
	TotalRevenue   float64 `json:"total_revenue"`
} 