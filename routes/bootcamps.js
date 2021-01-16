const express = require('express')
const router = express.Router()

const { getBootcamps, getBootcamp , updateBootcamp, deleteBootcamp, createBootcamp, getBootcampsInRadius } = require('../controllers/bootcamps')

//Include other resource routers
const courseRouter = require('./courses');

//Reroute into other resource routers
router.use('/:bootcampId/courses' , courseRouter )

router.route('/').get( getBootcamps ).post( createBootcamp )

router.route('/:id').get( getBootcamp ).put( updateBootcamp ).delete( deleteBootcamp )

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)

module.exports = router