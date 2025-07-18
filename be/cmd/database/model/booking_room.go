package model

import "time"

// BookingRoom mapping với bảng booking_room
// Dùng cho booking nhiều phòng

type BookingRoom struct {
	ID        int       `db:"id" json:"id"`
	BookingID int       `db:"booking_id" json:"booking_id"`
	RoomID    int       `db:"room_id" json:"room_id"`
	Capacity  int       `db:"capacity" json:"capacity"`
	Price     float64   `db:"price" json:"price"`
	PriceType string    `db:"price_type" json:"price_type"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}
