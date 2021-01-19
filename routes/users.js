const express = require('express');
const router = express.Router({ mergeParams : true}) // merging the url params


const adminCrud = require('../controllers/users')
const User = require('../models/User')

const advancedResults = require('../middleware/advancedResults')
const { protect , authorize } = require('../middleware/auth')

router.use(protect)
router.use(authorize('admin'))
//anything below this will use this middleware

router
    .route('/')
        .get( advancedResults(User), adminCrud.getUsers)
        .post(adminCrud.createUser)

router
    .route('/:id')
    .get(adminCrud.getUser)
    .put(adminCrud.updateUser)
    .delete(adminCrud.deleteUser)


module.exports = router

