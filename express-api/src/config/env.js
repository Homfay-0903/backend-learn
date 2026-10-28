// 必须尽早加载 .env 文件，确保后面任何读取 process.env 的代码都能拿到配置值
require('dotenv').config()

module.exports = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    dbFileName: process.env.DB_FILE_NAME || 'students.db',
    // JWT 的签名密钥：绝对不能有默认值，缺失时认证中间件会直接拒绝所有请求（fail-closed）
    jwtSecret: process.env.JWT_SECRET,
    // token 的有效期，写成带单位的时间字符串，jsonwebtoken 库能直接识别
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h'
}
