const { z } = require('zod')

// 课程只需要一个名字；student_id 来自 URL 路径参数，不来自请求体，
// 所以 schema 里不定义它——这能防止请求体伪造归属关系
const courseSchema = z
    .object({
        name: z.string().trim().min(1, '课程名不能为空').max(50, '课程名最多 50 个字符')
    })
    .strict()

module.exports = courseSchema
