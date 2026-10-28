const userService = require('../services/userService')

// POST /api/auth/register
async function register(req, res, next) {
    try {
        // 经过 validate(registerSchema) 中间件后，req.body 已经是校验通过的干净数据
        const user = userService.register(req.body)

        res.status(201).json({
            success: true,
            message: '注册成功',
            data: user
        })
    } catch (err) {
        next(err)
    }
}

// POST /api/auth/login
async function login(req, res, next) {
    try {
        const { token, user } = userService.login(req.body)

        res.json({
            success: true,
            message: '登录成功',
            data: { token, user }
        })
    } catch (err) {
        next(err)
    }
}

module.exports = { register, login }
