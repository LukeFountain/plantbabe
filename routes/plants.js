const express = require('express')
const router = express.Router()
const { ensureAuth, } = require("../middleware/auth")

const Plants = require('../models/Plants')

// const Story = require('../models/Plants')

//this is the show add page 
//route GET /plants/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('plants/add')

})

//this will process the add form
//route POST /plants/add
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Plants.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

//this is the show all plants page
//route GET /plants
router.get('/', ensureAuth, async (req, res) => {
    try {
        const plants = await Plants.find({ status: 'public'})
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean()
        res.render('plants/index', {
            plants,
        })
    } catch (err){
        console.error(err)
        res.render('error/500')
    }

})



module.exports = router 

