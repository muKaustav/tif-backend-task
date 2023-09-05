require('dotenv').config()
const cors = require('cors')
const express = require('express')
const cookieParser = require("cookie-parser")
const roleRoutes = require('./routes/Role')
const userRoutes = require('./routes/User')
const communityRoutes = require('./routes/Community')
const memberRoutes = require('./routes/Member')
const db = require('./models')
require('./passport')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the TFI🚀 API',
        postman: 'https://drive.google.com/file/d/1ZHlDiD0LKOsAvi-yNNw1M5oQ8jUl6P7D/view?usp=sharing',
    })
})

app.use('/v1/role', roleRoutes)
app.use('/v1/auth', userRoutes)
app.use('/v1/community', communityRoutes)
app.use('/v1/member', memberRoutes)

app.get('*', (req, res) => {
    res.redirect('/')
})

const PORT = process.env.PORT || 5000

db.sequelize.sync().then(() => {
    console.log('Database connected')

    app.listen(PORT, () => console.log(`Server running on port ${PORT}.`))
}).catch(err => {
    console.log('Unable to connect to the database:', err)
})