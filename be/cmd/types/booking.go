package types

type Booking struct {
	ID            int     `json:"id"`
	BookingCode   string  `json:"bookingCode"`
	CustomerID    int     `json:"customerId"`
	CustomerName  string  `json:"customerName"`
	CustomerPhone string  `json:"customerPhone"`
	CustomerEmail string  `json:"customerEmail"`
	HomestayID    int     `json:"homestayId"`
	HomestayName  string  `json:"homestayName"`
	RoomID        int     `json:"roomId"`
	RoomName      string  `json:"roomName"`
	RoomType      string  `json:"roomType"`
	CheckIn       string  `json:"checkIn"`
	CheckOut      string  `json:"checkOut"`
	Nights        int     `json:"nights"`
	TotalAmount   float64 `json:"totalAmount"`
	PaidAmount    float64 `json:"paidAmount"`
	Status        string  `json:"status"`
	BookingDate   string  `json:"bookingDate"`
	PaymentMethod string  `json:"paymentMethod"`
}

type CreateBookingReq struct {
	CustomerName  string `json:"customerName"`
	CustomerPhone string `json:"customerPhone"`
	CustomerEmail string `json:"customerEmail"`
	HomestayID    int    `json:"homestayId"`
	RoomID        int    `json:"roomId"`
	CheckIn       string `json:"checkIn"`
	CheckOut      string `json:"checkOut"`
	Guests        int    `json:"guests"`
	PaymentMethod string `json:"paymentMethod"`
	Notes         string `json:"notes,omitempty"`
}

type CreateBookingResp struct {
	Booking Booking `json:"booking"`
}

type FilterBookingReq struct {
	HomestayID   *int    `json:"homestayId,omitempty"`
	RoomID       *int    `json:"roomId,omitempty"`
	Status       *string `json:"status,omitempty"`
	CustomerName *string `json:"customerName,omitempty"`
	DateFrom     *string `json:"dateFrom,omitempty"`
	DateTo       *string `json:"dateTo,omitempty"`
	Page         int     `json:"page"`
	PageSize     int     `json:"pageSize"`
}

type FilterBookingResp struct {
	Bookings []Booking `json:"bookings"`
	Total    int       `json:"total"`
	Page     int       `json:"page"`
	PageSize int       `json:"pageSize"`
}

type BookingDetailResp struct {
	Booking Booking `json:"booking"`
}

type UpdateBookingStatusReq struct {
	Status string `json:"status"`
}

type UpdateBookingStatusResp struct {
	Success bool `json:"success"`
}

type UploadFileReq struct {
}

type UploadFileRes struct {
	Url string `json:"url"`
}
