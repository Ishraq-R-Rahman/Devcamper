const express = require('express');
const { register , login , getMe , forgotpassword , resetPassword , updateDetails , updatePassword , logout} = require('../controllers/auth')
const { protect } = require('../middleware/auth')
const rateLimit = require('express-rate-limit')

const createUserLimiter = rateLimit({
    windowMs: 1000,
    max : 1,
    message: "Already one user created in this time window",
    statusCode: 429
})

const router =  express.Router()

router.post('/register',createUserLimiter, register)
router.post('/login',login)
router.get('/logout',logout)
router.get('/me', protect, getMe)
router.put('/updatedetails', protect, updateDetails)
router.put('/updatepassword' , protect , updatePassword)
router.post('/forgotpassword', forgotpassword )
router.put('/resetpassword/:resettoken', resetPassword )



module.exports = router