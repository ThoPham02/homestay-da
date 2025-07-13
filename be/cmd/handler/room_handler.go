package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"home-da/cmd/logic"
	"home-da/cmd/types"
	"home-da/core/http_response"
)

type RoomHandler struct {
	roomLogic *logic.RoomLogic
}

func NewRoomHandler(roomLogic *logic.RoomLogic) *RoomHandler {
	return &RoomHandler{
		roomLogic: roomLogic,
	}
}

// CreateRoom - Create a new room
// @Summary Create a new room
// @Description Create a new room in a homestay
// @Tags Room
// @Accept json
// @Produce json
// @Param room body types.CreateRoomRequest true "Room information"
// @Success 200 {object} http_response.Response{data=types.Room}
// @Failure 400 {object} http_response.Response
// @Failure 401 {object} http_response.Response
// @Failure 403 {object} http_response.Response
// @Failure 404 {object} http_response.Response
// @Failure 500 {object} http_response.Response
// @Router /api/host/rooms [post]
// @Security BearerAuth
func (h *RoomHandler) CreateRoom(c *gin.Context) {
	var req types.CreateRoomRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		http_response.Error(c, http_response.BadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Get user ID from context
	userID, exists := c.Get("user_id")
	if !exists {
		http_response.Error(c, http_response.Unauthorized, "Không tìm thấy thông tin người dùng")
		return
	}

	hostID := userID.(int)

	// Create room
	room, err := h.roomLogic.CreateRoom(&req, hostID)
	if err != nil {
		http_response.Error(c, http_response.GetErrorCode(err), http_response.GetErrorMessage(err))
		return
	}

	http_response.Success(c, "Tạo phòng thành công", room)
}

// GetRoomByID - Get room by ID
// @Summary Get room by ID
// @Description Get detailed information of a room by ID
// @Tags Room
// @Accept json
// @Produce json
// @Param id path int true "Room ID"
// @Success 200 {object} http_response.Response{data=types.RoomDetailResponse}
// @Failure 400 {object} http_response.Response
// @Failure 401 {object} http_response.Response
// @Failure 403 {object} http_response.Response
// @Failure 404 {object} http_response.Response
// @Failure 500 {object} http_response.Response
// @Router /api/host/rooms/{id} [get]
// @Security BearerAuth
func (h *RoomHandler) GetRoomByID(c *gin.Context) {
	// Get room ID from URL
	roomIDStr := c.Param("id")
	roomID, err := strconv.Atoi(roomIDStr)
	if err != nil {
		http_response.Error(c, http_response.BadRequest, "ID phòng không hợp lệ")
		return
	}

	// Get user ID from context
	userID, exists := c.Get("user_id")
	if !exists {
		http_response.Error(c, http_response.Unauthorized, "Không tìm thấy thông tin người dùng")
		return
	}

	hostID := userID.(int)

	// Get room
	roomDetail, err := h.roomLogic.GetRoomByID(roomID, hostID)
	if err != nil {
		http_response.Error(c, http_response.GetErrorCode(err), http_response.GetErrorMessage(err))
		return
	}

	http_response.Success(c, "Lấy thông tin phòng thành công", roomDetail)
}

// GetRoomList - Get list of rooms
// @Summary Get list of rooms
// @Description Get paginated list of rooms for a homestay
// @Tags Room
// @Accept json
// @Produce json
// @Param homestay_id query int true "Homestay ID"
// @Param page query int false "Page number (default: 1)"
// @Param page_size query int false "Page size (default: 10, max: 100)"
// @Param status query string false "Filter by status (available, occupied, maintenance)"
// @Param type query string false "Filter by type (single, double, family, dormitory)"
// @Param min_price query number false "Minimum price filter"
// @Param max_price query number false "Maximum price filter"
// @Success 200 {object} http_response.Response{data=types.RoomListResponse}
// @Failure 400 {object} http_response.Response
// @Failure 401 {object} http_response.Response
// @Failure 404 {object} http_response.Response
// @Failure 500 {object} http_response.Response
// @Router /api/host/rooms [get]
// @Security BearerAuth
func (h *RoomHandler) GetRoomList(c *gin.Context) {
	var req types.RoomListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		http_response.Error(c, http_response.BadRequest, "Tham số không hợp lệ: "+err.Error())
		return
	}

	// Get user ID from context
	userID, exists := c.Get("user_id")
	if !exists {
		http_response.Error(c, http_response.Unauthorized, "Không tìm thấy thông tin người dùng")
		return
	}

	hostID := userID.(int)

	// Get room list
	roomList, err := h.roomLogic.GetRoomList(&req, hostID)
	if err != nil {
		http_response.Error(c, http_response.GetErrorCode(err), http_response.GetErrorMessage(err))
		return
	}

	http_response.Success(c, "Lấy danh sách phòng thành công", roomList)
}

