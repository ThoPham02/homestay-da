package http_response

import (
	"github.com/gin-gonic/gin"
)

func ResponseJSON(c *gin.Context, statusCode int, data interface{}) {
	c.JSON(statusCode, data)
}

func ResponseRedirect(c *gin.Context, statusCode int, destination string) {
	c.Redirect(statusCode, destination)
}