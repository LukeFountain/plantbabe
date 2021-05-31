const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require("../middleware/auth")

const Plants = require('../models/Plants')

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
        // changed to plants and Plants from storys and Storys
        const plants = await Plants.find ({ user: req.user.id }).lean()
        res.render('dashboard',{
            name: req.user.firstName,
            plants,
            // You will end up wanting to add pots to this too. 
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router 

