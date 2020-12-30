const mongoose = require('mongoose')
const asyncHandler = require('../middleware/async')

const connectDB = asyncHandler( async () => {
    const conn = await mongoose.connect( process.env.MONGODB_URI , {
        useUnifiedTopology: true,
        useNewUrlParser : true,
        useCreateIndex : true,
        useFindAndModify : false
    })

    console.log(`Connected to MongoDB: ${conn.connection.host}`.cyan.underline.bold);
})

module.exports = connectDB