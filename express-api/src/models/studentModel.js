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
    addStudent,
    updateStudent,
    deleteStudent
}
