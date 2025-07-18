package types

type Booking struct {
	ID            int           `json:"id"`
	BookingCode   string        `json:"bookingCode"`
	CustomerName  string        `json:"customerName"`
	CustomerPhone string        `json:"customerPhone"`
	CustomerEmail string        `json:"customerEmail"`
	CheckIn       string        `json:"checkIn"`
	CheckOut      string        `json:"checkOut"`
	Nights        int           `json:"nights"`
	TotalAmount   float64       `json:"totalAmount"`
	PaidAmount    float64       `json:"paidAmount"`
	Status        string        `json:"status"`
	BookingDate   string        `json:"bookingDate"`
	PaymentMethod string        `json:"paymentMethod"`
	Rooms         []BookingRoom `json:"rooms"`
}

type BookingRoom struct {
	RoomID    int     `json:"roomId"`
	RoomName  string  `json:"roomName"`
	RoomType  string  `json:"roomType"`
	Capacity  int     `json:"capacity"`
	Price     float64 `json:"price"`
	PriceType string  `json:"priceType"`
}

type CreateBookingReq struct {
	CustomerName  string           `json:"customerName"`
	CustomerPhone string           `json:"customerPhone"`
	CustomerEmail string           `json:"customerEmail"`
	CheckIn       string           `json:"checkIn"`
	CheckOut      string           `json:"checkOut"`
	Guests        int              `json:"guests"`
	PaymentMethod string           `json:"paymentMethod"`
	Notes         string           `json:"notes,omitempty"`
	Rooms         []BookingRoomReq `json:"rooms"`
}

type BookingRoomReq struct {
	RoomID    int     `json:"roomId"`
	Capacity  int     `json:"capacity"`
	Price     float64 `json:"price"`
	PriceType string  `json:"priceType"`
}

type CreateBookingResp struct {
	Booking Booking `json:"booking"`
}

type FilterBookingReq struct {
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

type Payment struct {
	ID            int     `json:"id"`
	Amount        float64 `json:"amount"`
	PaymentMethod string  `json:"paymentMethod"`
	PaymentStatus string  `json:"paymentStatus"`
	TransactionID string  `json:"transactionId"`
	PaymentDate   string  `json:"paymentDate"`
}

type BookingDetailResp struct {
	Booking  Booking   `json:"booking"`
	Payments []Payment `json:"payments"`
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
