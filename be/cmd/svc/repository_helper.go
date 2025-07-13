package svc

import (
	"context"
	"homestay-be/cmd/database/model"
)

// RepositoryHelper cung cấp các phương thức tiện ích cho việc sử dụng repositories
type RepositoryHelper struct {
	svc *ServiceContext
}

// NewRepositoryHelper tạo instance mới của RepositoryHelper
func NewRepositoryHelper(svc *ServiceContext) *RepositoryHelper {
	return &RepositoryHelper{svc: svc}
}

// User helpers
func (h *RepositoryHelper) CreateUser(ctx context.Context, req *model.UserCreateRequest) (*model.User, error) {
	return h.svc.UserRepo.Create(ctx, req)
}

func (h *RepositoryHelper) GetUserByID(ctx context.Context, id int) (*model.User, error) {
	return h.svc.UserRepo.GetByID(ctx, id)
}

func (h *RepositoryHelper) GetUserByEmail(ctx context.Context, email string) (*model.User, error) {
	return h.svc.UserRepo.GetByEmail(ctx, email)
}

func (h *RepositoryHelper) UpdateUser(ctx context.Context, id int, req *model.UserUpdateRequest) (*model.User, error) {
	return h.svc.UserRepo.Update(ctx, id, req)
}

func (h *RepositoryHelper) DeleteUser(ctx context.Context, id int) error {
	return h.svc.UserRepo.Delete(ctx, id)
}

func (h *RepositoryHelper) ListUsers(ctx context.Context, page, pageSize int) ([]*model.User, int, error) {
	return h.svc.UserRepo.List(ctx, page, pageSize)
}

func (h *RepositoryHelper) SearchUsers(ctx context.Context, name, email, role string, page, pageSize int) ([]*model.User, int, error) {
	return h.svc.UserRepo.Search(ctx, name, email, role, page, pageSize)
}

// Homestay helpers
func (h *RepositoryHelper) CreateHomestay(ctx context.Context, req *model.HomestayCreateRequest) (*model.Homestay, error) {
	return h.svc.HomestayRepo.Create(ctx, req)
}

func (h *RepositoryHelper) GetHomestayByID(ctx context.Context, id int) (*model.Homestay, error) {
	return h.svc.HomestayRepo.GetByID(ctx, id)
}

func (h *RepositoryHelper) UpdateHomestay(ctx context.Context, id int, req *model.HomestayUpdateRequest) (*model.Homestay, error) {
	return h.svc.HomestayRepo.Update(ctx, id, req)
}

func (h *RepositoryHelper) DeleteHomestay(ctx context.Context, id int) error {
	return h.svc.HomestayRepo.Delete(ctx, id)
}

func (h *RepositoryHelper) ListHomestays(ctx context.Context, page, pageSize int) ([]*model.Homestay, int, error) {
	return h.svc.HomestayRepo.List(ctx, page, pageSize)
}

func (h *RepositoryHelper) SearchHomestays(ctx context.Context, req *model.HomestaySearchRequest) ([]*model.Homestay, int, error) {
	return h.svc.HomestayRepo.Search(ctx, req)
}

func (h *RepositoryHelper) GetHomestaysByOwner(ctx context.Context, ownerID int, page, pageSize int) ([]*model.Homestay, int, error) {
	return h.svc.HomestayRepo.GetByOwnerID(ctx, ownerID, page, pageSize)
}

// Room helpers
func (h *RepositoryHelper) CreateRoom(ctx context.Context, req *model.RoomCreateRequest) (*model.Room, error) {
	return h.svc.RoomRepo.Create(ctx, req)
}

func (h *RepositoryHelper) GetRoomByID(ctx context.Context, id int) (*model.Room, error) {
	return h.svc.RoomRepo.GetByID(ctx, id)
}

func (h *RepositoryHelper) UpdateRoom(ctx context.Context, id int, req *model.RoomUpdateRequest) (*model.Room, error) {
	return h.svc.RoomRepo.Update(ctx, id, req)
}

