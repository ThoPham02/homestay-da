package handler

import (
	"homestay-be/cmd/logic"
	"homestay-be/cmd/svc"
	"homestay-be/cmd/types"
	"homestay-be/core/http_response"
	"log"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	svc *svc.ServiceContext
}

func NewAuthHandler(svc *svc.ServiceContext) *AuthHandler {
	return &AuthHandler{svc: svc}
}

// Login xử lý đăng nhập
func (h *AuthHandler) Login(c *gin.Context) {
	var req types.LoginRequest
	
	// Bind request
	if err := c.ShouldBindJSON(&req); err != nil {
		http_response.ResponseBadRequest(c, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Validate request
	if req.Email == "" || req.Password == "" {
		http_response.ResponseBadRequest(c, "Email và mật khẩu không được để trống")
		return
	}

	// Xử lý logic
	authLogic := logic.NewAuthLogic(h.svc)
	response, err := authLogic.Login(c.Request.Context(), &req)
	if err != nil {
		log.Print(err)
		http_response.ResponseError(c, 401, err.Error())
		return
	}

	// Trả về response thành công
	http_response.ResponseSuccess(c, response)
}

// Register xử lý đăng ký
func (h *AuthHandler) Register(c *gin.Context) {
	var req types.RegisterRequest
	
	// Bind request
	if err := c.ShouldBindJSON(&req); err != nil {
		http_response.ResponseBadRequest(c, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Validate request
	if req.Name == "" || req.Email == "" || req.Password == "" || req.Role == "" {
		http_response.ResponseBadRequest(c, "Tất cả các trường đều bắt buộc")
		return
	}

	// Validate role
	validRoles := map[string]bool{"admin": true, "host": true, "guest": true}
	if !validRoles[req.Role] {
		http_response.ResponseBadRequest(c, "Role không hợp lệ. Chỉ chấp nhận: admin, host, guest")
		return
	}

	// Xử lý logic
	authLogic := logic.NewAuthLogic(h.svc)
	response, err := authLogic.Register(c.Request.Context(), &req)
	if err != nil {
		log.Print(err)
		http_response.ResponseError(c, 400, err.Error())
		return
	}

	// Trả về response thành công
	http_response.ResponseSuccess(c, response)
}

// GetProfile lấy thông tin profile của user hiện tại
func (h *AuthHandler) GetProfile(c *gin.Context) {
	// Lấy thông tin user từ middleware
	user, exists := GetCurrentUser(c)
	if !exists {
		http_response.ResponseUnauthorized(c, "Không tìm thấy thông tin user")
		return
	}

	// Lấy thông tin chi tiết từ database
	authLogic := logic.NewAuthLogic(h.svc)
	response, err := authLogic.GetProfile(c.Request.Context(), user.ID)
	if err != nil {
		http_response.ResponseError(c, 404, err.Error())
		return
	}

	// Trả về response thành công
	http_response.ResponseSuccess(c, response)
}

// Logout đăng xuất
func (h *AuthHandler) Logout(c *gin.Context) {
	// TODO: Implement blacklist token logic
	http_response.ResponseSuccess(c, gin.H{
		"message": "Đăng xuất thành công",
	})
}
