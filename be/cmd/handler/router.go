package handler

import (
	"context"
	"homestay-be/cmd/logic"
	"homestay-be/cmd/middleware"
	"homestay-be/cmd/svc"
	"homestay-be/core/response"

	"github.com/gin-gonic/gin"
)

// RegisterHandlers đăng ký tất cả các routes và handlers
func RegisterHandlers(router *gin.Engine, serverCtx *svc.ServiceContext) {
	// Middleware
	router.Use(middleware.CORSMiddleware())

	// Health check
	router.GET("/health", func(c *gin.Context) {
		response.ResponseSuccess(c, gin.H{"status": "ok"})
	})

	// API routes
	api := router.Group("/api")
	{
		// Auth routes (public)
		authHandler := NewAuthHandler(serverCtx)
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}

		// Protected routes (cần authentication)
		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware(serverCtx))
		{
			// User profile
			protected.GET("/auth/profile", authHandler.GetProfile)
			protected.POST("/auth/logout", authHandler.Logout)
		}

		// Admin routes (cần role admin)
		admin := api.Group("/admin")
		admin.Use(middleware.AuthMiddleware(serverCtx))
		admin.Use(middleware.RoleMiddleware("admin"))
		{
			// TODO: Add admin-specific routes
		}

		// Host routes (cần role host hoặc admin)
		host := api.Group("/host")
		host.Use(middleware.AuthMiddleware(serverCtx))
		host.Use(middleware.RoleMiddleware("host", "admin"))
		{
			// Init context for logic layers
			ctx := context.Background()

			// Initialize logic layers
			homestayLogic := logic.NewHomestayLogic(ctx, serverCtx)
			roomLogic := logic.NewRoomLogic(ctx, serverCtx)

			// Initialize handlers
			homestayHandler := NewHomestayHandler(homestayLogic)
			roomHandler := NewRoomHandler(roomLogic)

			// Homestay management
			host.GET("/homestays", homestayHandler.GetHomestayList)
			host.POST("/homestays", homestayHandler.CreateHomestay)
			host.GET("/homestays/stats", homestayHandler.GetHomestayStats)
			host.GET("/homestays/:id", homestayHandler.GetHomestayByID)
			host.PUT("/homestays/:id", homestayHandler.UpdateHomestay)
			host.DELETE("/homestays/:id", homestayHandler.DeleteHomestay)
			host.GET("/homestays/:id/stats", homestayHandler.GetHomestayStatsByID)

			// Room management
			host.POST("/rooms", roomHandler.CreateRoom)
			host.GET("/rooms", roomHandler.GetRoomList)
			host.GET("/rooms/:id", roomHandler.GetRoomByID)
			host.PUT("/rooms/:id", roomHandler.UpdateRoom)
			host.DELETE("/rooms/:id", roomHandler.DeleteRoom)

			// Room availability
			host.POST("/rooms/availability", roomHandler.CreateAvailability)
			host.PUT("/rooms/availability/:id", roomHandler.UpdateAvailability)

			// Room statistics
			host.GET("/homestays/:id/rooms/stats", roomHandler.GetRoomStats)
		}

		// Guest routes (cần role guest)
		guest := api.Group("/guest")
		guest.Use(middleware.AuthMiddleware(serverCtx))
		guest.Use(middleware.RoleMiddleware("guest"))
		{
			// TODO: Add guest-specific routes
		}
	}

	// 404 handler
	router.NoRoute(func(c *gin.Context) {
		response.ResponseError(c, response.NotFound, response.MsgAPIEndpointNotFound)
	})
}
