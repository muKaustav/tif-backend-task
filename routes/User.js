const express = require('express')
const userController = require('../controllers/User')
let { isAuth } = require('../middleware/isAuth')

const router = express.Router()

router.post('/signin', userController.login)
router.post('/signup', userController.register)
router.get('/me', isAuth, userController.getUserProfile)

module.exports = router