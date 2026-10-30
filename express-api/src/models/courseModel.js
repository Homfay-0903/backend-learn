const db = require('../config/db')

// 查询某个学生的全部课程
function getCoursesByStudentId(studentId) {
    return db.prepare(
        'SELECT id, name, student_id AS studentId FROM courses WHERE student_id = ? ORDER BY id'
    ).all(studentId)
}

// 添加课程（先在 service 层确认学生存在，这里只管插入）
function addCourse({ name, studentId }) {
    const result = db.prepare(
        'INSERT INTO courses (name, student_id) VALUES (?, ?)'
    ).run(name, studentId)

    return db.prepare(
        'SELECT id, name, student_id AS studentId FROM courses WHERE id = ?'
    ).get(Number(result.lastInsertRowid))
}

// 修改课程（属于指定学生的课程才会被改到，防止跨学生篡改）
function updateCourse(id, studentId, data) {
    const result = db.prepare(
        'UPDATE courses SET name = ? WHERE id = ? AND student_id = ?'
    ).run(data.name, id, studentId)

    if (result.changes === 0) {
        return null
    }

    return db.prepare(
        'SELECT id, name, student_id AS studentId FROM courses WHERE id = ?'
    ).get(id)
}

// 删除课程（同样限定学生归属）
function deleteCourse(id, studentId) {
    const course = db.prepare(
        'SELECT id, name, student_id AS studentId FROM courses WHERE id = ? AND student_id = ?'
    ).get(id, studentId)

    if (!course) {
        return null
    }

    db.prepare('DELETE FROM courses WHERE id = ?').run(id)
    return course
}

module.exports = {
    getCoursesByStudentId,
    addCourse,
    updateCourse,
    deleteCourse
}
