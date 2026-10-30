const courseService = require("../services/courseService")
const ApiError = require("../utils/ApiError")

// 统一解析课程 ID
function parseCourseId(value) {
    const id = Number(value)

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new ApiError(400, "课程 ID 必须是正整数")
    }

    return id
}

// GET /api/students/:id/courses
function getCourses(req, res) {
    const courses = courseService.getCourses(Number(req.params.id))

    res.status(200).json({
        success: true,
        data: courses
    })
}

// POST /api/students/:id/courses
function createCourse(req, res) {
    const studentId = Number(req.params.id)
    const course = courseService.createCourse(studentId, req.body)

    res.status(201).json({
        success: true,
        message: "创建成功",
        data: course
    })
}

// PUT /api/students/:id/courses/:courseId
function updateCourse(req, res) {
    const course = courseService.updateCourse(
        Number(req.params.id),
        parseCourseId(req.params.courseId),
        req.body
    )

    res.status(200).json({
        success: true,
        message: "修改成功",
        data: course
    })
}

// DELETE /api/students/:id/courses/:courseId
function deleteCourse(req, res) {
    courseService.deleteCourse(
        Number(req.params.id),
        parseCourseId(req.params.courseId)
    )

    res.status(200).json({
        success: true,
        message: "删除成功"
    })
}

module.exports = { getCourses, createCourse, updateCourse, deleteCourse }
