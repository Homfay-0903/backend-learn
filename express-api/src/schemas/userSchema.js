const { z } = require('zod')

// 注册时用较严的规则：用户名 3-30 个字符，密码至少 6 位
const registerSchema = z
    .object({
        username: z.string().trim().min(3, '用户名至少 3 个字符').max(30, '用户名最多 30 个字符'),
        password: z.string().min(6, '密码至少 6 位').max(128, '密码最多 128 位')
    })
    .strict()

// 登录时只需要非空即可：规则是注册时定的，登录时再校验一遍长度没有意义
const loginSchema = z
    .object({
        username: z.string().trim().min(1, '用户名不能为空'),
        password: z.string().min(1, '密码不能为空')
    })
    .strict()

module.exports = { registerSchema, loginSchema }
