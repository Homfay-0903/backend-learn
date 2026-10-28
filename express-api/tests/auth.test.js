process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret'

const request = require('supertest')
const app = require('../src/app')
const db = require('../src/config/db')

// 每个测试用例开始前重置数据库，认证相关测试自己管理用户数据
beforeEach(() => {
    db.seedDefaults()
})

describe('POST /api/auth/register', () => {
    test('提交合法的用户名和密码应该注册成功', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'zhangsan', password: 'secret123' })

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toEqual({ id: 1, username: 'zhangsan' })
    })

    test('注册结果里不能出现密码相关的字段', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'zhangsan', password: 'secret123' })

        expect(res.body.data.password).toBeUndefined()
        expect(res.body.data.passwordHash).toBeUndefined()
        expect(res.body.data.password_hash).toBeUndefined()
    })

    test('用户名已被占用应该返回 409', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ username: 'zhangsan', password: 'secret123' })

        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'zhangsan', password: 'another456' })

        expect(res.status).toBe(409)
    })

    test('密码太短应该被拦截，返回 400', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'zhangsan', password: '123' })

        expect(res.status).toBe(400)
    })
})

describe('POST /api/auth/login', () => {
    test('用正确的用户名和密码登录应该返回 token', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ username: 'zhangsan', password: 'secret123' })

        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'zhangsan', password: 'secret123' })

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(typeof res.body.data.token).toBe('string')
        expect(res.body.data.user).toEqual({ id: 1, username: 'zhangsan' })
    })

    test('拿登录返回的 token 可以访问受保护的接口', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ username: 'zhangsan', password: 'secret123' })

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ username: 'zhangsan', password: 'secret123' })

        const res = await request(app)
            .get('/api/students')
            .set('Authorization', `Bearer ${loginRes.body.data.token}`)

        expect(res.status).toBe(200)
    })

    test('密码错误应该返回 401，且提示不能暴露"是密码错了"', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ username: 'zhangsan', password: 'secret123' })

        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'zhangsan', password: 'wrong-password' })

        expect(res.status).toBe(401)
        expect(res.body.message).toBe('用户名或密码错误')
    })

    test('用户名不存在应该返回同样的 401 提示，不能和密码错误区分开', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'no-such-user', password: 'whatever123' })

        expect(res.status).toBe(401)
        expect(res.body.message).toBe('用户名或密码错误')
    })
})
