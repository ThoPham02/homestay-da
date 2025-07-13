package types

import "time"

// Room types
type Room struct {
	ID          int       `json:"id" db:"id"`
	HomestayID  int       `json:"homestay_id" db:"homestay_id"`
	Name        string    `json:"name" db:"name"`
	Description string    `json:"description" db:"description"`
	Type        string    `json:"type" db:"type"` // single, double, family, dormitory
	Capacity    int       `json:"capacity" db:"capacity"`
	Price       float64   `json:"price" db:"price"`
	PriceType   string    `json:"price_type" db:"price_type"` // per_night, per_person
	Status      string    `json:"status" db:"status"` // available, occupied, maintenance
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

// CreateRoomRequest - Request to create a new room
type CreateRoomRequest struct {
	HomestayID  int     `json:"homestay_id" validate:"required"`
	Name        string  `json:"name" validate:"required,min=2,max=100"`
	Description string  `json:"description" validate:"required,min=10,max=500"`
	Type        string  `json:"type" validate:"required,oneof=single double family dormitory"`
	Capacity    int     `json:"capacity" validate:"required,min=1,max=20"`
	Price       float64 `json:"price" validate:"required,min=0"`
	PriceType   string  `json:"price_type" validate:"required,oneof=per_night per_person"`
}

// UpdateRoomRequest - Request to update a room
type UpdateRoomRequest struct {
	Name        *string  `json:"name,omitempty" validate:"omitempty,min=2,max=100"`
	Description *string  `json:"description,omitempty" validate:"omitempty,min=10,max=500"`
	Type        *string  `json:"type,omitempty" validate:"omitempty,oneof=single double family dormitory"`
	Capacity    *int     `json:"capacity,omitempty" validate:"omitempty,min=1,max=20"`
	Price       *float64 `json:"price,omitempty" validate:"omitempty,min=0"`
	PriceType   *string  `json:"price_type,omitempty" validate:"omitempty,oneof=per_night per_person"`
	Status      *string  `json:"status,omitempty" validate:"omitempty,oneof=available occupied maintenance"`
}

// RoomListRequest - Request to get list of rooms
type RoomListRequest struct {
	HomestayID int    `json:"homestay_id" form:"homestay_id" validate:"required"`
	Page       int    `json:"page" form:"page" validate:"min=1"`
	PageSize   int    `json:"page_size" form:"page_size" validate:"min=1,max=100"`
	Status     string `json:"status" form:"status" validate:"omitempty,oneof=available occupied maintenance"`
	Type       string `json:"type" form:"type" validate:"omitempty,oneof=single double family dormitory"`
	MinPrice   *float64 `json:"min_price" form:"min_price" validate:"omitempty,min=0"`
	MaxPrice   *float64 `json:"max_price" form:"max_price" validate:"omitempty,min=0"`
}

// RoomListResponse - Response for room list
type RoomListResponse struct {
	Rooms     []Room `json:"rooms"`
	Total     int    `json:"total"`
	Page      int    `json:"page"`
	PageSize  int    `json:"page_size"`
	TotalPage int    `json:"total_page"`
}

// RoomDetailResponse - Response for room detail
type RoomDetailResponse struct {
	Room           Room                `json:"room"`
	Homestay       Homestay            `json:"homestay"`
	Availabilities []RoomAvailability  `json:"availabilities,omitempty"`
}

// RoomAvailability types
type RoomAvailability struct {
	ID        int       `json:"id" db:"id"`
	RoomID    int       `json:"room_id" db:"room_id"`
	Date      time.Time `json:"date" db:"date"`
	Status    string    `json:"status" db:"status"` // available, booked, blocked
	Price     *float64  `json:"price" db:"price"`   // Override price for specific date
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// CreateAvailabilityRequest - Request to create room availability
type CreateAvailabilityRequest struct {
	RoomID int       `json:"room_id" validate:"required"`
	Date   time.Time `json:"date" validate:"required"`
	Status string    `json:"status" validate:"required,oneof=available booked blocked"`
	Price  *float64  `json:"price,omitempty" validate:"omitempty,min=0"`
}

// UpdateAvailabilityRequest - Request to update room availability
type UpdateAvailabilityRequest struct {
	Status *string  `json:"status,omitempty" validate:"omitempty,oneof=available booked blocked"`
	Price  *float64 `json:"price,omitempty" validate:"omitempty,min=0"`
}

// BulkAvailabilityRequest - Request to update multiple availabilities
type BulkAvailabilityRequest struct {
	RoomID       int       `json:"room_id" validate:"required"`
	StartDate    time.Time `json:"start_date" validate:"required"`
	EndDate      time.Time `json:"end_date" validate:"required"`
	Status       string    `json:"status" validate:"required,oneof=available booked blocked"`
	Price        *float64  `json:"price,omitempty" validate:"omitempty,min=0"`
	ExcludeDates []time.Time `json:"exclude_dates,omitempty"`
}

// RoomStatsResponse - Response for room statistics
type RoomStatsResponse struct {
	TotalRooms       int     `json:"total_rooms"`
	AvailableRooms   int     `json:"available_rooms"`
	OccupiedRooms    int     `json:"occupied_rooms"`
	MaintenanceRooms int     `json:"maintenance_rooms"`
	AveragePrice     float64 `json:"average_price"`
	TotalRevenue     float64 `json:"total_revenue"`
	OccupancyRate    float64 `json:"occupancy_rate"`
} 