func (h *RepositoryHelper) DeleteRoom(ctx context.Context, id int) error {
	return h.svc.RoomRepo.Delete(ctx, id)
}

func (h *RepositoryHelper) ListRooms(ctx context.Context, page, pageSize int) ([]*model.Room, int, error) {
	return h.svc.RoomRepo.List(ctx, page, pageSize)
}

func (h *RepositoryHelper) SearchRooms(ctx context.Context, req *model.RoomSearchRequest) ([]*model.Room, int, error) {
	return h.svc.RoomRepo.Search(ctx, req)
}

func (h *RepositoryHelper) GetRoomsByHomestay(ctx context.Context, homestayID int, page, pageSize int) ([]*model.Room, int, error) {
	return h.svc.RoomRepo.GetByHomestayID(ctx, homestayID, page, pageSize)
}

func (h *RepositoryHelper) GetAvailableRooms(ctx context.Context, homestayID int, checkIn, checkOut string, numGuests int) ([]*model.Room, error) {
	return h.svc.RoomRepo.GetAvailableRooms(ctx, homestayID, checkIn, checkOut, numGuests)
}

// Booking Request helpers
func (h *RepositoryHelper) CreateBookingRequest(ctx context.Context, req *model.BookingRequestCreateRequest) (*model.BookingRequest, error) {
	return h.svc.BookingRequestRepo.Create(ctx, req)
}

func (h *RepositoryHelper) GetBookingRequestByID(ctx context.Context, id int) (*model.BookingRequest, error) {
	return h.svc.BookingRequestRepo.GetByID(ctx, id)
}

func (h *RepositoryHelper) UpdateBookingRequest(ctx context.Context, id int, req *model.BookingRequestUpdateRequest) (*model.BookingRequest, error) {
	return h.svc.BookingRequestRepo.Update(ctx, id, req)
}

func (h *RepositoryHelper) DeleteBookingRequest(ctx context.Context, id int) error {
	return h.svc.BookingRequestRepo.Delete(ctx, id)
}

func (h *RepositoryHelper) ListBookingRequests(ctx context.Context, page, pageSize int) ([]*model.BookingRequest, int, error) {
	return h.svc.BookingRequestRepo.List(ctx, page, pageSize)
}

func (h *RepositoryHelper) SearchBookingRequests(ctx context.Context, req *model.BookingRequestSearchRequest) ([]*model.BookingRequest, int, error) {
	return h.svc.BookingRequestRepo.Search(ctx, req)
}

func (h *RepositoryHelper) GetBookingRequestsByUser(ctx context.Context, userID int, page, pageSize int) ([]*model.BookingRequest, int, error) {
	return h.svc.BookingRequestRepo.GetByUserID(ctx, userID, page, pageSize)
}

func (h *RepositoryHelper) GetBookingRequestsByRoom(ctx context.Context, roomID int, page, pageSize int) ([]*model.BookingRequest, int, error) {
	return h.svc.BookingRequestRepo.GetByRoomID(ctx, roomID, page, pageSize)
}

func (h *RepositoryHelper) GetBookingRequestsByStatus(ctx context.Context, status string, page, pageSize int) ([]*model.BookingRequest, int, error) {
	return h.svc.BookingRequestRepo.GetByStatus(ctx, status, page, pageSize)
}

// Booking helpers
func (h *RepositoryHelper) CreateBooking(ctx context.Context, req *model.BookingCreateRequest) (*model.Booking, error) {
	return h.svc.BookingRepo.Create(ctx, req)
}

func (h *RepositoryHelper) GetBookingByID(ctx context.Context, id int) (*model.Booking, error) {
	return h.svc.BookingRepo.GetByID(ctx, id)
}

func (h *RepositoryHelper) UpdateBooking(ctx context.Context, id int, req *model.BookingUpdateRequest) (*model.Booking, error) {
	return h.svc.BookingRepo.Update(ctx, id, req)
}

func (h *RepositoryHelper) DeleteBooking(ctx context.Context, id int) error {
	return h.svc.BookingRepo.Delete(ctx, id)
}

