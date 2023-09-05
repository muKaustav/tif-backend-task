require('dotenv').config()
const User = require('../models').User
const Role = require('../models').Role
const Member = require('../models').Member
const Community = require('../models').Community
const { Op } = require('sequelize')

let addMember = async (req, res, next) => {
    let user = req.user

    let community = await Community.findOne({
        where: {
            id: req.body.community,
        }
    })

    if (!community) {
        return res.status(404).json({
            status: false,
            errors: [{
                message: 'Community not found.',
                code: 'RESOURCE_NOT_FOUND',
            }]
        })
    } else if (community.owner !== user.id) {
        return res.status(403).json({
            status: false,
            errors: [{
                message: 'You are not authorized to perform this action.',
                code: 'NOT_ALLOWED_ACCESS',
            }]
        })
    }

    let member = await Member.findOne({
        where: {
            user: req.body.user,
            community: req.body.community,
        }
    })

    if (member) {
        return res.status(400).json({
            status: false,
            errors: [{
                message: 'User is already added in the community.',
                code: 'RESOURCE_EXISTS',
            }]
        })
    }

    let role = await Role.findOne({
        where: {
            id: req.body.role,
        }
    })

    if (!role) {
        return res.status(404).json({
            status: false,
            errors: [{
                message: 'Role not found.',
                code: 'RESOURCE_NOT_FOUND',
            }]
        })
    }

    let userExists = await User.findOne({
        where: {
            id: req.body.user,
        }
    })

    if (!userExists) {
        return res.status(404).json({
            status: false,
            errors: [{
                message: 'User not found.',
                code: 'RESOURCE_NOT_FOUND',
            }]
        })
    }

    let newMember = await Member.create({
        user: req.body.user,
        community: req.body.community,
        role: req.body.role,
    })

    return res.status(201).json({
        status: true,
        content: {
            data: {
                id: newMember.id,
                community: newMember.id,
                user: newMember.user,
                role: newMember.role,
                created_at: newMember.createdAt,
            }
        }
    })
}

let removeMember = async (req, res, next) => {
    let member = await Member.findOne({
        where: {
            id: req.params.id,
        }
    })

    if (!member) {
        return res.status(404).json({
            status: false,
            errors: [{
                message: 'Member not found.',
                code: 'RESOURCE_NOT_FOUND',
            }]
        })
    }

    let user = req.user

    let canDelete = await Member.findOne({
        where: {
            user: user.id,
            community: member.community,
            role: {
                [Op.or]: ['7104861668143292891', '7104861794554047313']
            }
        }
    })

    if (!canDelete) {
        return res.status(403).json({
            status: false,
            errors: [{
                message: 'You are not authorized to perform this action.',
                code: 'NOT_ALLOWED_ACCESS',
            }]
        })
    }

    await member.destroy()

    return res.status(200).json({
        status: true,
    })
}

module.exports = { addMember, removeMember }