package logic

import (
	"context"
	"errors"
	"homestay-be/cmd/database/model"
	"homestay-be/cmd/svc"
	"homestay-be/cmd/types"
	"log"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthLogic struct {
	svc *svc.ServiceContext
}

func NewAuthLogic(svc *svc.ServiceContext) *AuthLogic {
	return &AuthLogic{svc: svc}
}

// Login xử lý đăng nhập
func (l *AuthLogic) Login(ctx context.Context, req *types.LoginRequest) (*types.LoginResponse, error) {
	log.Println("Input Login Request:", req)

	// Tìm user theo email
	user, err := l.svc.UserRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, errors.New("email hoặc mật khẩu không đúng")
	}

	// Kiểm tra password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return nil, errors.New("email hoặc mật khẩu không đúng")
	}

	// Tạo JWT token
	accessToken, err := l.generateJWT(user.ID, user.Email, user.Role)
	if err != nil {
		return nil, errors.New("không thể tạo token")
	}

	// Tạo response
	response := &types.LoginResponse{
		User: types.UserInfo{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
			Role:  user.Role,
		},
		AccessToken: accessToken,
		ExpiresIn:   30 * 24 * 60 * 60, // 30 ngày tính bằng giây
	}

	return response, nil
}

// Register xử lý đăng ký
func (l *AuthLogic) Register(ctx context.Context, req *types.RegisterRequest) (*types.LoginResponse, error) {
	log.Println("Input Register Request:", req)

	// Kiểm tra email đã tồn tại chưa
	existingUser, err := l.svc.UserRepo.GetByEmail(ctx, req.Email)
	if err == nil && existingUser != nil {
		return nil, errors.New("email đã được sử dụng")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("không thể mã hóa mật khẩu")
	}

	// Tạo user mới
	userReq := &model.UserCreateRequest{
		Name:     req.Name,
		Email:    req.Email,
		Password: string(hashedPassword),
		Role:     req.Role,
	}

	user, err := l.svc.UserRepo.Create(ctx, userReq)
	if err != nil {
		return nil, errors.New("không thể tạo tài khoản")
	}

	// Tạo JWT token
	accessToken, err := l.generateJWT(user.ID, user.Email, user.Role)
	if err != nil {
		return nil, errors.New("không thể tạo token")
	}

	// Tạo response
	response := &types.LoginResponse{
		User: types.UserInfo{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
			Role:  user.Role,
		},
		AccessToken: accessToken,
		ExpiresIn:   30 * 24 * 60 * 60, // 30 ngày tính bằng giây
	}

	return response, nil
}

// GetProfile lấy thông tin profile
func (l *AuthLogic) GetProfile(ctx context.Context, userID int) (*types.ProfileResponse, error) {
	// Lấy thông tin user
	user, err := l.svc.UserRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, errors.New("không tìm thấy người dùng")
	}

	// Tạo response
	response := &types.ProfileResponse{
		User: types.UserInfo{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
			Role:  user.Role,
		},
	}

	return response, nil
}

// generateJWT tạo JWT token
func (l *AuthLogic) generateJWT(userID int, email, role string) (string, error) {
	// Tạo claims
	claims := jwt.MapClaims{
		"user_id": userID,
		"email":   email,
		"role":    role,
		"exp":     time.Now().Add(time.Hour * 24 * 30).Unix(), // 30 ngày
		"iat":     time.Now().Unix(),
	}

	// Tạo token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	
	// Ký token với secret key (nên lưu trong config)
	secretKey := "your-secret-key" // TODO: Lấy từ config
	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// ValidateToken xác thực JWT token
func (l *AuthLogic) ValidateToken(tokenString string) (*types.UserInfo, error) {
	// Parse token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Kiểm tra signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte("your-secret-key"), nil // TODO: Lấy từ config
	})

	if err != nil {
		return nil, errors.New("token không hợp lệ")
	}

	// Kiểm tra token có hợp lệ không
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userInfo := &types.UserInfo{
			ID:    int(claims["user_id"].(float64)),
			Email: claims["email"].(string),
			Role:  claims["role"].(string),
		}
		return userInfo, nil
	}

	return nil, errors.New("token không hợp lệ")
} 