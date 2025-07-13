package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"home-da/cmd/logic"
	"home-da/cmd/types"
	"home-da/core/http_response"
)

type HomestayHandler struct {
	homestayLogic *logic.HomestayLogic
}

func NewHomestayHandler(homestayLogic *logic.HomestayLogic) *HomestayHandler {
	return &HomestayHandler{
		homestayLogic: homestayLogic,
	}
}

// CreateHomestay - Create a new homestay
// @Summary Create a new homestay
// @Description Create a new homestay for the authenticated host
// @Tags Homestay
// @Accept json
// @Produce json
// @Param homestay body types.CreateHomestayRequest true "Homestay information"
// @Success 200 {object} http_response.Response{data=types.Homestay}
// @Failure 400 {object} http_response.Response
// @Failure 401 {object} http_response.Response
// @Failure 403 {object} http_response.Response
// @Failure 500 {object} http_response.Response
// @Router /api/host/homestays [post]
// @Security BearerAuth
func (h *HomestayHandler) CreateHomestay(c *gin.Context) {
	var req types.CreateHomestayRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		http_response.Error(c, http_response.BadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		http_response.Error(c, http_response.Unauthorized, "Không tìm thấy thông tin người dùng")
		return
	}

	hostID := userID.(int)

	// Create homestay
	homestay, err := h.homestayLogic.CreateHomestay(&req, hostID)
	if err != nil {
		http_response.Error(c, http_response.GetErrorCode(err), http_response.GetErrorMessage(err))
		return
	}

	http_response.Success(c, "Tạo homestay thành công", homestay)
}

// GetHomestayByID - Get homestay by ID
// @Summary Get homestay by ID
// @Description Get detailed information of a homestay by ID
// @Tags Homestay
// @Accept json
// @Produce json
// @Param id path int true "Homestay ID"
// @Success 200 {object} http_response.Response{data=types.HomestayDetailResponse}
// @Failure 400 {object} http_response.Response
// @Failure 401 {object} http_response.Response
// @Failure 403 {object} http_response.Response
// @Failure 404 {object} http_response.Response
// @Failure 500 {object} http_response.Response
// @Router /api/host/homestays/{id} [get]
// @Security BearerAuth
func (h *HomestayHandler) GetHomestayByID(c *gin.Context) {
	// Get homestay ID from URL
	homestayIDStr := c.Param("id")
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

	// Get homestay
	homestayDetail, err := h.homestayLogic.GetHomestayByID(homestayID, hostID)
	if err != nil {
		http_response.Error(c, http_response.GetErrorCode(err), http_response.GetErrorMessage(err))
		return
	}

	http_response.Success(c, "Lấy thông tin homestay thành công", homestayDetail)
}

// GetHomestayList - Get list of homestays
// @Summary Get list of homestays
// @Description Get paginated list of homestays for the authenticated host
// @Tags Homestay
// @Accept json
// @Produce json
// @Param page query int false "Page number (default: 1)"
// @Param page_size query int false "Page size (default: 10, max: 100)"
// @Param status query string false "Filter by status (active, inactive, pending)"
// @Param city query string false "Filter by city"
// @Param district query string false "Filter by district"
// @Success 200 {object} http_response.Response{data=types.HomestayListResponse}
// @Failure 400 {object} http_response.Response
// @Failure 401 {object} http_response.Response
// @Failure 500 {object} http_response.Response
// @Router /api/host/homestays [get]
// @Security BearerAuth
func (h *HomestayHandler) GetHomestayList(c *gin.Context) {
	var req types.HomestayListRequest
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

	// Get homestay list
	homestayList, err := h.homestayLogic.GetHomestayList(&req, hostID)
	if err != nil {
		http_response.Error(c, http_response.GetErrorCode(err), http_response.GetErrorMessage(err))
		return
	}

	http_response.Success(c, "Lấy danh sách homestay thành công", homestayList)
}

