const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./database/users/users-router')

const server = express()
const port = process.env.PORT || 7777

server.use(cors())
server.use(helmet())
server.use(express.json())
server.use(cookieParser())

server.use('/auth', authRouter)
server.use('/users', usersRouter)

server.get("/", (req, res, next) => {
	res.json({
		message: "Welcome to our API",
	})
})

server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: "You shall not pass!",
	})
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})