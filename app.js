var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport')
const SpotifyStrategy = require('passport-spotify').Strategy
const cors = require('cors')

require('dotenv').config()

const corsOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_URL : true


const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api')

var app = express();

app.use(cors({ origin: corsOrigin }))

app.use(passport.initialize())
require('./config/passport')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/api', apiRouter)

module.exports = app;
