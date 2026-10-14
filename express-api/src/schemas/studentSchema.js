const { z } = require('zod')

// 描述"创建/更新学生"时，请求体应该满足的规则
const studentSchema = z.object({
    name: z.string().trim().min(1, '姓名是必填字段，且必须是字符串'),
    age: z.number().int('年龄必须是整数').min(1, '年龄必须大于等于 1').max(150, '年龄必须小于等于 150'),
    major: z.string().trim().min(1, '专业是必填字段，且必须是字符串')
}).strict()

module.exports = studentSchema
