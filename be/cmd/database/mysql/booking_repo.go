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

type bookingRepository struct {
	db *sqlx.DB
}

// NewBookingRepository tạo instance mới của BookingRepository
func NewBookingRepository(db *sqlx.DB) repo.BookingRepository {
	return &bookingRepository{db: db}
}

// Create tạo booking mới
func (r *bookingRepository) Create(ctx context.Context, req *model.BookingCreateRequest) (*model.Booking, error) {
	query := `
		INSERT INTO booking (name, email, phone, check_in, check_out, num_guests, total_amount, status, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, 'confirmed', NOW())
		RETURNING id, name, email, phone, check_in, check_out, num_guests, total_amount, status, created_at
	`

	var booking model.Booking
	err := r.db.GetContext(ctx, &booking, query, req.Name, req.Email, req.Phone, req.CheckIn, req.CheckOut, req.NumGuests, 0)
	if err != nil {
		return nil, err
	}

	return &booking, nil
}

// GetByID lấy booking theo ID
func (r *bookingRepository) GetByID(ctx context.Context, id int) (*model.Booking, error) {
	query := `
		SELECT b.id, b.booking_request_id, b.user_id, b.room_id, b.check_in, b.check_out, b.num_guests, 
		       b.total_amount, b.status, b.created_at,
		       u.name as user_name, r.name as room_name, h.name as homestay_name
		FROM booking b
		LEFT JOIN "user" u ON b.user_id = u.id
		LEFT JOIN room r ON b.room_id = r.id
		LEFT JOIN homestay h ON r.homestay_id = h.id
		WHERE b.id = $1
	`

	var booking model.Booking
	err := r.db.GetContext(ctx, &booking, query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("booking not found")
		}
		return nil, fmt.Errorf("failed to get booking: %w", err)
	}

	return &booking, nil
}

// Update cập nhật thông tin booking
func (r *bookingRepository) Update(ctx context.Context, id int, req *model.BookingUpdateRequest) (*model.Booking, error) {
	// Xây dựng query động
	query := `UPDATE booking SET `
	var args []interface{}
	var setClauses []string
	argIndex := 1

	if req.Status != nil {
		setClauses = append(setClauses, fmt.Sprintf("status = $%d", argIndex))
		args = append(args, *req.Status)
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
		return nil, fmt.Errorf("failed to update booking: %w", err)
	}

	// Lấy thông tin booking sau khi update
	return r.GetByID(ctx, id)
}

// Delete xóa booking
func (r *bookingRepository) Delete(ctx context.Context, id int) error {
	query := `DELETE FROM booking WHERE id = $1`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete booking: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("booking not found")
	}

	return nil
}

// List lấy danh sách booking với phân trang
func (r *bookingRepository) List(ctx context.Context, page, pageSize int) ([]*model.Booking, int, error) {
	// Đếm tổng số records
	countQuery := `SELECT COUNT(*) FROM booking`
	var total int
	err := r.db.GetContext(ctx, &total, countQuery)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count bookings: %w", err)
	}

	// Lấy danh sách booking
	offset := (page - 1) * pageSize
	query := `
		SELECT b.id, b.booking_request_id, b.user_id, b.room_id, b.check_in, b.check_out, b.num_guests, 
		       b.total_amount, b.status, b.created_at,
		       u.name as user_name, r.name as room_name, h.name as homestay_name
		FROM booking b
		LEFT JOIN "user" u ON b.user_id = u.id
		LEFT JOIN room r ON b.room_id = r.id
		LEFT JOIN homestay h ON r.homestay_id = h.id
		ORDER BY b.created_at DESC
		LIMIT $1 OFFSET $2
	`

	var bookings []*model.Booking
	err = r.db.SelectContext(ctx, &bookings, query, pageSize, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to list bookings: %w", err)
	}

	return bookings, total, nil
}

