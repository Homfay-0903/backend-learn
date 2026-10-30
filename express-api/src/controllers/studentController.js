const studentService = require("../services/studentService")
const ApiError = require("../utils/ApiError")

// 统一解析学生 ID
function parseStudentId(value) {
    const id = Number(value)

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new ApiError(400, "学生 ID 必须是正整数")
    }

    return id
}

// GET /api/students
function getAllStudents(req, res) {
    const result = studentService.getAllStudents(req.validatedQuery)

    res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
    })
}

// GET /api/students/:id（返回学生详情，附带课程列表）
function getStudentById(req, res) {
    const id = parseStudentId(req.params.id)
    const student = studentService.getStudentWithCourses(id)

    res.status(200).json({
        success: true,
        data: student
    })
}

// POST /api/students
function createStudent(req, res) {
    const student = studentService.createStudent(req.body)

    res.status(201).json({
        success: true,
        message: "创建成功",
        data: student
    })
}

// PUT /api/students/:id
function updateStudent(req, res) {
    const id = parseStudentId(req.params.id)
    const student = studentService.updateStudent(id, req.body)

    res.status(200).json({
        success: true,
        message: "修改成功",
        data: student
    })
}

// DELETE /api/students/:id
function deleteStudent(req, res) {
    const id = parseStudentId(req.params.id)
    studentService.deleteStudent(id)

    res.status(200).json({
        success: true,
        message: "删除成功"
    })
}

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
}
