const express = require("express")
const courseController = require("../controllers/courseController")
const validate = require("../middlewares/validate")
const courseSchema = require("../schemas/courseSchema")

// 嵌套路由：课程是学生的子资源，URL 里体现归属关系
const router = express.Router({ mergeParams: true })

router.get("/", courseController.getCourses)
router.post("/", validate(courseSchema), courseController.createCourse)
router.put("/:courseId", validate(courseSchema), courseController.updateCourse)
router.delete("/:courseId", courseController.deleteCourse)

module.exports = router
