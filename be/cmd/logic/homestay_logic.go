package logic

import (
	"context"
	"errors"
	"homestay-be/cmd/database/model"
	"homestay-be/cmd/svc"
	"homestay-be/cmd/types"
	"time"
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
func (h *HomestayLogic) CreateHomestay(req *types.CreateHomestayRequest, hostID int) (*types.HomestayDetailResponse, error) {
	modelReq := &model.HomestayCreateRequest{
		Name:        req.Name,
		Description: req.Description,
		Address:     req.Address,
		OwnerID:     hostID,
	}
	created, err := h.svcCtx.HomestayRepo.Create(h.ctx, modelReq)
	if err != nil {
		return nil, err
	}
	resp := types.Homestay{
		ID:          created.ID,
		Name:        created.Name,
		Description: created.Description,
		Address:     created.Address,
		HostID:      created.OwnerID,
		CreatedAt:   created.CreatedAt,
		UpdatedAt:   created.CreatedAt,
	}
	return &types.HomestayDetailResponse{Homestay: resp}, nil
}

// GetHomestayByID - Get homestay by ID
func (h *HomestayLogic) GetHomestayByID(homestayID, hostID int) (*types.HomestayDetailResponse, error) {
	found, err := h.svcCtx.HomestayRepo.GetByID(h.ctx, homestayID)
	if err != nil {
		return nil, err
	}
	if found.OwnerID != hostID {
		return nil, errors.New("Không có quyền truy cập homestay này")
	}
	resp := types.Homestay{
		ID:          found.ID,
		Name:        found.Name,
		Description: found.Description,
		Address:     found.Address,
		HostID:      found.OwnerID,
		CreatedAt:   found.CreatedAt,
		UpdatedAt:   found.CreatedAt,
	}
	return &types.HomestayDetailResponse{Homestay: resp}, nil
}

// GetHomestayList - Get list of homestays for a host
func (h *HomestayLogic) GetHomestayList(req *types.HomestayListRequest, hostID int) (*types.HomestayListResponse, error) {
	page := req.Page
	if page < 1 {
		page = 1
	}
	pageSize := req.PageSize
	if pageSize < 1 {
		pageSize = 10
	}
	homestays, total, err := h.svcCtx.HomestayRepo.GetByOwnerID(h.ctx, hostID, page, pageSize)
	if err != nil {
		return nil, err
	}
	respList := make([]types.Homestay, 0, len(homestays))
	for _, hst := range homestays {
		respList = append(respList, types.Homestay{
			ID:          hst.ID,
			Name:        hst.Name,
			Description: hst.Description,
			Address:     hst.Address,
			HostID:      hst.OwnerID,
			CreatedAt:   hst.CreatedAt,
			UpdatedAt:   hst.CreatedAt,
		})
	}
	totalPage := (total + pageSize - 1) / pageSize
	return &types.HomestayListResponse{
		Homestays: respList,
		Total:     total,
		Page:      page,
		PageSize:  pageSize,
		TotalPage: totalPage,
	}, nil
}

// UpdateHomestay - Update homestay
func (h *HomestayLogic) UpdateHomestay(homestayID int, req *types.UpdateHomestayRequest, hostID int) (*types.HomestayDetailResponse, error) {
	// Kiểm tra quyền
	found, err := h.svcCtx.HomestayRepo.GetByID(h.ctx, homestayID)
	if err != nil {
		return nil, err
	}
	if found.OwnerID != hostID {
		return nil, errors.New("Không có quyền cập nhật homestay này")
	}
	modelReq := &model.HomestayUpdateRequest{
		Name:        req.Name,
		Description: req.Description,
		Address:     req.Address,
	}
	updated, err := h.svcCtx.HomestayRepo.Update(h.ctx, homestayID, modelReq)
	if err != nil {
		return nil, err
	}
	resp := types.Homestay{
		ID:          updated.ID,
		Name:        updated.Name,
		Description: updated.Description,
		Address:     updated.Address,
		HostID:      updated.OwnerID,
		CreatedAt:   updated.CreatedAt,
		UpdatedAt:   time.Now(),
	}
	return &types.HomestayDetailResponse{Homestay: resp}, nil
}

// DeleteHomestay - Delete homestay
func (h *HomestayLogic) DeleteHomestay(homestayID, hostID int) error {
	found, err := h.svcCtx.HomestayRepo.GetByID(h.ctx, homestayID)
	if err != nil {
		return err
	}
	if found.OwnerID != hostID {
		return errors.New("Không có quyền xóa homestay này")
	}
	return h.svcCtx.HomestayRepo.Delete(h.ctx, homestayID)
}

// GetHomestayStats - Get homestay statistics for a host
func (h *HomestayLogic) GetHomestayStats(hostID int) (*types.HomestayStatsResponse, error) {
	// TODO: Implement thống kê thực tế (giả lập số liệu)
	_, total, err := h.svcCtx.HomestayRepo.GetByOwnerID(h.ctx, hostID, 1, 1000)
	if err != nil {
		return nil, err
	}
	return &types.HomestayStatsResponse{
		TotalHomestays:  total,
		ActiveHomestays: total, // Giả lập
		TotalRooms:      0,
		AvailableRooms:  0,
		TotalBookings:   0,
		TotalRevenue:    0,
	}, nil
}

// GetHomestayStatsByID - Get homestay statistics for a specific homestay
func (h *HomestayLogic) GetHomestayStatsByID(homestayID, hostID int) (*types.HomestayStatsResponse, error) {
	// TODO: Implement thống kê thực tế (giả lập số liệu)
	_, err := h.GetHomestayByID(homestayID, hostID)
	if err != nil {
		return nil, err
	}
	return &types.HomestayStatsResponse{
		TotalHomestays:  1,
		ActiveHomestays: 1,
		TotalRooms:      0,
		AvailableRooms:  0,
		TotalBookings:   0,
		TotalRevenue:    0,
	}, nil
}
