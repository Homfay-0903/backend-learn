const env = require('../config/env')
const ApiError = require('../utils/ApiError')

function apiKeyAuth(req, res, next) {
    // 服务端自己都没配置密钥，说明部署配置有问题，不应该放行任何请求
    if (!env.apiKey) {
        return next(new ApiError(500, '服务端未配置 API_KEY'))
    }

    const providedKey = req.get('x-api-key')

    if (!providedKey) {
        return next(new ApiError(401, '缺少 x-api-key 请求头'))
    }

    if (providedKey !== env.apiKey) {
        return next(new ApiError(401, 'API Key 无效'))
    }

    next()
}

module.exports = apiKeyAuth
