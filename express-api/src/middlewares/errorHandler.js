const ApiError = require("../utils/ApiError")

function errorHandler(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    }

    // JSON 格式错误
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            success: false,
            message: "JSON 格式不正确"
        })
    }

    console.error(err)

    res.status(500).json({
        success: false,
        message: "服务器内部错误"
    })
}

module.exports = errorHandler
