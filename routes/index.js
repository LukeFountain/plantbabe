const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require("../middleware/auth")

const Story = require('../models/Story')

//this is the login/landing page 
//route GET / 
router.get('/', ensureGuest, (req, res) => {
    res.render('login',{
        layout: 'login'
    })

})

//this is the Dashboard
//route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find ({ user: req.user.id }).lean()
        res.render('dashboard',{
            name: req.user.firstName,
        })
    } catch (err) {

    }
})

module.exports = router 

