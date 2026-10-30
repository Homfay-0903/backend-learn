const db = require('../config/db')

//根据筛选条件查询学生列表（分页 + 排序）
function getAllStudents({ page, pageSize, major, sortBy, order }) {
    const whereClause = major ? 'WHERE major = ?' : ''
    const whereParams = major ? [major] : []
    const offset = (page - 1) * pageSize

    const rows = db.prepare(`
        SELECT * FROM students
        ${whereClause}
        ORDER BY ${sortBy} ${order}
        LIMIT ? OFFSET ?
    `).all(...whereParams, pageSize, offset)

    const { total } = db.prepare(`
        SELECT COUNT(*) AS total FROM students
        ${whereClause}
    `).get(...whereParams)

    return { rows, total }
}

//根据id获取学生
function getStudentById(id) {
    return db.prepare('SELECT * FROM students WHERE id = ?').get(id)
}

// 查询学生详情（附带课程列表）。
// LEFT JOIN：即使学生没有课程也要返回学生本身（NULL 填充）；
// 如果用 INNER JOIN，没有课程的学生会被整个过滤掉。
// 一行学生 × N 门课会膨胀成 N 行，所以自己按 id 聚合成嵌套结构
function getStudentWithCourses(id) {
    const rows = db.prepare(`
        SELECT s.id AS student_id, s.name, s.age, s.major,
               c.id AS course_id, c.name AS course_name
        FROM students s
        LEFT JOIN courses c ON c.student_id = s.id
        WHERE s.id = ?
        ORDER BY c.id
    `).all(id)

    if (rows.length === 0) {
        return null
    }

    const first = rows[0]

    return {
        id: first.student_id,
        name: first.name,
        age: first.age,
        major: first.major,
        courses: rows
            .filter((row) => row.course_id !== null)
            .map((row) => ({ id: row.course_id, name: row.course_name }))
    }
}

//添加学生
function addStudent(data) {
    const { name, age, major } = data

    const insert = db.prepare(
        'INSERT INTO students (name, age, major) VALUES (?, ?, ?)'
    )
    const result = insert.run(name, age, major)

    return getStudentById(Number(result.lastInsertRowid))
}

//更新学生
function updateStudent(id, data) {
    const { name, age, major } = data

    const update = db.prepare(
        'UPDATE students SET name = ?, age = ?, major = ? WHERE id = ?'
    )
    const result = update.run(name, age, major, id)

    if (result.changes === 0) {
        return null
    }

    return getStudentById(id)
}

//删除学生
function deleteStudent(id) {
    const student = getStudentById(id)

    if (!student) {
        return null
    }

    db.prepare('DELETE FROM students WHERE id = ?').run(id)
    return student
}

module.exports = {
    getAllStudents,
    getStudentById,
    getStudentWithCourses,
    addStudent,
    updateStudent,
    deleteStudent
}
