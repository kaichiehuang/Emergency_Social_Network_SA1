var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression')
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var registrationRouter = require('./routes/registration');
var applicationRouter = require('./routes/application');
var usersRouter = require('./routes/users');
var tokenRouter = require('./routes/token');
var chatMessagesRouter = require('./routes/chatMessages');
var usersListRouter = require('./routes/usersList');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
var swaggerDocument = require("./swaggerDocument")
const Database = require('./model/database');
//redirect library for https - uncomment on server
// var httpsRedirectTool = require('express-http-to-https').redirectToHTTPS

var app = express();

Database.connect();

// Extended: https://swagger.io/specification/#infoObject
// const swaggerOptions = {
//   swaggerDefinition: {
//     info: {
//       title: "Customer API",
//       description: "Customer API Information",
//       contact: {
//         name: "Amazing Developer"
//       },
//       servers: ["http://localhost:3000"]
//     }
//   },
//
//   //apis: ["../app.js"]
//   apis: ["../routes/*.js"]
// };
//const swaggerDocs = swaggerJsDoc(swaggerOptions);

const swaggerDocs = swaggerJsDoc(swaggerDocument);
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs,{
  explorer: true
}));

//change if using https fo security issues
// app.use(compression())

// https redirect uncomment on server
// app.use(httpsRedirectTool([], [], 301));
let serverType  = "http";
let http = null;
let https = null;
let server = null;
if(serverType == "http"){
  http = require('http');
}else{
  https = require('https');
}

if(serverType == "http"){

  /**
   * Create HTTP server.
   */
  server = http.createServer(app);
}else{
  /**
   * Create HTTPS server.
   */
  const options = {
    key: fs.readFileSync(__dirname + '/../ssl/SA1_ESN.pem'),
    cert: fs.readFileSync(__dirname + '/../ssl/SA1_ESN.crt'),
  }

  server = https.createServer(options,app);
}

server = require('http').Server(app);
var io = require('socket.io')(server);

//add socket io to our response as a middleware
app.use(function(req, res, next) {
    res.io = io;
    next();
});



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
// app.use('/sign-up', registrationRouter);
app.use('/app', applicationRouter);
app.use('/example', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/token', tokenRouter);
app.use('/api/chat-messages', chatMessagesRouter);
app.use("/api/usersList",usersListRouter);

app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap-sass/assets')));

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
app.get('*', (req, res, next) => {
    res.render('error', {
        title: 'FSE'
    });
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

app.disable('etag');



module.exports = { app: app, server: server };


