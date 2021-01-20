const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

/**
 * @description Get all reviews
 * @route GET /api/v1/reviews
 * @route GET /api/v1/bootcamps/:bootcampId/reviews
 * @access Public
 */

const getReviews = asyncHandler( async ( req,res, next )=>{

    if( req.params.bootcampId ){
        // Finding courses from bootcamp
        const reviews = await Review.find({ bootcamp : req.params.bootcampId })
        return res.status(200).json({
            success : true, 
            count : reviews.length,
            data : reviews
        })
    }else {
        res.status(200).json(res.advancedResults)
    }
})

/**
 * @description Get single review
 * @route GET /api/v1/reviews/:id
 * @access Public
 */

const getReview = asyncHandler( async ( req,res, next )=>{

    const review = await Review.findById(req.params.id).populate({
        path : 'bootcamp',
        select : 'name description'
    })

    if(!review){
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`,404))
    }

    res.status(200).json({
        success: true,
        data : review
    })
    
})

/**
 * @description Add review
 * @route POST /api/v1/bootcamps/:bootcampId/reviews
 * @access Private
 */

const addReview = asyncHandler( async ( req,res, next )=>{

    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId} found`,404))
    }

    const review = await Review.create(req.body)

    res.status(201).json({
        success: true,
        data : review
    })
    
})


module.exports = {
    getReviews,
    getReview,
    addReview
}