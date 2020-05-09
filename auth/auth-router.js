const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../database/users/users-model')
const restrict = require('../middleware/restrict')

const router = express.Router()

router.post('/register', async (req, res, next) => {
    try {
        const { username } = req.body
        const user = await db.findBy({username}).first()

        if (user) {
            return res.status(409).json({
                message: "Username already taken, try again..."
            })
        }
        res.status(201).json(await db.add(req.body))
    }
    catch (err) {
        next(err)
    }
})

router.post('/login', async (req, res, next) => {
    const authErr = {
        message: "Invalid credentials, please try again."
    }

    try {
        const user = await db.findBy({ username: req.body.username }).first()
        if (!user) {
            return res.status(401).json(authErr)
        }
        const passwordValid = await bcrypt.compare(req.body.password, user.password)
        if (!passwordValid) {
            return res.status(401).json(authErr)
        }
        const tokenPayload = {
            userId: user.id,
            department: user.department,
        }
        res.cookie("token", jwt.sign(tokenPayload, process.env.JWT_SECRET))
        res.json({
            message: `Welcome, ${user.username}!`
        })
    }
    catch (err) {
        next(err)
    }

})

router.get('/logout', restrict(), (req, res, next) => {
    console.log(req.session)
    req.session.destroy((err) => {
        if (err) {
            next(err)
        } else {
            res.json({
                message: "User was logged out!"
            })
        } 
    })
})

module.exports = router;