const studentModel = require('../models/studentModel')
const ApiError = require('../utils/ApiError')

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
    return studentModel.addStudent(studentData)
}

// 更新学生
function updateStudent(id, studentData) {
    const updatedStudent = studentModel.updateStudent(id, studentData)

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