func (h *RepositoryHelper) ListBookings(ctx context.Context, page, pageSize int) ([]*model.Booking, int, error) {
	return h.svc.BookingRepo.List(ctx, page, pageSize)
}

func (h *RepositoryHelper) SearchBookings(ctx context.Context, req *model.BookingSearchRequest) ([]*model.Booking, int, error) {
	return h.svc.BookingRepo.Search(ctx, req)
}

func (h *RepositoryHelper) GetBookingsByUser(ctx context.Context, userID int, page, pageSize int) ([]*model.Booking, int, error) {
	return h.svc.BookingRepo.GetByUserID(ctx, userID, page, pageSize)
}

func (h *RepositoryHelper) GetBookingsByRoom(ctx context.Context, roomID int, page, pageSize int) ([]*model.Booking, int, error) {
	return h.svc.BookingRepo.GetByRoomID(ctx, roomID, page, pageSize)
}

func (h *RepositoryHelper) GetBookingsByStatus(ctx context.Context, status string, page, pageSize int) ([]*model.Booking, int, error) {
	return h.svc.BookingRepo.GetByStatus(ctx, status, page, pageSize)
}

func (h *RepositoryHelper) GetBookingByRequestID(ctx context.Context, bookingRequestID int) (*model.Booking, error) {
	return h.svc.BookingRepo.GetByBookingRequestID(ctx, bookingRequestID)
}

// Payment helpers
func (h *RepositoryHelper) CreatePayment(ctx context.Context, req *model.PaymentCreateRequest) (*model.Payment, error) {
	return h.svc.PaymentRepo.Create(ctx, req)
}

func (h *RepositoryHelper) GetPaymentByID(ctx context.Context, id int) (*model.Payment, error) {
	return h.svc.PaymentRepo.GetByID(ctx, id)
}

func (h *RepositoryHelper) UpdatePayment(ctx context.Context, id int, req *model.PaymentUpdateRequest) (*model.Payment, error) {
	return h.svc.PaymentRepo.Update(ctx, id, req)
}

func (h *RepositoryHelper) DeletePayment(ctx context.Context, id int) error {
	return h.svc.PaymentRepo.Delete(ctx, id)
}

func (h *RepositoryHelper) ListPayments(ctx context.Context, page, pageSize int) ([]*model.Payment, int, error) {
	return h.svc.PaymentRepo.List(ctx, page, pageSize)
}

func (h *RepositoryHelper) SearchPayments(ctx context.Context, req *model.PaymentSearchRequest) ([]*model.Payment, int, error) {
	return h.svc.PaymentRepo.Search(ctx, req)
}

func (h *RepositoryHelper) GetPaymentsByBooking(ctx context.Context, bookingID int, page, pageSize int) ([]*model.Payment, int, error) {
	return h.svc.PaymentRepo.GetByBookingID(ctx, bookingID, page, pageSize)
}

func (h *RepositoryHelper) GetPaymentsByStatus(ctx context.Context, status string, page, pageSize int) ([]*model.Payment, int, error) {
	return h.svc.PaymentRepo.GetByStatus(ctx, status, page, pageSize)
}

func (h *RepositoryHelper) GetPaymentByTransactionID(ctx context.Context, transactionID string) (*model.Payment, error) {
	return h.svc.PaymentRepo.GetByTransactionID(ctx, transactionID)
}

// Review helpers
func (h *RepositoryHelper) CreateReview(ctx context.Context, req *model.ReviewCreateRequest) (*model.Review, error) {
	return h.svc.ReviewRepo.Create(ctx, req)
}

func (h *RepositoryHelper) GetReviewByID(ctx context.Context, id int) (*model.Review, error) {
	return h.svc.ReviewRepo.GetByID(ctx, id)
}

func (h *RepositoryHelper) UpdateReview(ctx context.Context, id int, req *model.ReviewUpdateRequest) (*model.Review, error) {
	return h.svc.ReviewRepo.Update(ctx, id, req)
}

