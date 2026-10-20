const express = require("express")

const studentRoutes = require("./routes/studentRoutes")
const errorHandler = require("./middlewares/errorHandler")
const apiKeyAuth = require("./middlewares/apiKeyAuth")

const app = express()

// 解析 JSON 请求体
app.use(express.json())

// 健康检查接口：不需要认证，方便监控系统探活
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "服务运行正常"
    })
})

// 注册学生路由（整个模块统一要求 API Key 认证）
app.use("/api/students", apiKeyAuth, studentRoutes)

// 处理不存在的路由
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "接口不存在"
    })
})

// 错误处理中间件必须放在最后
app.use(errorHandler)

module.exports = app