// UpdateRoom - Update room
// @Summary Update room
// @Description Update room information
// @Tags Room
// @Accept json
// @Produce json
// @Param id path int true "Room ID"
// @Param room body types.UpdateRoomRequest true "Updated room information"
// @Success 200 {object} http_response.Response{data=types.Room}
// @Failure 400 {object} http_response.Response
// @Failure 401 {object} http_response.Response
// @Failure 403 {object} http_response.Response
// @Failure 404 {object} http_response.Response
// @Failure 500 {object} http_response.Response
// @Router /api/host/rooms/{id} [put]
// @Security BearerAuth
func (h *RoomHandler) UpdateRoom(c *gin.Context) {
	// Get room ID from URL
	roomIDStr := c.Param("id")
	roomID, err := strconv.Atoi(roomIDStr)
	if err != nil {
		http_response.Error(c, http_response.BadRequest, "ID phòng không hợp lệ")
		return
	}

	var req types.UpdateRoomRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		http_response.Error(c, http_response.BadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Get user ID from context
	userID, exists := c.Get("user_id")
	if !exists {
		http_response.Error(c, http_response.Unauthorized, "Không tìm thấy thông tin người dùng")
		return
	}

	hostID := userID.(int)

	// Update room
	room, err := h.roomLogic.UpdateRoom(roomID, &req, hostID)
	if err != nil {
		http_response.Error(c, http_response.GetErrorCode(err), http_response.GetErrorMessage(err))
		return
	}

	http_response.Success(c, "Cập nhật phòng thành công", room)
}

// DeleteRoom - Delete room
// @Summary Delete room
// @Description Delete a room (only if no active bookings)
// @Tags Room
// @Accept json
// @Produce json
// @Param id path int true "Room ID"
// @Success 200 {object} http_response.Response
// @Failure 400 {object} http_response.Response
// @Failure 401 {object} http_response.Response
// @Failure 403 {object} http_response.Response
// @Failure 404 {object} http_response.Response
// @Failure 500 {object} http_response.Response
// @Router /api/host/rooms/{id} [delete]
// @Security BearerAuth
func (h *RoomHandler) DeleteRoom(c *gin.Context) {
	// Get room ID from URL
	roomIDStr := c.Param("id")
	roomID, err := strconv.Atoi(roomIDStr)
	if err != nil {
		http_response.Error(c, http_response.BadRequest, "ID phòng không hợp lệ")
		return
	}

	// Get user ID from context
	userID, exists := c.Get("user_id")
	if !exists {
		http_response.Error(c, http_response.Unauthorized, "Không tìm thấy thông tin người dùng")
		return
	}

	hostID := userID.(int)

	// Delete room
	err = h.roomLogic.DeleteRoom(roomID, hostID)
	if err != nil {
		http_response.Error(c, http_response.GetErrorCode(err), http_response.GetErrorMessage(err))
		return
	}

	http_response.Success(c, "Xóa phòng thành công", nil)
}

// CreateAvailability - Create room availability
// @Summary Create room availability
// @Description Create availability for a specific date
// @Tags Room Availability
// @Accept json
// @Produce json
// @Param availability body types.CreateAvailabilityRequest true "Availability information"
// @Success 200 {object} http_response.Response{data=types.RoomAvailability}
// @Failure 400 {object} http_response.Response
// @Failure 401 {object} http_response.Response
// @Failure 403 {object} http_response.Response
// @Failure 404 {object} http_response.Response
// @Failure 500 {object} http_response.Response
// @Router /api/host/rooms/availability [post]
// @Security BearerAuth
func (h *RoomHandler) CreateAvailability(c *gin.Context) {
	var req types.CreateAvailabilityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		http_response.Error(c, http_response.BadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Get user ID from context
	userID, exists := c.Get("user_id")
	if !exists {
		http_response.Error(c, http_response.Unauthorized, "Không tìm thấy thông tin người dùng")
		return
	}

	hostID := userID.(int)

	// Create availability
	availability, err := h.roomLogic.CreateAvailability(&req, hostID)
	if err != nil {
		http_response.Error(c, http_response.GetErrorCode(err), http_response.GetErrorMessage(err))
		return
	}

	http_response.Success(c, "Tạo availability thành công", availability)
}

// UpdateAvailability - Update room availability
// @Summary Update room availability
// @Description Update availability for a specific date
// @Tags Room Availability
// @Accept json
// @Produce json
// @Param id path int true "Availability ID"
// @Param availability body types.UpdateAvailabilityRequest true "Updated availability information"
// @Success 200 {object} http_response.Response{data=types.RoomAvailability}
// @Failure 400 {object} http_response.Response
// @Failure 401 {object} http_response.Response
// @Failure 403 {object} http_response.Response
// @Failure 404 {object} http_response.Response
// @Failure 500 {object} http_response.Response
// @Router /api/host/rooms/availability/{id} [put]
// @Security BearerAuth
func (h *RoomHandler) UpdateAvailability(c *gin.Context) {
	// Get availability ID from URL
	availabilityIDStr := c.Param("id")
	availabilityID, err := strconv.Atoi(availabilityIDStr)
	if err != nil {
		http_response.Error(c, http_response.BadRequest, "ID availability không hợp lệ")
		return
	}

	var req types.UpdateAvailabilityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		http_response.Error(c, http_response.BadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Get user ID from context
	userID, exists := c.Get("user_id")
	if !exists {
		http_response.Error(c, http_response.Unauthorized, "Không tìm thấy thông tin người dùng")
		return
	}

	hostID := userID.(int)

	// Update availability
	availability, err := h.roomLogic.UpdateAvailability(availabilityID, &req, hostID)
	if err != nil {
		http_response.Error(c, http_response.GetErrorCode(err), http_response.GetErrorMessage(err))
		return
	}

	http_response.Success(c, "Cập nhật availability thành công", availability)
}

// BulkUpdateAvailability - Bulk update room availability
// @Summary Bulk update room availability
// @Description Update availability for multiple dates
// @Tags Room Availability
// @Accept json
// @Produce json
// @Param availability body types.BulkAvailabilityRequest true "Bulk availability information"
// @Success 200 {object} http_response.Response
// @Failure 400 {object} http_response.Response
// @Failure 401 {object} http_response.Response
// @Failure 403 {object} http_response.Response
// @Failure 404 {object} http_response.Response
// @Failure 500 {object} http_response.Response
// @Router /api/host/rooms/availability/bulk [post]
// @Security BearerAuth
func (h *RoomHandler) BulkUpdateAvailability(c *gin.Context) {
	var req types.BulkAvailabilityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		http_response.Error(c, http_response.BadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Get user ID from context
	userID, exists := c.Get("user_id")
	if !exists {
		http_response.Error(c, http_response.Unauthorized, "Không tìm thấy thông tin người dùng")
		return
	}

	hostID := userID.(int)

	// Bulk update availability
	err := h.roomLogic.BulkUpdateAvailability(&req, hostID)
	if err != nil {
		http_response.Error(c, http_response.GetErrorCode(err), http_response.GetErrorMessage(err))
		return
	}

	http_response.Success(c, "Cập nhật availability hàng loạt thành công", nil)
}

// GetRoomStats - Get room statistics
// @Summary Get room statistics
// @Description Get statistics for rooms in a homestay
// @Tags Room
// @Accept json
// @Produce json
// @Param homestay_id path int true "Homestay ID"
// @Success 200 {object} http_response.Response{data=types.RoomStatsResponse}
// @Failure 400 {object} http_response.Response
// @Failure 401 {object} http_response.Response
// @Failure 403 {object} http_response.Response
// @Failure 404 {object} http_response.Response
// @Failure 500 {object} http_response.Response
// @Router /api/host/homestays/{homestay_id}/rooms/stats [get]
// @Security BearerAuth
func (h *RoomHandler) GetRoomStats(c *gin.Context) {
	// Get homestay ID from URL
	homestayIDStr := c.Param("homestay_id")
	homestayID, err := strconv.Atoi(homestayIDStr)
	if err != nil {
		http_response.Error(c, http_response.BadRequest, "ID homestay không hợp lệ")
		return
	}

	// Get user ID from context
	userID, exists := c.Get("user_id")
	if !exists {
		http_response.Error(c, http_response.Unauthorized, "Không tìm thấy thông tin người dùng")
		return
	}

	hostID := userID.(int)

	// Get statistics
	stats, err := h.roomLogic.GetRoomStats(homestayID, hostID)
	if err != nil {
		http_response.Error(c, http_response.GetErrorCode(err), http_response.GetErrorMessage(err))
		return
	}

	http_response.Success(c, "Lấy thống kê phòng thành công", stats)
} 