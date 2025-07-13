package logic

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"home-da/cmd/types"
	"home-da/core/http_response"
)

type HomestayLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewHomestayLogic(ctx context.Context, svcCtx *svc.ServiceContext) *HomestayLogic {
	return &HomestayLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

// CreateHomestay - Create a new homestay
func (l *HomestayLogic) CreateHomestay(req *types.CreateHomestayRequest, hostID int) (*types.Homestay, error) {
	// Check if host exists
	host, err := l.svcCtx.UserRepo.GetByID(hostID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, http_response.NewError(http_response.NotFound, "Host không tồn tại")
		}
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi kiểm tra host")
	}

	// Check if host has correct role
	if host.Role != "host" && host.Role != "admin" {
		return nil, http_response.NewError(http_response.Forbidden, "Chỉ host mới có thể tạo homestay")
	}

	// Create homestay
	homestay := &types.Homestay{
		Name:        req.Name,
		Description: req.Description,
		Address:     req.Address,
		City:        req.City,
		District:    req.District,
		Ward:        req.Ward,
		Latitude:    req.Latitude,
		Longitude:   req.Longitude,
		HostID:      hostID,
		Status:      "pending", // Default status
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// Save to database
	homestayID, err := l.svcCtx.HomestayRepo.Create(homestay)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi tạo homestay")
	}

	// Get created homestay
	createdHomestay, err := l.svcCtx.HomestayRepo.GetByID(homestayID)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin homestay")
	}

	return createdHomestay, nil
}

// GetHomestayByID - Get homestay by ID
func (l *HomestayLogic) GetHomestayByID(homestayID int, hostID int) (*types.HomestayDetailResponse, error) {
	// Get homestay
	homestay, err := l.svcCtx.HomestayRepo.GetByID(homestayID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, http_response.NewError(http_response.NotFound, "Homestay không tồn tại")
		}
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin homestay")
	}

	// Check if user has permission to view this homestay
	if homestay.HostID != hostID {
		// Check if user is admin
		user, err := l.svcCtx.UserRepo.GetByID(hostID)
		if err != nil || user.Role != "admin" {
			return nil, http_response.NewError(http_response.Forbidden, "Không có quyền truy cập homestay này")
		}
	}

	// Get rooms for this homestay
	rooms, err := l.svcCtx.RoomRepo.GetByHomestayID(homestayID)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy danh sách phòng")
	}

	return &types.HomestayDetailResponse{
		Homestay: *homestay,
		Rooms:    rooms,
	}, nil
}

// GetHomestayList - Get list of homestays for a host
func (l *HomestayLogic) GetHomestayList(req *types.HomestayListRequest, hostID int) (*types.HomestayListResponse, error) {
	// Set default values
	if req.Page <= 0 {
		req.Page = 1
	}
	if req.PageSize <= 0 {
		req.PageSize = 10
	}

	// Get homestays
	homestays, total, err := l.svcCtx.HomestayRepo.GetByHostID(hostID, req.Page, req.PageSize, req.Status, req.City, req.District)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy danh sách homestay")
	}

	// Calculate total pages
	totalPage := (total + req.PageSize - 1) / req.PageSize

	return &types.HomestayListResponse{
		Homestays: homestays,
		Total:     total,
		Page:      req.Page,
		PageSize:  req.PageSize,
		TotalPage: totalPage,
	}, nil
}

// UpdateHomestay - Update homestay
func (l *HomestayLogic) UpdateHomestay(homestayID int, req *types.UpdateHomestayRequest, hostID int) (*types.Homestay, error) {
	// Get homestay
	homestay, err := l.svcCtx.HomestayRepo.GetByID(homestayID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, http_response.NewError(http_response.NotFound, "Homestay không tồn tại")
		}
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin homestay")
	}

	// Check if user has permission to update this homestay
	if homestay.HostID != hostID {
		// Check if user is admin
		user, err := l.svcCtx.UserRepo.GetByID(hostID)
		if err != nil || user.Role != "admin" {
			return nil, http_response.NewError(http_response.Forbidden, "Không có quyền cập nhật homestay này")
		}
	}

	// Update fields
	if req.Name != nil {
		homestay.Name = *req.Name
	}
	if req.Description != nil {
		homestay.Description = *req.Description
	}
	if req.Address != nil {
		homestay.Address = *req.Address
	}
	if req.City != nil {
		homestay.City = *req.City
	}
	if req.District != nil {
		homestay.District = *req.District
	}
	if req.Ward != nil {
		homestay.Ward = *req.Ward
	}
	if req.Latitude != nil {
		homestay.Latitude = *req.Latitude
	}
	if req.Longitude != nil {
		homestay.Longitude = *req.Longitude
	}
	if req.Status != nil {
		homestay.Status = *req.Status
	}

	homestay.UpdatedAt = time.Now()

	// Update in database
	err = l.svcCtx.HomestayRepo.Update(homestay)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi cập nhật homestay")
	}

	return homestay, nil
}

// DeleteHomestay - Delete homestay
func (l *HomestayLogic) DeleteHomestay(homestayID int, hostID int) error {
	// Get homestay
	homestay, err := l.svcCtx.HomestayRepo.GetByID(homestayID)
	if err != nil {
		if err == sql.ErrNoRows {
			return http_response.NewError(http_response.NotFound, "Homestay không tồn tại")
		}
		return http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin homestay")
	}

	// Check if user has permission to delete this homestay
	if homestay.HostID != hostID {
		// Check if user is admin
		user, err := l.svcCtx.UserRepo.GetByID(hostID)
		if err != nil || user.Role != "admin" {
			return http_response.NewError(http_response.Forbidden, "Không có quyền xóa homestay này")
		}
	}

	// Check if homestay has active bookings
	hasActiveBookings, err := l.svcCtx.BookingRepo.HasActiveBookingsByHomestayID(homestayID)
	if err != nil {
		return http_response.NewError(http_response.InternalServerError, "Lỗi khi kiểm tra booking")
	}

	if hasActiveBookings {
		return http_response.NewError(http_response.BadRequest, "Không thể xóa homestay có booking đang hoạt động")
	}

	// Delete homestay (this will also delete related rooms and availabilities due to foreign key constraints)
	err = l.svcCtx.HomestayRepo.Delete(homestayID)
	if err != nil {
		return http_response.NewError(http_response.InternalServerError, "Lỗi khi xóa homestay")
	}

	return nil
}

// GetHomestayStats - Get homestay statistics for a host
func (l *HomestayLogic) GetHomestayStats(hostID int) (*types.HomestayStatsResponse, error) {
	// Get statistics
	stats, err := l.svcCtx.HomestayRepo.GetStatsByHostID(hostID)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thống kê homestay")
	}

	return stats, nil
}

// GetHomestayStatsByID - Get homestay statistics for a specific homestay
func (l *HomestayLogic) GetHomestayStatsByID(homestayID int, hostID int) (*types.HomestayStatsResponse, error) {
	// Check if user has permission
	homestay, err := l.svcCtx.HomestayRepo.GetByID(homestayID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, http_response.NewError(http_response.NotFound, "Homestay không tồn tại")
		}
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin homestay")
	}

	if homestay.HostID != hostID {
		user, err := l.svcCtx.UserRepo.GetByID(hostID)
		if err != nil || user.Role != "admin" {
			return nil, http_response.NewError(http_response.Forbidden, "Không có quyền truy cập thống kê homestay này")
		}
	}

	// Get statistics for specific homestay
	stats, err := l.svcCtx.HomestayRepo.GetStatsByID(homestayID)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thống kê homestay")
	}

	return stats, nil
} 