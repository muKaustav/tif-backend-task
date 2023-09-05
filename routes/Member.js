const express = require('express')
const memberController = require('../controllers/Member')
let { isAuth } = require('../middleware/isAuth')

const router = express.Router()

router.post('/', isAuth, memberController.addMember)
router.delete('/:id', isAuth, memberController.removeMember)

module.exports = router