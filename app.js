const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('./passport-authentication');
const LocalStrategy = require('passport-local').Strategy;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const messageboardRouter = require('./routes/messageboard')

const app = express();

require("dotenv").config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB=process.env.mongourl;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(session({ 
  secret: "cats", 
  resave: false, 
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 5 // Five minutes
  } }));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'))
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messageboard', messageboardRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
})

module.exports = app;
