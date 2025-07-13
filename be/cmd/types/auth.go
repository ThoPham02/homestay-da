package types

// RegisterRequest request đăng ký
type RegisterRequest struct {
	Name     string `json:"name" binding:"required,min=2,max=100" example:"Nguyễn Văn A"`
	Email    string `json:"email" binding:"required,email" example:"user@example.com"`
	Password string `json:"password" binding:"required,min=6" example:"password123"`
	Role     string `json:"role" binding:"required,oneof=admin host guest" example:"guest"`
}

// LoginRequest request đăng nhập
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email" example:"user@example.com"`
	Password string `json:"password" binding:"required" example:"password123"`
}

// LoginResponse response đăng nhập
type LoginResponse struct {
	User        UserInfo `json:"user"`
	AccessToken string   `json:"access_token"`
	ExpiresIn   int64    `json:"expires_in"`
}

// UserInfo thông tin user
type UserInfo struct {
	ID    int    `json:"id" example:"1"`
	Name  string `json:"name" example:"Nguyễn Văn A"`
	Email string `json:"email" example:"user@example.com"`
	Role  string `json:"role" example:"guest"`
}

// ProfileResponse response profile
type ProfileResponse struct {
	User UserInfo `json:"user"`
} 