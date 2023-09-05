const express = require('express')
const communityController = require('../controllers/Community')

const router = express.Router()

router.post('/', communityController.createCommunity)
router.get('/', communityController.getCommunities)
router.get('/:id/members', communityController.getCommunityMembers)
router.get('/me/owner', communityController.getMyCommunitiesAsOwner)
router.get('me/member', communityController.getMyCommunitiesAsMember)

module.exports = router