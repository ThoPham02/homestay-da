package handler

import (
	"context"
	"homestay-be/cmd/logic"
	"homestay-be/cmd/types"
	"homestay-be/core/response"
	"strconv"

	"github.com/gin-gonic/gin"
)

type BookingHandler struct {
	bookingLogic *logic.BookingLogic
}

func NewBookingHandler(bookingLogic *logic.BookingLogic) *BookingHandler {
	return &BookingHandler{
		bookingLogic: bookingLogic,
	}
}

// FilterBooking - Filter Bookings
func (h *BookingHandler) FilterBookings(c *gin.Context) {
	ctx := context.Background()

	// Parse query parameters
	var req types.FilterBookingReq
	if err := c.ShouldBindQuery(&req); err != nil {
		response.ResponseError(c, response.BadRequest, response.MsgInvalidData+": "+err.Error())
		return
	}

	// Call the logic layer to filter bookings
	resp, err := h.bookingLogic.FilterBookings(ctx, &req)
	if err != nil {
		response.ResponseError(c, response.BadRequest, err.Error())
		return
	}

	response.ResponseSuccess(c, resp)
}

// CreateBooking - Create a new booking
func (h *BookingHandler) CreateBooking(c *gin.Context) {
	ctx := context.Background()

	// Parse request body
	var req types.CreateBookingReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ResponseError(c, response.BadRequest, response.MsgInvalidData+": "+err.Error())
		return
	}

	// Call the logic layer to create a booking
	resp, err := h.bookingLogic.CreateBooking(ctx, &req)
	if err != nil {
		response.ResponseError(c, response.BadRequest, err.Error())
		return
	}

	c.JSON(201, resp)
}

// CreateGuestBooking - Create a booking for a guest
func (h *BookingHandler) CreateGuestBooking(c *gin.Context) {
	ctx := context.Background()

	// Parse request body
	var req types.CreateBookingReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ResponseError(c, response.BadRequest, response.MsgInvalidData+": "+err.Error())
		return
	}

	// Call the logic layer to create a guest booking
	resp, err := h.bookingLogic.CreateGuestBooking(ctx, &req)
	if err != nil {
		response.ResponseError(c, response.BadRequest, err.Error())
		return
	}

	c.JSON(201, resp)
}

// GetBookingDetail - Get details of a booking
func (h *BookingHandler) GetBookingDetail(c *gin.Context) {
	ctx := context.Background()

	// Get booking ID from URL parameters
	bookingIDStr := c.Param("id")
	bookingID, err := strconv.Atoi(bookingIDStr)
	if err != nil {
		response.ResponseError(c, response.BadRequest, response.MsgInvalidData+": "+err.Error())
		return
	}

	// Call the logic layer to get booking details
	resp, err := h.bookingLogic.GetBookingDetail(ctx, bookingID)
	if err != nil {
		response.ResponseError(c, response.BadRequest, err.Error())
		return
	}

	response.ResponseSuccess(c, resp)
}

// UpdateStatusBooking - Update the status of a booking
func (h *BookingHandler) UpdateStatusBooking(c *gin.Context) {
	ctx := context.Background()

	// Get booking ID from URL parameters
	bookingIDStr := c.Param("id")
	bookingID, err := strconv.Atoi(bookingIDStr)
	if err != nil {
		response.ResponseError(c, response.BadRequest, response.MsgInvalidData+": "+err.Error())
		return
	}

	// Parse request body for status update
	var req types.UpdateBookingStatusReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ResponseError(c, response.BadRequest, response.MsgInvalidData+": "+err.Error())
		return
	}

	// Call the logic layer to update booking status
	resp, err := h.bookingLogic.UpdateBookingStatus(ctx, bookingID, &req)
	if err != nil {
		response.ResponseError(c, response.BadRequest, err.Error())
		return
	}

	response.ResponseSuccess(c, resp)
}

// GetBookingsByHomestayID - Get bookings for a specific homestay
func (h *BookingHandler) GetBookingsByHomestayID(c *gin.Context) {
	ctx := context.Background()

	// Get homestay ID from URL parameters
	homestayIDStr := c.Param("id")
	homestayID, err := strconv.Atoi(homestayIDStr)
	if err != nil {
		response.ResponseError(c, response.BadRequest, response.MsgInvalidData+": "+err.Error())
		return
	}

	// Call the logic layer to get bookings by homestay ID
	resp, err := h.bookingLogic.GetBookingsByHomestayID(ctx, homestayID)
	if err != nil {
		response.ResponseError(c, response.BadRequest, err.Error())
		return
	}

	response.ResponseSuccess(c, resp)
}