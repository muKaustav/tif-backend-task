require('dotenv').config()
const Community = require('../models').Community

let createCommunity = async (req, res, next) => { }

let getCommunities = async (req, res, next) => { }

let getCommunityMembers = async (req, res, next) => { }

let getMyCommunitiesAsOwner = async (req, res, next) => { }

let getMyCommunitiesAsMember = async (req, res, next) => { }

module.exports = { createCommunity, getCommunities, getCommunityMembers, getMyCommunitiesAsOwner, getMyCommunitiesAsMember }