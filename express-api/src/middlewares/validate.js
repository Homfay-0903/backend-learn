const ApiError = require('../utils/ApiError')

// 返回一个中间件：用传入的 schema 去校验 req.body
function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body)

        if (!result.success) {
            const firstIssue = result.error.issues[0]
            return next(new ApiError(400, firstIssue.message))
        }

        // 校验通过后，用 Zod 处理过的数据（比如 trim 过的字符串）替换原始 req.body
        req.body = result.data
        next()
    }
}

module.exports = validate
