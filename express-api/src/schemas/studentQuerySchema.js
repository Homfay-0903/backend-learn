const { z } = require('zod')

// 描述"查询学生列表"时，URL 查询参数应该满足的规则
// URL 上的参数永远是字符串（比如 ?page=1 拿到的是 "1" 而不是数字 1），
// 所以这里用 coerce 把字符串转换成需要的类型，再做范围校验
const studentQuerySchema = z.object({
    page: z.coerce.number().int('page 必须是整数').min(1, 'page 必须大于等于 1').default(1),
    pageSize: z.coerce.number().int('pageSize 必须是整数').min(1, 'pageSize 必须大于等于 1').max(100, 'pageSize 不能超过 100').default(10),
    major: z.string().trim().min(1).optional(),
    sortBy: z.enum(['id', 'name', 'age', 'major']).default('id'),
    order: z.enum(['asc', 'desc']).default('asc')
})

module.exports = studentQuerySchema
