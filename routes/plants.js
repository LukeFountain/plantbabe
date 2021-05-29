const express = require('express')
const router = express.Router()
const { ensureAuth, } = require("../middleware/auth")

const Story = require('../models/Plants')

//this is the show add page 
//route GET /plants/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('plants/add')

})



module.exports = router 

