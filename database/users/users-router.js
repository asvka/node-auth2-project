const express = require('express')
const db = require('./users-model')
const restrict = require('../../middleware/restrict')

const router = express.Router()

router.get('/', restrict("Software engineering"), async (req, res, next) => {
    try {
        res.json(await db.find())
    }
    catch (err) {
        next({
            message: "You shall not pass!"
        }, err)
    }
})
module.exports = router;