package handler

import (
	"home-da/cmd/logic"
	"home-da/cmd/svc"
	"home-da/core/http_response"

	"github.com/gin-gonic/gin"
)

// RegisterHandlers đăng ký tất cả các routes và handlers
func RegisterHandlers(router *gin.Engine, serverCtx *svc.ServiceContext) {
	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		http_response.ResponseSuccess(c, gin.H{
			"status":  "OK",
			"message": "Server đang hoạt động",
		})
	})
	
	// Khởi tạo handlers
	authHandler := NewAuthHandler(serverCtx)
	
	// Initialize logic layers
	homestayLogic := logic.NewHomestayLogic(serverCtx.Ctx, serverCtx)
	roomLogic := logic.NewRoomLogic(serverCtx.Ctx, serverCtx)
	
	// Initialize handlers
	homestayHandler := NewHomestayHandler(homestayLogic)
	roomHandler := NewRoomHandler(roomLogic)
	
	// API routes
	api := router.Group("/api")
	{
		// Auth routes (không cần authentication)
		auth := api.Group("/auth")
		{
			auth.POST("/login", authHandler.Login)
			auth.POST("/register", authHandler.Register)
		}
		
		// Protected routes (cần authentication)
		protected := api.Group("")
		protected.Use(AuthMiddleware(serverCtx))
		{
			// User profile
			protected.GET("/auth/profile", authHandler.GetProfile)
			protected.POST("/auth/logout", authHandler.Logout)
			
			// Homestay routes
			protected.GET("/homestays", getHomestays)
			protected.GET("/homestays/:id", getHomestayByID)
			protected.POST("/homestays", createHomestay)
			protected.PUT("/homestays/:id", updateHomestay)
			protected.DELETE("/homestays/:id", deleteHomestay)
			
			// Booking routes
			protected.GET("/bookings", getBookings)
			protected.POST("/bookings", createBooking)
			protected.PUT("/bookings/:id", updateBooking)
			protected.DELETE("/bookings/:id", deleteBooking)
		}
		
		// Admin routes (cần role admin)
		admin := api.Group("/admin")
		admin.Use(AuthMiddleware(serverCtx))
		admin.Use(RoleMiddleware("admin"))
		{
			admin.GET("/dashboard", getAdminDashboard)
			admin.GET("/users", getUsers)
			admin.GET("/users/:id", getUserByID)
			admin.PUT("/users/:id", updateUser)
			admin.DELETE("/users/:id", deleteUser)
		}
		
		// Host routes (cần role host hoặc admin)
		host := api.Group("/host")
		host.Use(AuthMiddleware(serverCtx))
		host.Use(RoleMiddleware("host", "admin"))
		{
			host.GET("/dashboard", getHostDashboard)
			
			// Homestay management
			host.GET("/homestays", homestayHandler.GetHomestayList)
			host.POST("/homestays", homestayHandler.CreateHomestay)
			host.GET("/homestays/stats", homestayHandler.GetHomestayStats)
			host.GET("/homestays/:id", homestayHandler.GetHomestayByID)
			host.PUT("/homestays/:id", homestayHandler.UpdateHomestay)
			host.DELETE("/homestays/:id", homestayHandler.DeleteHomestay)
			host.GET("/homestays/:id/stats", homestayHandler.GetHomestayStatsByID)
			
			// Room management
			host.GET("/rooms", roomHandler.GetRoomList)
			host.POST("/rooms", roomHandler.CreateRoom)
			host.GET("/rooms/:id", roomHandler.GetRoomByID)
			host.PUT("/rooms/:id", roomHandler.UpdateRoom)
			host.DELETE("/rooms/:id", roomHandler.DeleteRoom)
			
			// Room availability management
			host.POST("/rooms/availability", roomHandler.CreateAvailability)
			host.PUT("/rooms/availability/:id", roomHandler.UpdateAvailability)
			host.POST("/rooms/availability/bulk", roomHandler.BulkUpdateAvailability)
			
			// Room statistics
			host.GET("/homestays/:homestay_id/rooms/stats", roomHandler.GetRoomStats)
			
			// Legacy routes (tạm thời giữ lại)
			host.GET("/my-homestays", getMyHomestays)
			host.GET("/my-bookings", getMyBookings)
			host.PUT("/bookings/:id/approve", approveBooking)
			host.PUT("/bookings/:id/reject", rejectBooking)
		}

		// Guest routes (cần role guest)
		guest := api.Group("/guest")
		guest.Use(AuthMiddleware(serverCtx))
		guest.Use(RoleMiddleware("guest"))
		{
			guest.GET("/dashboard", getGuestDashboard)
		}
	}
}

