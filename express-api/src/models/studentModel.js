const db = require('../config/db')

//获取全部学生
function getAllStudents() {
    return db.prepare('SELECT * FROM students').all()
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
