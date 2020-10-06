const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Contact = require('../models/contact')

const contArray = [];


const cont1 = new Contact(1,"Makesh", "Tirupur","9999999999",3,4,new Date());
const cont2 = new Contact(2,"Babu", "Avinashi","9999339393",2,1,new Date());
const cont3 = new Contact(3,"Thilak", "Coimbatore","9232323223",4,7,new Date());
contArray.push(cont1);
contArray.push(cont2);
contArray.push(cont3);
var contCount = 4;


router.post('/addcontact', auth,  (req, res) => {
    const body = req.body;
    const cont = new Contact(contCount, body.name,body.location,body.phone,body.inCount,body.outCount,new Date(body.date));
    console.log(cont)
    contCount++;
    console.log(cont)

    try {
       contArray.push(cont)
        res.status(201).send(cont)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/contacts', auth, async (req, res) => {
    try {
        const contJSON = JSON.stringify(contArray);
        res.send(contJSON)
    } catch (e) {
        res.status(500).send()
    }
})


router.patch('/contacts/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    // const allowedUpdates = ['description', 'completed']
    // const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    // if (!isValidOperation) {
    //     return res.status(400).send({ error: 'Invalid updates!' })
    // }
    var mContact;
    var mIndex;

    try {
        contArray.forEach((contact,index) => {
            if(contact.id===parseInt(req.params.id))
            {

                mContact = contact;
                mIndex = index;
                
            }
        });
        if (!mContact) {
            return res.status(404).send()
        }

        updates.forEach((update) => mContact[update] = req.body[update])
        contArray[mIndex] = mContact;
        
        res.send(contArray)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/contact/:id', auth, (req, res) => {
    try {

        var mContact;
        contArray.forEach((contact,index) => {
            if(contact.id===parseInt(req.params.id))
            {

                mContact = contact;
                contArray.splice(index,1)
            }
        });

        if (!mContact) {
            res.status(404).send()
        }

        res.send(mContact)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router