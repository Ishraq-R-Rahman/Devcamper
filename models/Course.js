const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type : String,
        trim: true,
        required : [true, "Please add a title"]
    },
    description : {
        type: String,
        required : [true,"Please add a description"]
    },
    weeks : {
        type: Number,
        required : [true,"Please add a number for weeks"]
    },
    tuition : {
        type: Number,
        required : [true,"Please add a tuition cost"]
    },
    minimumSkill : {
        type: String,
        required : [true,"Please add a minimum skill required"],
        enum : ['beginner', 'intermediate', 'advanced']
    },
    scholarShipAvailable : {
        type: Boolean,
        default: false
    },
    createdAt : {
        type: Date,
        default : Date.now
    },
    bootcamp : {
        type : mongoose.Schema.ObjectId,
        ref : 'Bootcamp',
        required : true
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    }
})

//Static method to get average cost of course tuition
CourseSchema.statics.getAverageCost = async function( bootcampId ){

    const obj = await this.aggregate([
        {
            $match : { bootcamp : bootcampId }
        },
        {
            $group : {
                _id : '$bootcamp',
                averageCost : {$avg : '$tuition'}
            }
        }
    ])

    try {
        await this.model('Bootcamp').findByIdAndUpdate( bootcampId , {
            averageCost : Math.ceil(obj[0].averageCost  / 10 ) * 10
        })
    }catch( err ){
        console.error(err);
    }

}


// Call getAverageCost after save
CourseSchema.post('save', function(){
    this.constructor.getAverageCost( this.bootcamp )
})

// Call getAverageCost before remove
CourseSchema.pre('remove', function(){
    this.constructor.getAverageCost( this.bootcamp )
})



module.exports = mongoose.model('Course', CourseSchema )