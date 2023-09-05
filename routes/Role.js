const express = require('express')
const roleController = require('../controllers/Role')

const router = express.Router()

router.post('/', roleController.createRole)
router.get('/', roleController.getRoles)

module.exports = router