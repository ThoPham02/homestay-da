package logic

import (
	"context"
	"database/sql"
	"time"

	"home-da/cmd/types"
	"home-da/core/http_response"
)

type RoomLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewRoomLogic(ctx context.Context, svcCtx *svc.ServiceContext) *RoomLogic {
	return &RoomLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

// CreateRoom - Create a new room
func (l *RoomLogic) CreateRoom(req *types.CreateRoomRequest, hostID int) (*types.Room, error) {
	// Check if homestay exists and belongs to host
	homestay, err := l.svcCtx.HomestayRepo.GetByID(req.HomestayID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, http_response.NewError(http_response.NotFound, "Homestay không tồn tại")
		}
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi kiểm tra homestay")
	}

	// Check if user has permission to add room to this homestay
	if homestay.HostID != hostID {
		// Check if user is admin
		user, err := l.svcCtx.UserRepo.GetByID(hostID)
		if err != nil || user.Role != "admin" {
			return nil, http_response.NewError(http_response.Forbidden, "Không có quyền thêm phòng vào homestay này")
		}
	}

	// Create room
	room := &types.Room{
		HomestayID:  req.HomestayID,
		Name:        req.Name,
		Description: req.Description,
		Type:        req.Type,
		Capacity:    req.Capacity,
		Price:       req.Price,
		PriceType:   req.PriceType,
		Status:      "available", // Default status
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// Save to database
	roomID, err := l.svcCtx.RoomRepo.Create(room)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi tạo phòng")
	}

	// Get created room
	createdRoom, err := l.svcCtx.RoomRepo.GetByID(roomID)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin phòng")
	}

	return createdRoom, nil
}

// GetRoomByID - Get room by ID
func (l *RoomLogic) GetRoomByID(roomID int, hostID int) (*types.RoomDetailResponse, error) {
	// Get room
	room, err := l.svcCtx.RoomRepo.GetByID(roomID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, http_response.NewError(http_response.NotFound, "Phòng không tồn tại")
		}
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin phòng")
	}

	// Check if user has permission to view this room
	homestay, err := l.svcCtx.HomestayRepo.GetByID(room.HomestayID)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin homestay")
	}

	if homestay.HostID != hostID {
		// Check if user is admin
		user, err := l.svcCtx.UserRepo.GetByID(hostID)
		if err != nil || user.Role != "admin" {
			return nil, http_response.NewError(http_response.Forbidden, "Không có quyền truy cập phòng này")
		}
	}

	// Get homestay info
	homestayInfo, err := l.svcCtx.HomestayRepo.GetByID(room.HomestayID)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin homestay")
	}

	// Get availabilities for this room
	availabilities, err := l.svcCtx.RoomAvailabilityRepo.GetByRoomID(roomID)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin availability")
	}

	return &types.RoomDetailResponse{
		Room:           *room,
		Homestay:       *homestayInfo,
		Availabilities: availabilities,
	}, nil
}

// GetRoomList - Get list of rooms for a homestay
func (l *RoomLogic) GetRoomList(req *types.RoomListRequest, hostID int) (*types.RoomListResponse, error) {
	// Check if user has permission to view rooms in this homestay
	homestay, err := l.svcCtx.HomestayRepo.GetByID(req.HomestayID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, http_response.NewError(http_response.NotFound, "Homestay không tồn tại")
		}
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi kiểm tra homestay")
	}

	if homestay.HostID != hostID {
		// Check if user is admin
		user, err := l.svcCtx.UserRepo.GetByID(hostID)
		if err != nil || user.Role != "admin" {
			return nil, http_response.NewError(http_response.Forbidden, "Không có quyền truy cập phòng trong homestay này")
		}
	}

	// Set default values
	if req.Page <= 0 {
		req.Page = 1
	}
	if req.PageSize <= 0 {
		req.PageSize = 10
	}

	// Get rooms
	rooms, total, err := l.svcCtx.RoomRepo.GetByHomestayIDWithFilter(
		req.HomestayID, req.Page, req.PageSize, req.Status, req.Type, req.MinPrice, req.MaxPrice)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy danh sách phòng")
	}

	// Calculate total pages
	totalPage := (total + req.PageSize - 1) / req.PageSize

	return &types.RoomListResponse{
		Rooms:     rooms,
		Total:     total,
		Page:      req.Page,
		PageSize:  req.PageSize,
		TotalPage: totalPage,
	}, nil
}

