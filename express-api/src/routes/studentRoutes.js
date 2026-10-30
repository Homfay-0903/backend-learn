const express = require("express")
const studentController = require("../controllers/studentController")
const validate = require("../middlewares/validate")
const studentSchema = require("../schemas/studentSchema")
const studentQuerySchema = require("../schemas/studentQuerySchema")
const courseRoutes = require("./courseRoutes")

const router = express.Router()

// 课程作为学生的子资源，嵌套挂载；mergeParams 让 :id 参数能传进去
router.use("/:id/courses", courseRoutes)

// 查询学生列表（支持分页 / 过滤 / 排序）
router.get("/", validate(studentQuerySchema, "query"), studentController.getAllStudents)

// 查询单个学生
router.get("/:id", studentController.getStudentById)

// 新增学生
router.post("/", validate(studentSchema), studentController.createStudent)

// 修改学生
router.put("/:id", validate(studentSchema), studentController.updateStudent)

// 删除学生
router.delete("/:id", studentController.deleteStudent)

module.exports = router
