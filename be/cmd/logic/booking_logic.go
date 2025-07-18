package logic

import (
	"context"
	"homestay-be/cmd/database/model"
	"homestay-be/cmd/svc"
	"homestay-be/cmd/types"
	"time"

	"github.com/zeromicro/go-zero/core/logx"
)

type BookingLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewBookingLogic(ctx context.Context, svcCtx *svc.ServiceContext) *BookingLogic {
	return &BookingLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

// FilterBookings - Logic to filter bookings based on criteria
func (l *BookingLogic) FilterBookings(ctx context.Context, req *types.FilterBookingReq) (*types.FilterBookingResp, error) {
	// 1. Mapping filter sang model.BookingSearchRequest
	searchReq := &model.BookingSearchRequest{
		Status:   req.Status,
		Page:     req.Page,
		PageSize: req.PageSize,
	}
	// Nếu có filter ngày
	if req.DateFrom != nil {
		t, _ := time.Parse("2006-01-02", *req.DateFrom)
		searchReq.StartDate = &t
	}
	if req.DateTo != nil {
		t, _ := time.Parse("2006-01-02", *req.DateTo)
		searchReq.EndDate = &t
	}
	// Nếu có filter customerName thì cần xử lý riêng (ví dụ filter sau khi lấy ra)

	// 2. Lấy danh sách booking
	bookings, total, err := l.svcCtx.BookingRepo.Search(ctx, searchReq)
	if err != nil {
		logx.Error(err)
		return nil, err
	}

	var respBookings []types.Booking
	for _, booking := range bookings {
		// 3. Lấy danh sách phòng cho mỗi booking
		rooms, err := l.svcCtx.BookingRepo.GetRoomsByBookingID(ctx, booking.ID)
		if err != nil {
			logx.Error(err)
			return nil, err
		}
		var respRooms []types.BookingRoom
		for _, r := range rooms {
			respRooms = append(respRooms, types.BookingRoom{
				RoomID:    r.RoomID,
				RoomName:  "", // Có thể join thêm nếu cần
				RoomType:  "",
				Capacity:  r.Capacity,
				Price:     r.Price,
				PriceType: r.PriceType,
			})
		}
		respBookings = append(respBookings, types.Booking{
			ID:            booking.ID,
			CustomerName:  booking.Name,
			CustomerPhone: booking.Phone,
			CustomerEmail: booking.Email,
			CheckIn:       booking.CheckIn.Format("2006-01-02"),
			CheckOut:      booking.CheckOut.Format("2006-01-02"),
			TotalAmount:   booking.TotalAmount,
			Status:        booking.Status,
			Rooms:         respRooms,
		})
	}

	return &types.FilterBookingResp{
		Bookings: respBookings,
		Total:    total,
		Page:     req.Page,
		PageSize: req.PageSize,
	}, nil
}

// CreateBooking - Logic to create a new booking
func (l *BookingLogic) CreateBooking(ctx context.Context, req *types.CreateBookingReq) (*types.CreateBookingResp, error) {
	// 1. Tạo booking (bảng booking)
	bookingModel := &model.BookingCreateRequest{
		Name:      req.CustomerName,
		Email:     req.CustomerEmail,
		Phone:     req.CustomerPhone,
		CheckIn:   parseDate(req.CheckIn),
		CheckOut:  parseDate(req.CheckOut),
		NumGuests: req.Guests,
		Rooms:     nil, // sẽ insert sau
	}
	booking, err := l.svcCtx.BookingRepo.Create(ctx, bookingModel)
	if err != nil {
		logx.Error(err)
		return nil, err
	}

	// 2. Tạo các bản ghi booking_room
	for _, room := range req.Rooms {
		roomModel := &model.BookingRoom{
			BookingID: booking.ID,
			RoomID:    room.RoomID,
			Capacity:  room.Capacity,
			Price:     room.Price,
			PriceType: room.PriceType,
			CreatedAt: time.Now(),
		}
		// Giả sử có hàm InsertBookingRoom trong repo
		_, err := l.svcCtx.BookingRepo.InsertBookingRoom(ctx, roomModel)
		if err != nil {
			logx.Error(err)
			return nil, err
		}
	}

	// 3. Lấy lại danh sách phòng vừa insert
	rooms, err := l.svcCtx.BookingRepo.GetRoomsByBookingID(ctx, booking.ID)
	if err != nil {
		logx.Error(err)
		return nil, err
	}

	// 4. Mapping sang types.BookingRoom
	var respRooms []types.BookingRoom
	for _, r := range rooms {
		respRooms = append(respRooms, types.BookingRoom{
			RoomID:    r.RoomID,
			RoomName:  "", // Có thể join thêm nếu cần
			RoomType:  "",
			Capacity:  r.Capacity,
			Price:     r.Price,
			PriceType: r.PriceType,
		})
	}

	// 5. Mapping sang types.Booking
	respBooking := types.Booking{
		ID:            booking.ID,
		CustomerName:  booking.Name,
		CustomerPhone: booking.Phone,
		CustomerEmail: booking.Email,
		CheckIn:       booking.CheckIn.Format("2006-01-02"),
		CheckOut:      booking.CheckOut.Format("2006-01-02"),
		TotalAmount:   booking.TotalAmount,
		Status:        booking.Status,
		Rooms:         respRooms,
	}

	return &types.CreateBookingResp{Booking: respBooking}, nil
}

func parseDate(dateStr string) time.Time {
	t, _ := time.Parse("2006-01-02", dateStr)
	return t
}

// Get Detail Booking - Logic to get details of a booking
func (l *BookingLogic) GetBookingDetail(ctx context.Context, bookingID int) (*types.BookingDetailResp, error) {
	// 1. Lấy booking
	booking, err := l.svcCtx.BookingRepo.GetByID(ctx, bookingID)
	if err != nil {
		logx.Error(err)
		return nil, err
	}
	// 2. Lấy danh sách phòng
	rooms, err := l.svcCtx.BookingRepo.GetRoomsByBookingID(ctx, bookingID)
	if err != nil {
		logx.Error(err)
		return nil, err
	}
	var respRooms []types.BookingRoom
	for _, r := range rooms {
		respRooms = append(respRooms, types.BookingRoom{
			RoomID:    r.RoomID,
			RoomName:  "",
			RoomType:  "",
			Capacity:  r.Capacity,
			Price:     r.Price,
			PriceType: r.PriceType,
		})
	}
	// 3. Lấy danh sách payment
	payments, _, err := l.svcCtx.PaymentRepo.GetByBookingID(ctx, bookingID, 1, 100)
	if err != nil {
		logx.Error(err)
		return nil, err
	}
	var respPayments []types.Payment
	for _, p := range payments {
		respPayments = append(respPayments, types.Payment{
			ID:            p.ID,
			Amount:        p.Amount,
			PaymentMethod: p.PaymentMethod,
			PaymentStatus: p.PaymentStatus,
			TransactionID: p.TransactionID,
			PaymentDate:   p.PaymentDate.Format("2006-01-02 15:04:05"),
		})
	}
	// 4. Mapping sang types.Booking
	respBooking := types.Booking{
		ID:            booking.ID,
		CustomerName:  booking.Name,
		CustomerPhone: booking.Phone,
		CustomerEmail: booking.Email,
		CheckIn:       booking.CheckIn.Format("2006-01-02"),
		CheckOut:      booking.CheckOut.Format("2006-01-02"),
		TotalAmount:   booking.TotalAmount,
		Status:        booking.Status,
		Rooms:         respRooms,
	}
	return &types.BookingDetailResp{
		Booking:  respBooking,
		Payments: respPayments,
	}, nil
}

// UpdateBookingStatus - Logic to update the status of a booking
func (l *BookingLogic) UpdateBookingStatus(ctx context.Context, bookingID int, req *types.UpdateBookingStatusReq) (*types.UpdateBookingStatusResp, error) {
	updateReq := &model.BookingUpdateRequest{
		Status: &req.Status,
	}
	_, err := l.svcCtx.BookingRepo.Update(ctx, bookingID, updateReq)
	if err != nil {
		logx.Error(err)
		return &types.UpdateBookingStatusResp{Success: false}, err
	}
	return &types.UpdateBookingStatusResp{Success: true}, nil
}
