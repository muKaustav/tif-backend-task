require('dotenv').config()
const jwt = require('jsonwebtoken')
const passport = require('passport')

let generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

let login = async (req, res, next) => {
    passport.authenticate('login', { session: false }, async (err, user, info) => {
        try {
            if (err) {
                return res.status(500).json({
                    status: false,
                    errors: {
                        param: "server",
                        message: "Internal server error",
                        code: "INTERNAL_SERVER_ERROR"
                    }
                })
            }

            if (!user) {
                console.log(info.message)
                if (info.message === 'User not found') {
                    return res.status(400).json({
                        status: false,
                        errors: {
                            param: "email",
                            message: "The credentials you provided are invalid.",
                            code: "INVALID_CREDENTIALS"
                        }
                    })
                } else if (info.message === 'Wrong password') {
                    return res.status(400).json({
                        status: false,
                        errors: {
                            param: "password",
                            message: "The credentials you provided are invalid.",
                            code: "INVALID_CREDENTIALS"
                        }
                    })
                } else if (info.message === 'Missing credentials') {
                    return res.status(400).json({
                        status: false,
                        errors: {
                            param: "email/password",
                            message: "Please provide an email address and a password.",
                            code: "INVALID_INPUT"
                        }
                    })
                } else if (info.message === 'The email format is invalid.') {
                    return res.status(400).json({
                        status: false,
                        errors: {
                            param: "email",
                            message: "Please provide a valid email address.",
                            code: "INVALID_INPUT"
                        }
                    })
                }
            }

            req.login(user, { session: false }, async (error) => {
                if (error) return next(error)

                const body = { id: user.id, name: user.name, email: user.email, created_at: user.createdAt }

                const token = generateAccessToken(body)

                return res.cookie('jwt', token, { httpOnly: true, secure: false, maxAge: 86400000 }).json({
                    status: true,
                    content: {
                        data: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            created_at: user.createdAt,
                        },
                        meta: {
                            access_token: token
                        }
                    }
                })
            })
        } catch (error) {
            return next(error)
        }
    })(req, res, next)
}

let register = async (req, res, next) => {
    passport.authenticate('signup', { session: false }, async (err, user, info) => {
        try {
            if (err) {
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

                return res.status(500).json({
                    status: false,
                    errors: {
                        param: "server",
                        message: "Internal server error",
                        code: "INTERNAL_SERVER_ERROR"
                    }
                })
            }

            if (!user) {
                return res.status(400).json({
                    status: false,
                    errors: {
                        param: "email",
                        message: "User with this email address already exists.",
                        code: "RESOURCE_EXISTS"
                    }
                })
            }


            const body = { id: user.id, name: user.name, email: user.email, created_at: user.createdAt }

            const token = generateAccessToken(body)

            return res.cookie('jwt', token, { httpOnly: true, secure: false, maxAge: 86400000 }).json({
                status: true,
                content: {
                    data: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        created_at: user.createdAt,
                    },
                    meta: {
                        access_token: token
                    }
                }
            })
        } catch (error) {
            return next(error)
        }
    })(req, res, next)
}

let getUserProfile = async (req, res, next) => {
    const token = req.cookies.jwt

    if (!token) {
        return res.status(401).json({
            status: false,
            errors: {
                message: "You need to sign in to proceed.",
                code: "NOT_SIGNEDIN"
            }
        })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: false,
                errors: {
                    message: "You are not authorized to access this resource.",
                    code: "NOT_AUTHORIZED"
                }
            })
        }

        return res.json({
            status: true,
            content: {
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    created_at: user.created_at,
                }
            }
        })
    })
}

module.exports = { login, register, getUserProfile }