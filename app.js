var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression')
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var registrationRouter = require('./routes/registration');
var usersRouter = require('./routes/users');
var tokenRouter = require('./routes/token');

//redirect library for https - uncomment on server
var httpsRedirectTool = require('express-http-to-https').redirectToHTTPS

var app = express();
//change if using https fo security issues
// app.use(compression())

// https redirect uncomment on server
// app.use(httpsRedirectTool([], [], 301));




//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//application/json
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sign-up', registrationRouter);
app.use('/example', indexRouter);
app.use('/users', usersRouter);
app.use('/token', tokenRouter);
app.use('/getToken', tokenRouter);

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

module.exports = app;
