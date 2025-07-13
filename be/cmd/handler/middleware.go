package handler

import (
	"homestay-be/cmd/logic"
	"homestay-be/cmd/svc"
	"homestay-be/cmd/types"
	"homestay-be/core/http_response"
	"strings"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware middleware xác thực JWT token
func AuthMiddleware(svc *svc.ServiceContext) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Lấy token từ header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			http_response.ResponseUnauthorized(c, "Token không được cung cấp")
			c.Abort()
			return
		}

		// Kiểm tra format "Bearer <token>"
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			http_response.ResponseUnauthorized(c, "Token không đúng định dạng")
			c.Abort()
			return
		}

		tokenString := tokenParts[1]

		// Validate token
		authLogic := logic.NewAuthLogic(svc)
		userInfo, err := authLogic.ValidateToken(tokenString)
		if err != nil {
			http_response.ResponseUnauthorized(c, "Token không hợp lệ")
			c.Abort()
			return
		}

		// Lưu thông tin user vào context
		c.Set("user", userInfo)
		c.Next()
	}
}

// RoleMiddleware middleware kiểm tra role
func RoleMiddleware(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userInterface, exists := c.Get("user")
		if !exists {
			http_response.ResponseUnauthorized(c, "Không tìm thấy thông tin user")
			c.Abort()
			return
		}

		user, ok := userInterface.(*types.UserInfo)
		if !ok {
			http_response.ResponseInternalServerError(c, "Lỗi xử lý thông tin user")
			c.Abort()
			return
		}

		// Kiểm tra role
		for _, allowedRole := range allowedRoles {
			if user.Role == allowedRole {
				c.Next()
				return
			}
		}

		http_response.ResponseForbidden(c, "Không có quyền truy cập")
		c.Abort()
	}
}

// GetCurrentUser lấy thông tin user hiện tại từ context
func GetCurrentUser(c *gin.Context) (*types.UserInfo, bool) {
	userInterface, exists := c.Get("user")
	if !exists {
		return nil, false
	}

	user, ok := userInterface.(*types.UserInfo)
	return user, ok
} 