// Search tìm kiếm booking
func (r *bookingRepository) Search(ctx context.Context, req *model.BookingSearchRequest) ([]*model.Booking, int, error) {
	// Xây dựng query tìm kiếm
	whereClauses := []string{}
	var args []interface{}
	argIndex := 1

	if req.UserID != nil {
		whereClauses = append(whereClauses, fmt.Sprintf("b.user_id = $%d", argIndex))
		args = append(args, *req.UserID)
		argIndex++
	}

	if req.RoomID != nil {
		whereClauses = append(whereClauses, fmt.Sprintf("b.room_id = $%d", argIndex))
		args = append(args, *req.RoomID)
		argIndex++
	}

	if req.Status != nil && *req.Status != "" {
		whereClauses = append(whereClauses, fmt.Sprintf("b.status = $%d", argIndex))
		args = append(args, *req.Status)
		argIndex++
	}

	if req.StartDate != nil {
		whereClauses = append(whereClauses, fmt.Sprintf("b.check_in >= $%d", argIndex))
		args = append(args, *req.StartDate)
		argIndex++
	}

	if req.EndDate != nil {
		whereClauses = append(whereClauses, fmt.Sprintf("b.check_out <= $%d", argIndex))
		args = append(args, *req.EndDate)
		argIndex++
	}

	whereClause := ""
	if len(whereClauses) > 0 {
		whereClause = "WHERE " + strings.Join(whereClauses, " AND ")
	}

	// Đếm tổng số records
	countQuery := fmt.Sprintf(`
		SELECT COUNT(*) 
		FROM booking b
		LEFT JOIN "user" u ON b.user_id = u.id
		LEFT JOIN room r ON b.room_id = r.id
		LEFT JOIN homestay h ON r.homestay_id = h.id
		%s
	`, whereClause)
	var total int
	err := r.db.GetContext(ctx, &total, countQuery, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count bookings: %w", err)
	}

	// Lấy danh sách booking
	offset := (req.Page - 1) * req.PageSize
	query := fmt.Sprintf(`
		SELECT b.id, b.booking_request_id, b.user_id, b.room_id, b.check_in, b.check_out, b.num_guests, 
		       b.total_amount, b.status, b.created_at,
		       u.name as user_name, r.name as room_name, h.name as homestay_name
		FROM booking b
		LEFT JOIN "user" u ON b.user_id = u.id
		LEFT JOIN room r ON b.room_id = r.id
		LEFT JOIN homestay h ON r.homestay_id = h.id
		%s
		ORDER BY b.created_at DESC
		LIMIT $%d OFFSET $%d
	`, whereClause, argIndex, argIndex+1)
	args = append(args, req.PageSize, offset)

	var bookings []*model.Booking
	err = r.db.SelectContext(ctx, &bookings, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to search bookings: %w", err)
	}

	return bookings, total, nil
}

// GetByUserID lấy danh sách booking theo user
func (r *bookingRepository) GetByUserID(ctx context.Context, userID int, page, pageSize int) ([]*model.Booking, int, error) {
	// Đếm tổng số records
	countQuery := `SELECT COUNT(*) FROM booking WHERE user_id = $1`
	var total int
	err := r.db.GetContext(ctx, &total, countQuery, userID)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count bookings: %w", err)
	}

	// Lấy danh sách booking
	offset := (page - 1) * pageSize
	query := `
		SELECT b.id, b.booking_request_id, b.user_id, b.room_id, b.check_in, b.check_out, b.num_guests, 
		       b.total_amount, b.status, b.created_at,
		       u.name as user_name, r.name as room_name, h.name as homestay_name
		FROM booking b
		LEFT JOIN "user" u ON b.user_id = u.id
		LEFT JOIN room r ON b.room_id = r.id
		LEFT JOIN homestay h ON r.homestay_id = h.id
		WHERE b.user_id = $1
		ORDER BY b.created_at DESC
		LIMIT $2 OFFSET $3
	`

	var bookings []*model.Booking
	err = r.db.SelectContext(ctx, &bookings, query, userID, pageSize, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get bookings by user: %w", err)
	}

	return bookings, total, nil
}

// GetByRoom lấy booking qua bảng booking_room
func (r *bookingRepository) GetByRoom(ctx context.Context, roomID int, page, pageSize int) ([]*model.Booking, int, error) {
	countQuery := `SELECT COUNT(DISTINCT b.id)
		FROM booking b
		JOIN booking_room br ON b.id = br.booking_id
		WHERE br.room_id = $1`
	var total int
	err := r.db.GetContext(ctx, &total, countQuery, roomID)
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	query := `SELECT b.*
	FROM booking b
	JOIN booking_room br ON b.id = br.booking_id
	WHERE br.room_id = $1
	ORDER BY b.created_at DESC
	LIMIT $2 OFFSET $3`
	var bookings []*model.Booking
	err = r.db.SelectContext(ctx, &bookings, query, roomID, pageSize, offset)
	if err != nil {
		return nil, 0, err
	}
	return bookings, total, nil
}

