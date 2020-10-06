const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const config = require('../config');





router.post('/users/login', (req, res) => {
    console.log("Inside")
    try {       
        if(req.body.username===config.username && req.body.password===config.password)
        res.send()
        else
        res.status(400).send()
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        res.send();
       
    } catch (e) {
        res.status(500).send();
    }
})



module.exports = router