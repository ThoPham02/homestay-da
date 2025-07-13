package handler

import (
	"net/http"
	"homestay-be/cmd/svc"
	"github.com/gin-gonic/gin"
)

// RegisterHandlers đăng ký tất cả các routes và handlers
func RegisterHandlers(router *gin.Engine, serverCtx *svc.ServiceContext) {
	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "OK",
			"message": "Server đang hoạt động",
		})
	})
	
	// API routes
	api := router.Group("/api/v1")
	{
		// Homestay routes
		api.GET("/homestays", getHomestays)
		api.GET("/homestays/:id", getHomestayByID)
		api.POST("/homestays", createHomestay)
		api.PUT("/homestays/:id", updateHomestay)
		api.DELETE("/homestays/:id", deleteHomestay)
		
		// Booking routes
		api.GET("/bookings", getBookings)
		api.POST("/bookings", createBooking)
		api.PUT("/bookings/:id", updateBooking)
		api.DELETE("/bookings/:id", deleteBooking)
		
		// Auth routes
		api.POST("/auth/login", login)
		api.POST("/auth/register", register)
	}
}

// Placeholder handlers - sẽ được implement sau với business logic thực tế
func getHomestays(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Danh sách homestay"})
}

func getHomestayByID(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Chi tiết homestay", "id": id})
}

func createHomestay(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{"message": "Tạo homestay thành công"})
}

func updateHomestay(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Cập nhật homestay thành công", "id": id})
}

func deleteHomestay(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Xóa homestay thành công", "id": id})
}

func getBookings(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Danh sách booking"})
}

func createBooking(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{"message": "Tạo booking thành công"})
}

func updateBooking(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Cập nhật booking thành công", "id": id})
}

func deleteBooking(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Xóa booking thành công", "id": id})
}

func login(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Đăng nhập thành công"})
}

func register(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{"message": "Đăng ký thành công"})
}
