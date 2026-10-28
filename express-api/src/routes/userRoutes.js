const express = require('express')

const userController = require('../controllers/userController')
const validate = require('../middlewares/validate')
const { registerSchema, loginSchema } = require('../schemas/userSchema')

const router = express.Router()

// 注册和登录本身当然是公开接口：还没登录的人才有必要访问它们
router.post('/register', validate(registerSchema), userController.register)
router.post('/login', validate(loginSchema), userController.login)

module.exports = router
