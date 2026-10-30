const courseModel = require('../models/courseModel')
const studentService = require('./studentService')
const ApiError = require('../utils/ApiError')

// 复用学生服务的 404 判断，保证"学生不存在"的语义和主资源一致
function requireStudent(studentId) {
    return studentService.getStudentById(studentId)
}

// 查询学生的全部课程
function getCourses(studentId) {
    requireStudent(studentId)
    return courseModel.getCoursesByStudentId(studentId)
}

// 添加课程
function createCourse(studentId, courseData) {
    requireStudent(studentId)
    return courseModel.addCourse({ ...courseData, studentId })
}

// 修改课程
function updateCourse(studentId, courseId, courseData) {
    requireStudent(studentId)

    const updated = courseModel.updateCourse(courseId, studentId, courseData)

    if (!updated) {
        throw new ApiError(404, '课程不存在')
    }

    return updated
}

// 删除课程
function deleteCourse(studentId, courseId) {
    requireStudent(studentId)

    const deleted = courseModel.deleteCourse(courseId, studentId)

    if (!deleted) {
        throw new ApiError(404, '课程不存在')
    }

    return deleted
}

module.exports = { getCourses, createCourse, updateCourse, deleteCourse }
