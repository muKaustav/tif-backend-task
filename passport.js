require('dotenv').config()
const bcrypt = require('bcrypt')
const passport = require('passport')
const Validator = require('validatorjs')
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const localStrategy = require('passport-local').Strategy
const User = require('./models').User

passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        if (!email || !password) {
            return done(null, false, { message: 'Missing credentials' })
        }

        const validation = new Validator({ email }, { email: 'required|email' })

        if (validation.fails()) {
            return done(null, false, { message: validation.errors.first('email') })
        }

        let user = await User.findOne({ where: { email } })

        if (!user) {
            return done(null, false, { message: 'User not found' })
        }

        let isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return done(null, false, { message: 'Wrong password' })
        }

        return done(null, user, { message: 'Logged in successfully' })
    } catch (error) {
        return done(error)
    }
}))

passport.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, email, password, done) => {
    try {
        const { name } = req.body

        let existingUser = await User.findOne({ where: { email } })

        if (existingUser) {
            return done(null, false, { message: 'Email already taken' })
        }

        User.create({ name, email, password })
            .then(user => {
                return done(null, user)
            }).catch(err => {
                return done(err)
            })
    } catch (error) {
        return done(error)
    }
}))

passport.use(new JWTstrategy({
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
}, async (token, done) => {
    try {
        return done(null, token.user)
    } catch (error) {
        done(error)
    }
}))