// Placeholder handlers - sẽ được implement sau với business logic thực tế
func getHomestays(c *gin.Context) {
	http_response.ResponseSuccess(c, gin.H{"message": "Danh sách homestay"})
}

func getHomestayByID(c *gin.Context) {
	id := c.Param("id")
	http_response.ResponseSuccess(c, gin.H{"message": "Chi tiết homestay", "id": id})
}

func createHomestay(c *gin.Context) {
	http_response.ResponseSuccess(c, gin.H{"message": "Tạo homestay thành công"})
}

func updateHomestay(c *gin.Context) {
	id := c.Param("id")
	http_response.ResponseSuccess(c, gin.H{"message": "Cập nhật homestay thành công", "id": id})
}

func deleteHomestay(c *gin.Context) {
	id := c.Param("id")
	http_response.ResponseSuccess(c, gin.H{"message": "Xóa homestay thành công", "id": id})
}

func getBookings(c *gin.Context) {
	http_response.ResponseSuccess(c, gin.H{"message": "Danh sách booking"})
}

func createBooking(c *gin.Context) {
	http_response.ResponseSuccess(c, gin.H{"message": "Tạo booking thành công"})
}

func updateBooking(c *gin.Context) {
	id := c.Param("id")
	http_response.ResponseSuccess(c, gin.H{"message": "Cập nhật booking thành công", "id": id})
}

func deleteBooking(c *gin.Context) {
	id := c.Param("id")
	http_response.ResponseSuccess(c, gin.H{"message": "Xóa booking thành công", "id": id})
}

// Admin handlers
func getAdminDashboard(c *gin.Context) {
	http_response.ResponseSuccess(c, gin.H{"message": "Admin Dashboard"})
}

func getUsers(c *gin.Context) {
	http_response.ResponseSuccess(c, gin.H{"message": "Danh sách users"})
}

func getUserByID(c *gin.Context) {
	id := c.Param("id")
	http_response.ResponseSuccess(c, gin.H{"message": "Chi tiết user", "id": id})
}

func updateUser(c *gin.Context) {
	id := c.Param("id")
	http_response.ResponseSuccess(c, gin.H{"message": "Cập nhật user thành công", "id": id})
}

func deleteUser(c *gin.Context) {
	id := c.Param("id")
	http_response.ResponseSuccess(c, gin.H{"message": "Xóa user thành công", "id": id})
}

// Host handlers
func getHostDashboard(c *gin.Context) {
	http_response.ResponseSuccess(c, gin.H{"message": "Host Dashboard"})
}

func getMyHomestays(c *gin.Context) {
	http_response.ResponseSuccess(c, gin.H{"message": "Danh sách homestay của tôi"})
}

func getMyBookings(c *gin.Context) {
	http_response.ResponseSuccess(c, gin.H{"message": "Danh sách booking của tôi"})
}

func approveBooking(c *gin.Context) {
	id := c.Param("id")
	http_response.ResponseSuccess(c, gin.H{"message": "Phê duyệt booking thành công", "id": id})
}

func rejectBooking(c *gin.Context) {
	id := c.Param("id")
	http_response.ResponseSuccess(c, gin.H{"message": "Từ chối booking thành công", "id": id})
}

// Guest handlers
func getGuestDashboard(c *gin.Context) {
	http_response.ResponseSuccess(c, gin.H{"message": "Guest Dashboard"})
}
