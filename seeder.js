const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

//Load env
dotenv.config({path: './config/config.env'})

//Load Models 
const Bootcamp = require('./models/Bootcamp')

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

//Import data to database
const importData = async () =>{
    try {
        await Bootcamp.create(bootcamps)
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