// UpdateRoom - Update room
func (l *RoomLogic) UpdateRoom(roomID int, req *types.UpdateRoomRequest, hostID int) (*types.Room, error) {
	// Get room
	room, err := l.svcCtx.RoomRepo.GetByID(roomID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, http_response.NewError(http_response.NotFound, "Phòng không tồn tại")
		}
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin phòng")
	}

	// Check if user has permission to update this room
	homestay, err := l.svcCtx.HomestayRepo.GetByID(room.HomestayID)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin homestay")
	}

	if homestay.HostID != hostID {
		// Check if user is admin
		user, err := l.svcCtx.UserRepo.GetByID(hostID)
		if err != nil || user.Role != "admin" {
			return nil, http_response.NewError(http_response.Forbidden, "Không có quyền cập nhật phòng này")
		}
	}

	// Update fields
	if req.Name != nil {
		room.Name = *req.Name
	}
	if req.Description != nil {
		room.Description = *req.Description
	}
	if req.Type != nil {
		room.Type = *req.Type
	}
	if req.Capacity != nil {
		room.Capacity = *req.Capacity
	}
	if req.Price != nil {
		room.Price = *req.Price
	}
	if req.PriceType != nil {
		room.PriceType = *req.PriceType
	}
	if req.Status != nil {
		room.Status = *req.Status
	}

	room.UpdatedAt = time.Now()

	// Update in database
	err = l.svcCtx.RoomRepo.Update(room)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi cập nhật phòng")
	}

	return room, nil
}

// DeleteRoom - Delete room
func (l *RoomLogic) DeleteRoom(roomID int, hostID int) error {
	// Get room
	room, err := l.svcCtx.RoomRepo.GetByID(roomID)
	if err != nil {
		if err == sql.ErrNoRows {
			return http_response.NewError(http_response.NotFound, "Phòng không tồn tại")
		}
		return http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin phòng")
	}

	// Check if user has permission to delete this room
	homestay, err := l.svcCtx.HomestayRepo.GetByID(room.HomestayID)
	if err != nil {
		return http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin homestay")
	}

	if homestay.HostID != hostID {
		// Check if user is admin
		user, err := l.svcCtx.UserRepo.GetByID(hostID)
		if err != nil || user.Role != "admin" {
			return http_response.NewError(http_response.Forbidden, "Không có quyền xóa phòng này")
		}
	}

	// Check if room has active bookings
	hasActiveBookings, err := l.svcCtx.BookingRepo.HasActiveBookingsByRoomID(roomID)
	if err != nil {
		return http_response.NewError(http_response.InternalServerError, "Lỗi khi kiểm tra booking")
	}

	if hasActiveBookings {
		return http_response.NewError(http_response.BadRequest, "Không thể xóa phòng có booking đang hoạt động")
	}

	// Delete room (this will also delete related availabilities due to foreign key constraints)
	err = l.svcCtx.RoomRepo.Delete(roomID)
	if err != nil {
		return http_response.NewError(http_response.InternalServerError, "Lỗi khi xóa phòng")
	}

	return nil
}

// CreateAvailability - Create room availability
func (l *RoomLogic) CreateAvailability(req *types.CreateAvailabilityRequest, hostID int) (*types.RoomAvailability, error) {
	// Check if room exists and belongs to host
	room, err := l.svcCtx.RoomRepo.GetByID(req.RoomID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, http_response.NewError(http_response.NotFound, "Phòng không tồn tại")
		}
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi kiểm tra phòng")
	}

	// Check if user has permission
	homestay, err := l.svcCtx.HomestayRepo.GetByID(room.HomestayID)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin homestay")
	}

	if homestay.HostID != hostID {
		// Check if user is admin
		user, err := l.svcCtx.UserRepo.GetByID(hostID)
		if err != nil || user.Role != "admin" {
			return nil, http_response.NewError(http_response.Forbidden, "Không có quyền tạo availability cho phòng này")
		}
	}

	// Check if availability already exists for this date
	existingAvailability, err := l.svcCtx.RoomAvailabilityRepo.GetByRoomIDAndDate(req.RoomID, req.Date)
	if err != nil && err != sql.ErrNoRows {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi kiểm tra availability")
	}

	if existingAvailability != nil {
		return nil, http_response.NewError(http_response.BadRequest, "Availability đã tồn tại cho ngày này")
	}

	// Create availability
	availability := &types.RoomAvailability{
		RoomID:    req.RoomID,
		Date:      req.Date,
		Status:    req.Status,
		Price:     req.Price,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Save to database
	availabilityID, err := l.svcCtx.RoomAvailabilityRepo.Create(availability)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi tạo availability")
	}

	// Get created availability
	createdAvailability, err := l.svcCtx.RoomAvailabilityRepo.GetByID(availabilityID)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin availability")
	}

	return createdAvailability, nil
}

