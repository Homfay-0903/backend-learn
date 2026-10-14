const studentModel = require('../models/studentModel')
const ApiError = require('../utils/ApiError')

//验证学生数据
function validateStudentData(studentData) {
    if (!studentData || typeof studentData !== 'object' || Array.isArray(studentData)) {
        throw new ApiError(400, '请求体必须是 JSON 对象')
    }

    const { name, age, major } = studentData

    if (typeof name !== 'string' || !name.trim()) {
        throw new ApiError(400, '姓名是必填字段，且必须是字符串')
    }

    if (typeof age !== 'number' || age < 1 || age > 150) {
        throw new ApiError(400, '年龄是必填字段，且必须是 1-150 之间的正整数')
    }

    if (typeof major !== 'string' || !major.trim()) {
        throw new ApiError(400, '专业是必填字段，且必须是字符串')
    }

    return {
        name: name.trim(),
        age,
        major: major.trim()
    }
}

// 查询全部学生
function getAllStudents() {
    return studentModel.getAllStudents()
}

// 根据id查询学生
function getStudentById(id) {
    const student = studentModel.getStudentById(id)

    if (!student) {
        throw new ApiError(404, '学生不存在')
    }

    return student
}

// 添加学生
function createStudent(studentData) {
    const validatedData = validateStudentData(studentData)
    return studentModel.addStudent(validatedData)
}

// 更新学生
function updateStudent(id, studentData) {
    const validatedData = validateStudentData(studentData)
    const updatedStudent = studentModel.updateStudent(id, validatedData)

    if (!updatedStudent) {
        throw new ApiError(404, '学生不存在')
    }

    return updatedStudent
}

// 删除学生
function deleteStudent(id) {
    const deletedStudent = studentModel.deleteStudent(id)

    if (!deletedStudent) {
        throw new ApiError(404, '学生不存在')
    }

    return deletedStudent
}

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
}