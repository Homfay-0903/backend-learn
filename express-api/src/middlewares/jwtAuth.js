const jwt = require('jsonwebtoken')

const env = require('../config/env')
const ApiError = require('../utils/ApiError')

function jwtAuth(req, res, next) {
    // 服务端没配置签名密钥，说明部署配置有问题，不应该放行任何请求
    if (!env.jwtSecret) {
        return next(new ApiError(500, '服务端未配置 JWT_SECRET'))
    }

    // token 放在 Authorization 请求头里，标准格式是 "Bearer <token>"
    const authHeader = req.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError(401, '缺少 Authorization: Bearer <token> 请求头'))
    }

    // 去掉 "Bearer " 前缀，取出 token 本体
    const token = authHeader.slice('Bearer '.length)

    try {
        // verify 会同时做两件事：用密钥重算签名比对（防篡改）、检查 exp 是否过期
        // 签名不对或已过期都会抛异常，所以用 try/catch 包住
        const payload = jwt.verify(token, env.jwtSecret)

        // 验证通过后，把"当前登录用户是谁"挂到 req 上，后面的中间件和控制器都能读到
        req.user = { id: payload.sub, username: payload.username }

        next()
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return next(new ApiError(401, 'token 已过期，请重新登录'))
        }
        return next(new ApiError(401, 'token 无效'))
    }
}

module.exports = jwtAuth
