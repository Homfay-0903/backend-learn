process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret-0123456789abcdef0123456789abcdef'

const request = require('supertest')
const app = require('../src/app')
const db = require('../src/config/db')

// 复用与业务测试相同的"注册 + 登录"准备流程
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

function authedRequest() {
    const agent = request(app)
    const methods = ['get', 'post', 'put', 'delete']

    const wrapped = {}
    methods.forEach((method) => {
        wrapped[method] = (url) => agent[method](url).set('Authorization', `Bearer ${token}`)
    })

    return wrapped
}

describe('GET /api/students/:id/courses', () => {
    test('应该返回指定学生的全部课程', async () => {
        const res = await authedRequest().get('/api/students/1/courses')

        expect(res.status).toBe(200)
        expect(res.body.data).toEqual([
            { id: 1, name: '高等数学', studentId: 1 },
            { id: 2, name: '大学英语', studentId: 1 }
        ])
    })

    test('学生不存在应该返回 404', async () => {
        const res = await authedRequest().get('/api/students/999/courses')

        expect(res.status).toBe(404)
    })

    test('没有课程的学生应该返回空数组', async () => {
        // 先给王五建个号... 不，直接建一个新学生，不给它加课程
        const createRes = await authedRequest()
            .post('/api/students')
            .send({ name: '王五', age: 22, major: '物理' })

        const res = await authedRequest().get(`/api/students/${createRes.body.data.id}/courses`)

        expect(res.status).toBe(200)
        expect(res.body.data).toEqual([])
    })
})

describe('POST /api/students/:id/courses', () => {
    test('应该为指定学生创建课程', async () => {
        const res = await authedRequest()
            .post('/api/students/1/courses')
            .send({ name: '线性代数' })

        expect(res.status).toBe(201)
        expect(res.body.data).toEqual({ id: 4, name: '线性代数', studentId: 1 })
    })

    test('student_id 不应该能通过请求体伪造', async () => {
        const res = await authedRequest()
            .post('/api/students/1/courses')
            .send({ name: '线性代数', studentId: 2 })

        expect(res.status).toBe(400)
    })

    test('课程名为空应该返回 400', async () => {
        const res = await authedRequest()
            .post('/api/students/1/courses')
            .send({ name: '  ' })

        expect(res.status).toBe(400)
    })
})

describe('PUT /api/students/:id/courses/:courseId', () => {
    test('应该修改指定学生的课程', async () => {
        const res = await authedRequest()
            .put('/api/students/1/courses/1')
            .send({ name: '高等数学(下)' })

        expect(res.status).toBe(200)
        expect(res.body.data.name).toBe('高等数学(下)')
    })

    test('课程不属于该学生时应该返回 404', async () => {
        // 课程 3 属于学生 2，拿学生 1 的路径去改应该查无此课
        const res = await authedRequest()
            .put('/api/students/1/courses/3')
            .send({ name: '越权修改' })

        expect(res.status).toBe(404)
    })

    test('课程不存在应该返回 404', async () => {
        const res = await authedRequest()
            .put('/api/students/1/courses/999')
            .send({ name: '不存在的课' })

        expect(res.status).toBe(404)
    })
})

describe('DELETE /api/students/:id/courses/:courseId', () => {
    test('应该删除指定学生的课程', async () => {
        const res = await authedRequest().delete('/api/students/1/courses/1')

        expect(res.status).toBe(200)

        const listRes = await authedRequest().get('/api/students/1/courses')
        expect(listRes.body.data).toHaveLength(1)
    })

    test('课程不属于该学生时应该返回 404', async () => {
        const res = await authedRequest().delete('/api/students/1/courses/3')

        expect(res.status).toBe(404)
    })
})

describe('级联删除与外键约束', () => {
    test('删除学生后其课程应该一并被删除', async () => {
        await authedRequest().delete('/api/students/1')

        const res = await authedRequest().get('/api/students/1/courses')

        // 学生没了，返回 404；直接查库确认课程也清空了
        expect(res.status).toBe(404)
    })

    test('学生详情应该附带课程列表（LEFT JOIN 聚合）', async () => {
        const res = await authedRequest().get('/api/students/1')

        expect(res.status).toBe(200)
        expect(res.body.data.name).toBe('张三')
        expect(res.body.data.courses).toEqual([
            { id: 1, name: '高等数学' },
            { id: 2, name: '大学英语' }
        ])
    })
})
