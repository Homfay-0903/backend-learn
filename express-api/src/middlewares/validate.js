const ApiError = require('../utils/ApiError')

// 返回一个中间件：用传入的 schema 去校验 req[target]
// target 默认是 'body'，查询参数场景下传 'query'
function validate(schema, target = 'body') {
    return (req, res, next) => {
        const result = schema.safeParse(req[target])

        if (!result.success) {
            const firstIssue = result.error.issues[0]
            return next(new ApiError(400, firstIssue.message))
        }

        if (target === 'query') {
            // Express 5 里 req.query 是只读 getter，不能直接赋值覆盖，
            // 校验后的数据（含默认值、类型转换结果）单独挂在 req.validatedQuery 上
            req.validatedQuery = result.data
        } else {
            // req.body 是 express.json() 挂上去的普通属性，可以正常覆盖
            req[target] = result.data
        }

        next()
    }
}

module.exports = validate
