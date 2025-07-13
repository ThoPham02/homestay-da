package http_response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// ResponseResult chứa thông tin kết quả
type ResponseResult struct {
	Code    int    `json:"code" example:"0"`
	Message string `json:"message" example:"Thành công"`
}

// ResponseData chứa dữ liệu thực tế
type ResponseData struct {
	Result ResponseResult `json:"result"`
	Data   interface{}    `json:"data"`
}

// ResponseJSON trả về response với format chuẩn
func ResponseJSON(c *gin.Context, code int, message string, data interface{}) {
	response := ResponseData{
		Result: ResponseResult{
			Code:    code,
			Message: message,
		},
		Data: data,
	}
	c.JSON(http.StatusOK, response)
}

// ResponseSuccess trả về response thành công
func ResponseSuccess(c *gin.Context, data interface{}) {
	ResponseJSON(c, 0, "Thành công", data)
}

// ResponseError trả về response lỗi
func ResponseError(c *gin.Context, code int, message string) {
	ResponseJSON(c, code, message, nil)
}

// ResponseRedirect trả về redirect
func ResponseRedirect(c *gin.Context, statusCode int, destination string) {
	c.Redirect(statusCode, destination)
}

// ResponseBadRequest trả về lỗi 400
func ResponseBadRequest(c *gin.Context, message string) {
	ResponseError(c, 400, message)
}

// ResponseUnauthorized trả về lỗi 401
func ResponseUnauthorized(c *gin.Context, message string) {
	ResponseError(c, 401, message)
}

// ResponseForbidden trả về lỗi 403
func ResponseForbidden(c *gin.Context, message string) {
	ResponseError(c, 403, message)
}

// ResponseNotFound trả về lỗi 404
func ResponseNotFound(c *gin.Context, message string) {
	ResponseError(c, 404, message)
}

// ResponseInternalServerError trả về lỗi 500
func ResponseInternalServerError(c *gin.Context, message string) {
	ResponseError(c, 500, message)
}