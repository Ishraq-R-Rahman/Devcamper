const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

//Load env
if( process.env.NODE_ENV !== 'production' ){
    dotenv.config({ path: './config/config.env' });
  }
//Load Models 
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')
const User = require('./models/User')
const Review = require('./models/Review')


//Connect DB
mongoose.connect( process.env.MONGODB_URI , {
    useUnifiedTopology: true,
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify : false
})


//Read JSON files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8')
)
const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8')
)
const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8')
)
const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/reviews.json`,'utf-8')
)

//Import data to database
const importData = async () =>{
    try {
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        await User.create(users)
        await Review.create(reviews)
        console.log('Data Imported...'.green.inverse);
        process.exit()
    }
    catch(err ){
        console.error(err)
    }
}

//Delete data
const deleteData = async()=>{
    try {
        await Bootcamp.deleteMany() //deletes all
        await Course.deleteMany() //deletes all
        await User.deleteMany() //deletes all
        await Review.deleteMany()
        console.log('Data Deleted...'.red.inverse);
        process.exit()
    }
    catch(err ){
        console.error(err)
    }
}


if( process.argv[2] === '-i' ){
    importData();

}else if( process.argv[2] === '-d'){
    deleteData();
}