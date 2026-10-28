const express = require("express")

const studentRoutes = require("./routes/studentRoutes")
const userRoutes = require("./routes/userRoutes")
const errorHandler = require("./middlewares/errorHandler")
const jwtAuth = require("./middlewares/jwtAuth")

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

// 注册认证相关的公开接口（注册、登录）
app.use("/api/auth", userRoutes)

// 学生接口统一要求 JWT 认证（取代之前的 API Key）
app.use("/api/students", jwtAuth, studentRoutes)

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
