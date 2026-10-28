process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret-0123456789abcdef0123456789abcdef'

const request = require('supertest')
const app = require('../src/app')
const db = require('../src/config/db')

// 每个测试用例开始前，把数据库重置成固定的初始状态，
// 再注册并登录一个测试用户，拿到后续业务接口要用的 token
let token = ''

beforeEach(async () => {
    db.seedDefaults()

    await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'test123456' })

    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'test123456' })

    token = loginRes.body.data.token
})

// 封装一层，每次发请求自动带上 Authorization: Bearer <token>，
// 避免每条测试都重复写 .set(...)
function authedRequest() {
    const agent = request(app)
    const methods = ['get', 'post', 'put', 'delete']

    const wrapped = {}
    methods.forEach((method) => {
        wrapped[method] = (url) => agent[method](url).set('Authorization', `Bearer ${token}`)
    })

    return wrapped
}

describe('JWT 认证', () => {
    test('不带 Authorization 请求头应该返回 401', async () => {
        const res = await request(app).get('/api/students')

        expect(res.status).toBe(401)
        expect(res.body.success).toBe(false)
    })

    test('携带格式错误的 Authorization 头应该返回 401', async () => {
        const res = await request(app)
            .get('/api/students')
            .set('Authorization', 'Bearer not-a-real-token')

        expect(res.status).toBe(401)
    })

    test('携带正确的 token 应该放行', async () => {
        const res = await authedRequest().get('/api/students')

        expect(res.status).toBe(200)
    })

    test('健康检查接口不需要认证', async () => {
        const res = await request(app).get('/health')

        expect(res.status).toBe(200)
    })
})

describe('GET /api/students', () => {
    test('应该返回全部学生列表及分页信息', async () => {
        const res = await authedRequest().get('/api/students')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toHaveLength(2)
        expect(res.body.data[0].name).toBe('张三')
        expect(res.body.pagination).toEqual({
            page: 1,
            pageSize: 10,
            total: 2,
            totalPages: 1
        })
    })

    test('pageSize 应该限制返回条数', async () => {
        const res = await authedRequest().get('/api/students?pageSize=1')

        expect(res.status).toBe(200)
        expect(res.body.data).toHaveLength(1)
        expect(res.body.pagination.totalPages).toBe(2)
    })

    test('按 major 过滤应该只返回匹配的学生', async () => {
        const res = await authedRequest().get('/api/students?major=软件工程')

        expect(res.status).toBe(200)
        expect(res.body.data).toHaveLength(1)
        expect(res.body.data[0].name).toBe('李四')
    })

    test('按 age 降序排序应该生效', async () => {
        const res = await authedRequest().get('/api/students?sortBy=age&order=desc')

        expect(res.status).toBe(200)
        expect(res.body.data[0].name).toBe('李四')
        expect(res.body.data[1].name).toBe('张三')
    })

    test('sortBy 传入白名单外的字段应该被拦截，返回 400', async () => {
        const res = await authedRequest().get('/api/students?sortBy=password')

        expect(res.status).toBe(400)
    })
})

describe('GET /api/students/:id', () => {
    test('查询存在的学生应该返回该学生数据', async () => {
        const res = await authedRequest().get('/api/students/1')

        expect(res.status).toBe(200)
        expect(res.body.data.name).toBe('张三')
    })

    test('查询不存在的学生应该返回 404', async () => {
        const res = await authedRequest().get('/api/students/999')

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
    })
})

describe('POST /api/students', () => {
    test('提交合法数据应该创建成功', async () => {
        const res = await authedRequest()
            .post('/api/students')
            .send({ name: '王五', age: 22, major: '物理' })

        expect(res.status).toBe(201)
        expect(res.body.data.id).toBe(3)
        expect(res.body.data.name).toBe('王五')
    })

    test('年龄超出范围应该被拦截，返回 400', async () => {
        const res = await authedRequest()
            .post('/api/students')
            .send({ name: '王五', age: 200, major: '物理' })

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    test('姓名类型错误应该被拦截，返回 400', async () => {
        const res = await authedRequest()
            .post('/api/students')
            .send({ name: 123, age: 20, major: '物理' })

        expect(res.status).toBe(400)
    })

    test('携带 schema 未定义的多余字段应该被拦截', async () => {
        const res = await authedRequest()
            .post('/api/students')
            .send({ name: '王五', age: 20, major: '物理', password: '123456' })

        expect(res.status).toBe(400)
    })
})

describe('PUT /api/students/:id', () => {
    test('更新存在的学生应该成功', async () => {
        const res = await authedRequest()
            .put('/api/students/1')
            .send({ name: '张三三', age: 21, major: '计算机科学' })

        expect(res.status).toBe(200)
        expect(res.body.data.name).toBe('张三三')
    })

    test('更新不存在的学生应该返回 404', async () => {
        const res = await authedRequest()
            .put('/api/students/999')
            .send({ name: '张三三', age: 21, major: '计算机科学' })

        expect(res.status).toBe(404)
    })
})

describe('DELETE /api/students/:id', () => {
    test('删除存在的学生应该成功，再查询应该返回 404', async () => {
        const deleteRes = await authedRequest().delete('/api/students/1')
        expect(deleteRes.status).toBe(200)

        const getRes = await authedRequest().get('/api/students/1')
        expect(getRes.status).toBe(404)
    })

    test('删除不存在的学生应该返回 404', async () => {
        const res = await authedRequest().delete('/api/students/999')

        expect(res.status).toBe(404)
    })
})
