const jwt = require('jsonwebtoken')

const env = require('../config/env')
const ApiError = require('../utils/ApiError')
const userModel = require('../models/userModel')
const { hashPassword, verifyPassword } = require('../utils/password')

function register({ username, password }) {
    // 用户名是登录凭证，重复会导致"同一个账号两个人都能登录"，必须唯一
    if (userModel.findByUsername(username)) {
        throw new ApiError(409, '用户名已被占用')
    }

    // 只把哈希值存进数据库，明文密码不落库
    const user = userModel.createUser({
        username,
        passwordHash: hashPassword(password)
    })

    // 返回给前端的数据里不能带 password_hash，即使是哈希也不应该外泄
    return { id: user.id, username: user.username }
}

function login({ username, password }) {
    const user = userModel.findByUsername(username)

    // 用户不存在和密码错误都返回同样的"用户名或密码错误"，
    // 如果分开提示，攻击者可以借助错误信息先枚举出哪些用户名是存在的
    if (!user || !verifyPassword(password, user.password_hash)) {
        throw new ApiError(401, '用户名或密码错误')
    }

    // 登录成功，签发 token
    // payload 里只放"被看到也无妨"的信息：用户 id、用户名、过期时间
    // expiresIn 由 jsonwebtoken 转成 exp 声明写进 token，验证时自动检查
    const token = jwt.sign(
        { sub: String(user.id), username: user.username },
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn }
    )

    return { token, user: { id: user.id, username: user.username } }
}

module.exports = { register, login }
