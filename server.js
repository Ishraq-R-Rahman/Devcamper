const path = require('path');
const express = require('express');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
if( process.env.NODE_ENV !== 'production' ){
  const dotenv = require('dotenv');

  dotenv.config({ path: './config/config.env' });
}

// Connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

// Body parser
app.use(express.json());



// Dev logging middleware
if (process.env.NODE_ENV === 'development') {

  const cookieParser = require('cookie-parser');
  const cors = require('cors');
  const helmet = require('helmet');
  const xss = require('xss-clean');
  
  // Cookie parser
  app.use(cookieParser());
  app.use(morgan('dev'));
  // Set security headers
  app.use(helmet());  

  // Prevent XSS attacks
  app.use(xss());

  // Enable CORS
  app.use(cors());
}

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());



// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins - 100 requests
  max: 100
});
app.use(limiter);



// Prevent http param pollution
app.use(hpp());


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
