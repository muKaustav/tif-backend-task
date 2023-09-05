const express = require('express')
const userController = require('../controllers/User')

const router = express.Router()

router.post('/signin', userController.login)
router.post('/signup', userController.register)
router.get('/me', userController.getUserProfile)

module.exports = router