func (h *RepositoryHelper) DeleteReview(ctx context.Context, id int) error {
	return h.svc.ReviewRepo.Delete(ctx, id)
}

func (h *RepositoryHelper) ListReviews(ctx context.Context, page, pageSize int) ([]*model.Review, int, error) {
	return h.svc.ReviewRepo.List(ctx, page, pageSize)
}

func (h *RepositoryHelper) SearchReviews(ctx context.Context, req *model.ReviewSearchRequest) ([]*model.Review, int, error) {
	return h.svc.ReviewRepo.Search(ctx, req)
}

func (h *RepositoryHelper) GetReviewsByUser(ctx context.Context, userID int, page, pageSize int) ([]*model.Review, int, error) {
	return h.svc.ReviewRepo.GetByUserID(ctx, userID, page, pageSize)
}

func (h *RepositoryHelper) GetReviewsByHomestay(ctx context.Context, homestayID int, page, pageSize int) ([]*model.Review, int, error) {
	return h.svc.ReviewRepo.GetByHomestayID(ctx, homestayID, page, pageSize)
}

func (h *RepositoryHelper) GetReviewsByRating(ctx context.Context, rating int, page, pageSize int) ([]*model.Review, int, error) {
	return h.svc.ReviewRepo.GetByRating(ctx, rating, page, pageSize)
}

func (h *RepositoryHelper) GetAverageRating(ctx context.Context, homestayID int) (float64, error) {
	return h.svc.ReviewRepo.GetAverageRating(ctx, homestayID)
}

// Room Availability helpers
func (h *RepositoryHelper) CreateRoomAvailability(ctx context.Context, req *model.RoomAvailabilityCreateRequest) (*model.RoomAvailability, error) {
	return h.svc.RoomAvailabilityRepo.Create(ctx, req)
}

func (h *RepositoryHelper) GetRoomAvailabilityByID(ctx context.Context, id int) (*model.RoomAvailability, error) {
	return h.svc.RoomAvailabilityRepo.GetByID(ctx, id)
}

func (h *RepositoryHelper) UpdateRoomAvailability(ctx context.Context, id int, req *model.RoomAvailabilityUpdateRequest) (*model.RoomAvailability, error) {
	return h.svc.RoomAvailabilityRepo.Update(ctx, id, req)
}

func (h *RepositoryHelper) DeleteRoomAvailability(ctx context.Context, id int) error {
	return h.svc.RoomAvailabilityRepo.Delete(ctx, id)
}

func (h *RepositoryHelper) ListRoomAvailabilities(ctx context.Context, page, pageSize int) ([]*model.RoomAvailability, int, error) {
	return h.svc.RoomAvailabilityRepo.List(ctx, page, pageSize)
}

func (h *RepositoryHelper) SearchRoomAvailabilities(ctx context.Context, req *model.RoomAvailabilitySearchRequest) ([]*model.RoomAvailability, int, error) {
	return h.svc.RoomAvailabilityRepo.Search(ctx, req)
}

func (h *RepositoryHelper) GetRoomAvailabilitiesByRoom(ctx context.Context, roomID int, page, pageSize int) ([]*model.RoomAvailability, int, error) {
	return h.svc.RoomAvailabilityRepo.GetByRoomID(ctx, roomID, page, pageSize)
}

func (h *RepositoryHelper) GetRoomAvailabilitiesByDateRange(ctx context.Context, roomID int, startDate, endDate string) ([]*model.RoomAvailability, error) {
	return h.svc.RoomAvailabilityRepo.GetByDateRange(ctx, roomID, startDate, endDate)
}

func (h *RepositoryHelper) CreateRoomAvailabilityBatch(ctx context.Context, req *model.RoomAvailabilityBatchRequest) error {
	return h.svc.RoomAvailabilityRepo.CreateBatch(ctx, req)
}

func (h *RepositoryHelper) CheckRoomAvailability(ctx context.Context, roomID int, checkIn, checkOut string) (bool, error) {
	return h.svc.RoomAvailabilityRepo.CheckAvailability(ctx, roomID, checkIn, checkOut)
} 