// UpdateHomestay - Update homestay
// @Summary Update homestay
// @Description Update homestay information
// @Tags Homestay
// @Accept json
// @Produce json
// @Param id path int true "Homestay ID"
// @Param homestay body types.UpdateHomestayRequest true "Updated homestay information"
// @Success 200 {object} http_response.Response{data=types.Homestay}
// @Failure 400 {object} http_response.Response
// @Failure 401 {object} http_response.Response
// @Failure 403 {object} http_response.Response
// @Failure 404 {object} http_response.Response
// @Failure 500 {object} http_response.Response
// @Router /api/host/homestays/{id} [put]
// @Security BearerAuth
func (h *HomestayHandler) UpdateHomestay(c *gin.Context) {
	// Get homestay ID from URL
	homestayIDStr := c.Param("id")
	homestayID, err := strconv.Atoi(homestayIDStr)
	if err != nil {
		http_response.Error(c, http_response.BadRequest, "ID homestay không hợp lệ")
		return
	}

	var req types.UpdateHomestayRequest
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

	// Update homestay
	homestay, err := h.homestayLogic.UpdateHomestay(homestayID, &req, hostID)
	if err != nil {
		http_response.Error(c, http_response.GetErrorCode(err), http_response.GetErrorMessage(err))
		return
	}

	http_response.Success(c, "Cập nhật homestay thành công", homestay)
}

// DeleteHomestay - Delete homestay
// @Summary Delete homestay
// @Description Delete a homestay (only if no active bookings)
// @Tags Homestay
// @Accept json
// @Produce json
// @Param id path int true "Homestay ID"
// @Success 200 {object} http_response.Response
// @Failure 400 {object} http_response.Response
// @Failure 401 {object} http_response.Response
// @Failure 403 {object} http_response.Response
// @Failure 404 {object} http_response.Response
// @Failure 500 {object} http_response.Response
// @Router /api/host/homestays/{id} [delete]
// @Security BearerAuth
func (h *HomestayHandler) DeleteHomestay(c *gin.Context) {
	// Get homestay ID from URL
	homestayIDStr := c.Param("id")
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

	// Delete homestay
	err = h.homestayLogic.DeleteHomestay(homestayID, hostID)
	if err != nil {
		http_response.Error(c, http_response.GetErrorCode(err), http_response.GetErrorMessage(err))
		return
	}

	http_response.Success(c, "Xóa homestay thành công", nil)
}

// GetHomestayStats - Get homestay statistics
// @Summary Get homestay statistics
// @Description Get statistics for all homestays of the authenticated host
// @Tags Homestay
// @Accept json
// @Produce json
// @Success 200 {object} http_response.Response{data=types.HomestayStatsResponse}
// @Failure 400 {object} http_response.Response
// @Failure 401 {object} http_response.Response
// @Failure 500 {object} http_response.Response
// @Router /api/host/homestays/stats [get]
// @Security BearerAuth
func (h *HomestayHandler) GetHomestayStats(c *gin.Context) {
	// Get user ID from context
	userID, exists := c.Get("user_id")
	if !exists {
		http_response.Error(c, http_response.Unauthorized, "Không tìm thấy thông tin người dùng")
		return
	}

	hostID := userID.(int)

	// Get statistics
	stats, err := h.homestayLogic.GetHomestayStats(hostID)
	if err != nil {
		http_response.Error(c, http_response.GetErrorCode(err), http_response.GetErrorMessage(err))
		return
	}

	http_response.Success(c, "Lấy thống kê homestay thành công", stats)
}

// GetHomestayStatsByID - Get homestay statistics by ID
// @Summary Get homestay statistics by ID
// @Description Get statistics for a specific homestay
// @Tags Homestay
// @Accept json
// @Produce json
// @Param id path int true "Homestay ID"
// @Success 200 {object} http_response.Response{data=types.HomestayStatsResponse}
// @Failure 400 {object} http_response.Response
// @Failure 401 {object} http_response.Response
// @Failure 403 {object} http_response.Response
// @Failure 404 {object} http_response.Response
// @Failure 500 {object} http_response.Response
// @Router /api/host/homestays/{id}/stats [get]
// @Security BearerAuth
func (h *HomestayHandler) GetHomestayStatsByID(c *gin.Context) {
	// Get homestay ID from URL
	homestayIDStr := c.Param("id")
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
	stats, err := h.homestayLogic.GetHomestayStatsByID(homestayID, hostID)
	if err != nil {
		http_response.Error(c, http_response.GetErrorCode(err), http_response.GetErrorMessage(err))
		return
	}

	http_response.Success(c, "Lấy thống kê homestay thành công", stats)
} 