// GetRoomsByBookingID lấy danh sách BookingRoom theo booking_id
func (r *bookingRepository) GetRoomsByBookingID(ctx context.Context, bookingID int) ([]*model.BookingRoom, error) {
	query := `SELECT * FROM booking_room WHERE booking_id = $1`
	var rooms []*model.BookingRoom
	err := r.db.SelectContext(ctx, &rooms, query, bookingID)
	if err != nil {
		return nil, err
	}
	return rooms, nil
}

// GetByStatus lấy danh sách booking theo status
func (r *bookingRepository) GetByStatus(ctx context.Context, status string, page, pageSize int) ([]*model.Booking, int, error) {
	// Đếm tổng số records
	countQuery := `SELECT COUNT(*) FROM booking WHERE status = $1`
	var total int
	err := r.db.GetContext(ctx, &total, countQuery, status)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count bookings: %w", err)
	}

	// Lấy danh sách booking
	offset := (page - 1) * pageSize
	query := `
		SELECT b.id, b.booking_request_id, b.user_id, b.room_id, b.check_in, b.check_out, b.num_guests, 
		       b.total_amount, b.status, b.created_at,
		       u.name as user_name, r.name as room_name, h.name as homestay_name
		FROM booking b
		LEFT JOIN "user" u ON b.user_id = u.id
		LEFT JOIN room r ON b.room_id = r.id
		LEFT JOIN homestay h ON r.homestay_id = h.id
		WHERE b.status = $1
		ORDER BY b.created_at DESC
		LIMIT $2 OFFSET $3
	`

	var bookings []*model.Booking
	err = r.db.SelectContext(ctx, &bookings, query, status, pageSize, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get bookings by status: %w", err)
	}

	return bookings, total, nil
}

// GetByBookingRequestID lấy booking theo booking request ID
func (r *bookingRepository) GetByBookingRequestID(ctx context.Context, bookingRequestID int) (*model.Booking, error) {
	query := `
		SELECT b.id, b.booking_request_id, b.user_id, b.room_id, b.check_in, b.check_out, b.num_guests, 
		       b.total_amount, b.status, b.created_at,
		       u.name as user_name, r.name as room_name, h.name as homestay_name
		FROM booking b
		LEFT JOIN "user" u ON b.user_id = u.id
		LEFT JOIN room r ON b.room_id = r.id
		LEFT JOIN homestay h ON r.homestay_id = h.id
		WHERE b.booking_request_id = $1
	`

	var booking model.Booking
	err := r.db.GetContext(ctx, &booking, query, bookingRequestID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("booking not found")
		}
		return nil, fmt.Errorf("failed to get booking: %w", err)
	}

	return &booking, nil
}

// InsertBookingRoom lưu 1 bản ghi booking_room
func (r *bookingRepository) InsertBookingRoom(ctx context.Context, bookingRoom *model.BookingRoom) (*model.BookingRoom, error) {
	query := `INSERT INTO booking_room (booking_id, room_id, capacity, price, price_type, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, booking_id, room_id, capacity, price, price_type, created_at`
	var br model.BookingRoom
	err := r.db.GetContext(ctx, &br, query, bookingRoom.BookingID, bookingRoom.RoomID, bookingRoom.Capacity, bookingRoom.Price, bookingRoom.PriceType, bookingRoom.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &br, nil
}

// GetBookingsByHomestayID lấy danh sách booking theo homestay ID
func (r *bookingRepository) GetByHomestayID(ctx context.Context, homestayID int, page, pageSize int) ([]*model.Booking, int, error) {
	// Đếm tổng số records
	countQuery := `SELECT COUNT(*) FROM booking b
		JOIN room r ON b.room_id = r.id
		WHERE r.homestay_id = $1`
	var total int
	err := r.db.GetContext(ctx, &total, countQuery, homestayID)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count bookings: %w", err)
	}

	// Lấy danh sách booking
	offset := (page - 1) * pageSize
	query := `
		SELECT b.id, b.booking_request_id, b.user_id, b.room_id, b.check_in, b.check_out, b.num_guests, 
		       b.total_amount, b.status, b.created_at,
		       u.name as user_name, r.name as room_name, h.name as homestay_name
		FROM booking b
		JOIN room r ON b.room_id = r.id
		JOIN homestay h ON r.homestay_id = h.id
		WHERE r.homestay_id = $1
		ORDER BY b.created_at DESC
		LIMIT $2 OFFSET $3
	`

	var bookings []*model.Booking
	err = r.db.SelectContext(ctx, &bookings, query, homestayID, pageSize, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get bookings by homestay ID: %w", err)
	}

	return bookings, total, nil
}
