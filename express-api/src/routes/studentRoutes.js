const express = require("express")
const studentController = require("../controllers/studentController")

const router = express.Router()

// 查询全部学生
router.get("/", studentController.getAllStudents)

// 查询单个学生
router.get("/:id", studentController.getStudentById)

// 新增学生
router.post("/", studentController.createStudent)

// 修改学生
router.put("/:id", studentController.updateStudent)

// 删除学生
router.delete("/:id", studentController.deleteStudent)

module.exports = router