// UpdateAvailability - Update room availability
func (l *RoomLogic) UpdateAvailability(availabilityID int, req *types.UpdateAvailabilityRequest, hostID int) (*types.RoomAvailability, error) {
	// Get availability
	availability, err := l.svcCtx.RoomAvailabilityRepo.GetByID(availabilityID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, http_response.NewError(http_response.NotFound, "Availability không tồn tại")
		}
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin availability")
	}

	// Check if user has permission
	room, err := l.svcCtx.RoomRepo.GetByID(availability.RoomID)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin phòng")
	}

	homestay, err := l.svcCtx.HomestayRepo.GetByID(room.HomestayID)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin homestay")
	}

	if homestay.HostID != hostID {
		// Check if user is admin
		user, err := l.svcCtx.UserRepo.GetByID(hostID)
		if err != nil || user.Role != "admin" {
			return nil, http_response.NewError(http_response.Forbidden, "Không có quyền cập nhật availability này")
		}
	}

	// Update fields
	if req.Status != nil {
		availability.Status = *req.Status
	}
	if req.Price != nil {
		availability.Price = req.Price
	}

	availability.UpdatedAt = time.Now()

	// Update in database
	err = l.svcCtx.RoomAvailabilityRepo.Update(availability)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi cập nhật availability")
	}

	return availability, nil
}

// BulkUpdateAvailability - Update multiple availabilities
func (l *RoomLogic) BulkUpdateAvailability(req *types.BulkAvailabilityRequest, hostID int) error {
	// Check if room exists and belongs to host
	room, err := l.svcCtx.RoomRepo.GetByID(req.RoomID)
	if err != nil {
		if err == sql.ErrNoRows {
			return http_response.NewError(http_response.NotFound, "Phòng không tồn tại")
		}
		return http_response.NewError(http_response.InternalServerError, "Lỗi khi kiểm tra phòng")
	}

	// Check if user has permission
	homestay, err := l.svcCtx.HomestayRepo.GetByID(room.HomestayID)
	if err != nil {
		return http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thông tin homestay")
	}

	if homestay.HostID != hostID {
		// Check if user is admin
		user, err := l.svcCtx.UserRepo.GetByID(hostID)
		if err != nil || user.Role != "admin" {
			return http_response.NewError(http_response.Forbidden, "Không có quyền cập nhật availability cho phòng này")
		}
	}

	// Validate date range
	if req.StartDate.After(req.EndDate) {
		return http_response.NewError(http_response.BadRequest, "Ngày bắt đầu phải trước ngày kết thúc")
	}

	// Create exclude dates map for quick lookup
	excludeMap := make(map[string]bool)
	for _, date := range req.ExcludeDates {
		excludeMap[date.Format("2006-01-02")] = true
	}

	// Generate dates and create/update availabilities
	currentDate := req.StartDate
	for !currentDate.After(req.EndDate) {
		dateStr := currentDate.Format("2006-01-02")
		
		// Skip excluded dates
		if !excludeMap[dateStr] {
			// Check if availability exists
			existingAvailability, err := l.svcCtx.RoomAvailabilityRepo.GetByRoomIDAndDate(req.RoomID, currentDate)
			if err != nil && err != sql.ErrNoRows {
				return http_response.NewError(http_response.InternalServerError, "Lỗi khi kiểm tra availability")
			}

			if existingAvailability != nil {
				// Update existing
				existingAvailability.Status = req.Status
				if req.Price != nil {
					existingAvailability.Price = req.Price
				}
				existingAvailability.UpdatedAt = time.Now()
				
				err = l.svcCtx.RoomAvailabilityRepo.Update(existingAvailability)
				if err != nil {
					return http_response.NewError(http_response.InternalServerError, "Lỗi khi cập nhật availability")
				}
			} else {
				// Create new
				availability := &types.RoomAvailability{
					RoomID:    req.RoomID,
					Date:      currentDate,
					Status:    req.Status,
					Price:     req.Price,
					CreatedAt: time.Now(),
					UpdatedAt: time.Now(),
				}
				
				_, err = l.svcCtx.RoomAvailabilityRepo.Create(availability)
				if err != nil {
					return http_response.NewError(http_response.InternalServerError, "Lỗi khi tạo availability")
				}
			}
		}
		
		currentDate = currentDate.AddDate(0, 0, 1)
	}

	return nil
}

// GetRoomStats - Get room statistics for a homestay
func (l *RoomLogic) GetRoomStats(homestayID int, hostID int) (*types.RoomStatsResponse, error) {
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
			return nil, http_response.NewError(http_response.Forbidden, "Không có quyền truy cập thống kê phòng của homestay này")
		}
	}

	// Get statistics
	stats, err := l.svcCtx.RoomRepo.GetStatsByHomestayID(homestayID)
	if err != nil {
		return nil, http_response.NewError(http_response.InternalServerError, "Lỗi khi lấy thống kê phòng")
	}

	return stats, nil
} 