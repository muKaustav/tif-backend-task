require('dotenv').config()
const User = require('../models').User
const Role = require('../models').Role
const Member = require('../models').Member
const Community = require('../models').Community

let nameToSlug = (name) => {
    let slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')

    return slug
}

let createCommunity = async (req, res, next) => {
    try {
        let community = await Community.create({
            name: req.body.name,
            slug: nameToSlug(req.body.name),
            owner: req.user.id,
        })

        await Member.create({
            user: req.user.id,
            community: community.id,
            role: '7104861668143292891',
        })

        return res.status(201).json({
            status: true,
            content: {
                data: {
                    id: community.id,
                    name: community.name,
                    slug: community.slug,
                    owner: community.owner,
                    created_at: community.createdAt,
                    updated_at: community.updatedAt,
                }
            }
        })
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                status: false,
                errors: error.errors.map(error => {
                    return {
                        param: error.path,
                        message: error.message,
                        code: "INVALID_INPUT"
                    }
                })
            })
        } else if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                status: false,
                errors: error.errors.map(error => {
                    return {
                        param: error.path,
                        message: error.message,
                        code: "DUPLICATE_ENTRY"
                    }
                })
            })
        }

        return res.status(400).json({
            status: false,
            errors: {
                param: "server",
                message: "Internal server error",
                code: "INTERNAL_SERVER_ERROR"
            }
        })
    }
}

let getCommunities = async (req, res, next) => {
    let limit = parseInt(req.query.limit) || 10
    let page = parseInt(req.query.page) || 1
    let offset = (page - 1) * limit

    if (page < 1) return res.status(400).json({
        status: false,
        errors: {
            param: "page",
            message: "Page number must be greater than 0",
            code: "INVALID_INPUT"
        }
    })

    if (limit < 1) return res.status(400).json({
        status: false,
        errors: {
            param: "limit",
            message: "Limit must be greater than 0",
            code: "INVALID_INPUT"
        }
    })

    try {
        let communities = await Community.findAll({
            limit: limit,
            offset: offset,
            include: [
                {
                    model: User,
                    as: 'ownerData',
                    attributes: ['id', 'name']
                }
            ]
        })

        let total = await Community.count()

        return res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: total,
                    pages: Math.ceil(total / limit),
                    page: page,
                },
                data: communities.map(community => {
                    return {
                        id: community.id,
                        name: community.name,
                        slug: community.slug,
                        owner: community.ownerData,
                        created_at: community.createdAt,
                        updated_at: community.updatedAt,
                    }
                })
            }
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            errors: {
                param: "server",
                message: "Internal server error",
                code: "INTERNAL_SERVER_ERROR"
            }
        })
    }
}

let getCommunityMembers = async (req, res, next) => {
    let limit = parseInt(req.query.limit) || 10
    let page = parseInt(req.query.page) || 1
    let offset = (page - 1) * limit

    if (page < 1) return res.status(400).json({
        status: false,
        errors: {
            param: "page",
            message: "Page number must be greater than 0",
            code: "INVALID_INPUT"
        }
    })

    if (limit < 1) return res.status(400).json({
        status: false,
        errors: {
            param: "limit",
            message: "Limit must be greater than 0",
            code: "INVALID_INPUT"
        }
    })

    try {
        let members = await Member.findAll({
            limit: limit,
            offset: offset,
            where: {
                community: req.params.id
            },
            include: [
                {
                    model: User,
                    as: 'userData',
                    attributes: ['id', 'name']
                },
                {
                    model: Role,
                    as: 'roleData',
                    attributes: ['id', 'name']
                }
            ]
        })

        let total = await Member.count({
            where: {
                community: req.params.id
            }
        })

        return res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: total,
                    pages: Math.ceil(total / limit),
                    page: page,
                },
                data: members.map(member => {
                    return {
                        id: member.id,
                        community: member.community,
                        user: member.userData,
                        role: member.roleData,
                        created_at: member.createdAt,
                    }
                })
            }
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            errors: {
                param: "server",
                message: "Internal server error",
                code: "INTERNAL_SERVER_ERROR"
            }
        })
    }
}

let getMyCommunitiesAsOwner = async (req, res, next) => {
    let limit = parseInt(req.query.limit) || 10
    let page = parseInt(req.query.page) || 1
    let offset = (page - 1) * limit

    if (page < 1) return res.status(400).json({
        status: false,
        errors: {
            param: "page",
            message: "Page number must be greater than 0",
            code: "INVALID_INPUT"
        }
    })

    if (limit < 1) return res.status(400).json({
        status: false,
        errors: {
            param: "limit",
            message: "Limit must be greater than 0",
            code: "INVALID_INPUT"
        }
    })

    try {
        let communities = await Community.findAll({
            limit: limit,
            offset: offset,
            where: {
                owner: req.user.id
            }
        })

        let total = await Community.count({
            where: {
                owner: req.user.id
            }
        })

        return res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: total,
                    pages: Math.ceil(total / limit),
                    page: page,
                },
                data: communities.map(community => {
                    return {
                        id: community.id,
                        name: community.name,
                        slug: community.slug,
                        owner: community.owner,
                        created_at: community.createdAt,
                        updated_at: community.updatedAt,
                    }
                })
            }
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            errors: {
                param: "server",
                message: "Internal server error",
                code: "INTERNAL_SERVER_ERROR"
            }
        })
    }
}

let getMyCommunitiesAsMember = async (req, res, next) => {
    let limit = parseInt(req.query.limit) || 10
    let page = parseInt(req.query.page) || 1
    let offset = (page - 1) * limit

    if (page < 1) return res.status(400).json({
        status: false,
        errors: {
            param: "page",
            message: "Page number must be greater than 0",
            code: "INVALID_INPUT"
        }
    })

    if (limit < 1) return res.status(400).json({
        status: false,
        errors: {
            param: "limit",
            message: "Limit must be greater than 0",
            code: "INVALID_INPUT"
        }
    })

    try {
        const userId = req.user.id

        const memberRecords = await Member.findAll({
            where: {
                user: userId,
            },
            include: {
                model: Community,
                as: 'communityData',
                include: {
                    model: User,
                    as: 'ownerData',
                    attributes: ['id', 'name'],
                },
            },
        })

        const joinedCommunities = memberRecords.map((member) => {
            const community = member.communityData
            const owner = community.ownerData

            return {
                id: community.id,
                name: community.name,
                slug: community.slug,
                owner: {
                    id: owner.id,
                    name: owner.name,
                },
                created_at: community.createdAt,
                updated_at: community.updatedAt,
            }
        })

        const total = joinedCommunities.length
        const pages = Math.ceil(total / limit)
        const start = offset

        const paginatedCommunities = joinedCommunities.slice(start, start + limit)

        return res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: total,
                    pages: pages,
                    page: page,
                },
                data: paginatedCommunities,
            },
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            errors: {
                param: "server",
                message: "Internal server error",
                code: "INTERNAL_SERVER_ERROR"
            }
        })
    }
}

module.exports = { createCommunity, getCommunities, getCommunityMembers, getMyCommunitiesAsOwner, getMyCommunitiesAsMember }