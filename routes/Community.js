const express = require('express')
const communityController = require('../controllers/Community')
let { isAuth } = require('../middleware/isAuth')

const router = express.Router()

router.post('/', isAuth, communityController.createCommunity)
router.get('/', communityController.getCommunities)
router.get('/:id/members', communityController.getCommunityMembers)
router.get('/me/owner', isAuth, communityController.getMyCommunitiesAsOwner)
router.get('/me/member', isAuth, communityController.getMyCommunitiesAsMember)

module.exports = router