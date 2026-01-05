require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

const authCtrl = require('./controllers/auth');
const jobsCtrl = require('./controllers/jobs');
const appsCtrl = require('./controllers/applications');
const verifyToken = require('./middleware/verify-token');

const app = express();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Public
app.use('/auth', authCtrl);

// Protected
app.use(verifyToken);
app.use('/jobs', jobsCtrl);
app.use('/applications', appsCtrl);



app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running');
});
