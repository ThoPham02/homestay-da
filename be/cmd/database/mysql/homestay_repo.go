package mysql

import (
	"context"
	"database/sql"
	"fmt"
	"homestay-be/cmd/database/model"
	"homestay-be/cmd/database/repo"
	"strings"

	"github.com/jmoiron/sqlx"
)

type homestayRepository struct {
	db *sqlx.DB
}

// NewHomestayRepository tạo instance mới của HomestayRepository
func NewHomestayRepository(db *sqlx.DB) repo.HomestayRepository {
	return &homestayRepository{db: db}
}

// Create tạo homestay mới
func (r *homestayRepository) Create(ctx context.Context, req *model.HomestayCreateRequest) (*model.Homestay, error) {
	query := `
		INSERT INTO homestay (name, description, address, owner_id)
		VALUES ($1, $2, $3, $4)
		RETURNING id, name, description, address, owner_id, created_at
	`

	var homestay model.Homestay
	err := r.db.GetContext(ctx, &homestay, query, req.Name, req.Description, req.Address, req.OwnerID)
	if err != nil {
		return nil, fmt.Errorf("failed to create homestay: %w", err)
	}

	return &homestay, nil
}

// GetByID lấy homestay theo ID
func (r *homestayRepository) GetByID(ctx context.Context, id int) (*model.Homestay, error) {
	query := `
		SELECT h.id, h.name, h.description, h.address, h.owner_id, h.created_at, u.name as owner_name
		FROM homestay h
		LEFT JOIN "user" u ON h.owner_id = u.id
		WHERE h.id = $1
	`

	var homestay model.Homestay
	err := r.db.GetContext(ctx, &homestay, query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("homestay not found")
		}
		return nil, fmt.Errorf("failed to get homestay: %w", err)
	}

	return &homestay, nil
}

// Update cập nhật thông tin homestay
func (r *homestayRepository) Update(ctx context.Context, id int, req *model.HomestayUpdateRequest) (*model.Homestay, error) {
	// Xây dựng query động
	query := `UPDATE homestay SET `
	var args []interface{}
	var setClauses []string
	argIndex := 1

	if req.Name != nil {
		setClauses = append(setClauses, fmt.Sprintf("name = $%d", argIndex))
		args = append(args, *req.Name)
		argIndex++
	}

	if req.Description != nil {
		setClauses = append(setClauses, fmt.Sprintf("description = $%d", argIndex))
		args = append(args, *req.Description)
		argIndex++
	}

	if req.Address != nil {
		setClauses = append(setClauses, fmt.Sprintf("address = $%d", argIndex))
		args = append(args, *req.Address)
		argIndex++
	}

	if len(setClauses) == 0 {
		return r.GetByID(ctx, id)
	}

	query += strings.Join(setClauses, ", ")
	query += fmt.Sprintf(" WHERE id = $%d", argIndex)
	args = append(args, id)

	// Thực hiện update
	_, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to update homestay: %w", err)
	}

	// Lấy thông tin homestay sau khi update
	return r.GetByID(ctx, id)
}

// Delete xóa homestay
func (r *homestayRepository) Delete(ctx context.Context, id int) error {
	query := `DELETE FROM homestay WHERE id = $1`
	
	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete homestay: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("homestay not found")
	}

	return nil
}

// List lấy danh sách homestay với phân trang
func (r *homestayRepository) List(ctx context.Context, page, pageSize int) ([]*model.Homestay, int, error) {
	// Đếm tổng số records
	countQuery := `SELECT COUNT(*) FROM homestay`
	var total int
	err := r.db.GetContext(ctx, &total, countQuery)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count homestays: %w", err)
	}

	// Lấy danh sách homestay
	offset := (page - 1) * pageSize
	query := `
		SELECT h.id, h.name, h.description, h.address, h.owner_id, h.created_at, u.name as owner_name
		FROM homestay h
		LEFT JOIN "user" u ON h.owner_id = u.id
		ORDER BY h.created_at DESC
		LIMIT $1 OFFSET $2
	`

	var homestays []*model.Homestay
	err = r.db.SelectContext(ctx, &homestays, query, pageSize, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to list homestays: %w", err)
	}

	return homestays, total, nil
}

// Search tìm kiếm homestay
func (r *homestayRepository) Search(ctx context.Context, req *model.HomestaySearchRequest) ([]*model.Homestay, int, error) {
	// Xây dựng query tìm kiếm
	whereClauses := []string{}
	var args []interface{}
	argIndex := 1

	if req.Name != nil && *req.Name != "" {
		whereClauses = append(whereClauses, fmt.Sprintf("h.name ILIKE $%d", argIndex))
		args = append(args, "%"+*req.Name+"%")
		argIndex++
	}

	if req.Address != nil && *req.Address != "" {
		whereClauses = append(whereClauses, fmt.Sprintf("h.address ILIKE $%d", argIndex))
		args = append(args, "%"+*req.Address+"%")
		argIndex++
	}

	if req.OwnerID != nil {
		whereClauses = append(whereClauses, fmt.Sprintf("h.owner_id = $%d", argIndex))
		args = append(args, *req.OwnerID)
		argIndex++
	}

	whereClause := ""
	if len(whereClauses) > 0 {
		whereClause = "WHERE " + strings.Join(whereClauses, " AND ")
	}

	// Đếm tổng số records
	countQuery := fmt.Sprintf(`
		SELECT COUNT(*) 
		FROM homestay h
		LEFT JOIN "user" u ON h.owner_id = u.id
		%s
	`, whereClause)
	var total int
	err := r.db.GetContext(ctx, &total, countQuery, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count homestays: %w", err)
	}

	// Lấy danh sách homestay
	offset := (req.Page - 1) * req.PageSize
	query := fmt.Sprintf(`
		SELECT h.id, h.name, h.description, h.address, h.owner_id, h.created_at, u.name as owner_name
		FROM homestay h
		LEFT JOIN "user" u ON h.owner_id = u.id
		%s
		ORDER BY h.created_at DESC
		LIMIT $%d OFFSET $%d
	`, whereClause, argIndex, argIndex+1)
	args = append(args, req.PageSize, offset)

	var homestays []*model.Homestay
	err = r.db.SelectContext(ctx, &homestays, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to search homestays: %w", err)
	}

	return homestays, total, nil
}

// GetByOwnerID lấy danh sách homestay theo owner
func (r *homestayRepository) GetByOwnerID(ctx context.Context, ownerID int, page, pageSize int) ([]*model.Homestay, int, error) {
	// Đếm tổng số records
	countQuery := `SELECT COUNT(*) FROM homestay WHERE owner_id = $1`
	var total int
	err := r.db.GetContext(ctx, &total, countQuery, ownerID)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count homestays: %w", err)
	}

	// Lấy danh sách homestay
	offset := (page - 1) * pageSize
	query := `
		SELECT h.id, h.name, h.description, h.address, h.owner_id, h.created_at, u.name as owner_name
		FROM homestay h
		LEFT JOIN "user" u ON h.owner_id = u.id
		WHERE h.owner_id = $1
		ORDER BY h.created_at DESC
		LIMIT $2 OFFSET $3
	`

	var homestays []*model.Homestay
	err = r.db.SelectContext(ctx, &homestays, query, ownerID, pageSize, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get homestays by owner: %w", err)
	}

	return homestays, total, nil
} 