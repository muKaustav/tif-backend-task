require('dotenv').config()
const Role = require('../models').Role

let createRole = async (req, res, next) => {
    try {
        let role = await Role.create({
            name: req.body.name
        })

        return res.status(201).json({
            status: true,
            content: {
                data: {
                    id: role.id,
                    name: role.name,
                    created_at: role.createdAt,
                    updated_at: role.updatedAt
                }
            }
        })
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({
                status: false,
                errors: err.errors.map(error => {
                    return {
                        param: error.path,
                        message: error.message,
                        code: "INVALID_INPUT"
                    }
                })
            })
        }

        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                status: false,
                errors: err.errors.map(error => {
                    return {
                        param: error.path,
                        message: error.message,
                        code: "DUPLICATE_ENTRY"
                    }
                })
            })
        }

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

let getRoles = async (req, res, next) => {
    let limit = parseInt(req.query.limit) || 10
    let page = parseInt(req.query.page) || 1
    let offset = (page - 1) * limit

    if (page < 1) return res.status(400).json({
        status: false,
        errors: {
            param: "page",
            message: "Page must be greater than 0",
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
        let roles = await Role.findAll({
            limit: limit,
            offset: offset
        })

        let total = await Role.count()

        return res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: total,
                    pages: Math.ceil(total / limit),
                    page: page,
                },
                data: roles.map(role => {
                    return {
                        id: role.id,
                        name: role.name,
                        created_at: role.createdAt,
                        updated_at: role.updatedAt
                    }
                })
            }
        })
    } catch (err) {
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

module.exports = { createRole, getRoles }