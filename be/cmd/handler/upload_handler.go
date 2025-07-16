package handler

import (
	"homestay-be/cmd/logic"
	"homestay-be/cmd/svc"
	"homestay-be/core/response"

	"github.com/gin-gonic/gin"
)

type UploadFileHandler struct {
	svcCtx *svc.ServiceContext
}

func NewUploadFileHandler(svcCtx *svc.ServiceContext) *UploadFileHandler {
	return &UploadFileHandler{
		svcCtx: svcCtx,
	}
}

func (h *UploadFileHandler) UploadFile(c *gin.Context) {
	ctx := c.Request.Context()

	// Lấy file từ form-data
	file, err := c.FormFile("file")
	if err != nil {
		response.ResponseError(c, response.BadRequest, "File không hợp lệ")
		return
	}

	// Lấy user ID từ context
	userID, exists := c.Get("user_id")
	if !exists {
		response.ResponseError(c, response.Unauthorized, "User không hợp lệ")
		return
	}
	hostID := userID.(int64)

	// Gọi logic xử lý upload
	logic := logic.NewUploadFileLogic(ctx, h.svcCtx, file)
	resp, err := logic.UploadFile(ctx, hostID)
	if err != nil {
		response.ResponseError(c, response.InternalServerError, err.Error())
		return
	}

	response.ResponseSuccess(c, resp)
}
