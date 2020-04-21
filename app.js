var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var registrationRouter = require('./routes/registration');
var applicationRouter = require('./routes/application');
var usersRouter = require('./routes/users');
var chatMessagesRouter = require('./routes/chatMessages');
var privateChatMessagesRouter = require('./routes/privateChatMessages');
var usersListRouter = require('./routes/usersList');
var announcementRouter = require('./routes/announcements');
var resourcesRouter = require('./routes/resources');
var emergencyStatusDetailRouter = require('./routes/emergencyStatusDetail');
var testRouter = require('./routes/testroute');
const spamReportRouter = require('./routes/spamReport');

let ENVIRONMENT = 'development';

/* istanbul ignore next */
if (process.env.NODE_ENV != undefined ) {
    ENVIRONMENT = process.env.NODE_ENV;
}

// redirect library for https - uncomment on server
// var httpsRedirectTool = require('express-http-to-https').redirectToHTTPS
const app = express();


// change if using https fo security issues
// app.use(compression())
// https redirect uncomment on server
// app.use(httpsRedirectTool([], [], 301));
let serverType = 'http';

/* istanbul ignore next */
if (ENVIRONMENT == 'production') {
    serverType = 'http';
}

let http = null;
let https = null;
let server = null;

/* istanbul ignore next */
if (serverType == 'http') {
    http = require('http');
} else {
    /* istanbul ignore next */
    https = require('https');
}

/* istanbul ignore next */
if (serverType == 'http') {
    /**
     * Create HTTP server.
     */
    server = http.createServer(app);
} else {
    /* istanbul ignore next */
    let options = {};
    // https certificates for localhost
    /* istanbul ignore next */
    if (ENVIRONMENT != 'production') {
        /**
         * Create HTTPS server.
         */
        options = {
            key: fs.readFileSync(__dirname + '/../ssl/SA1_ESN.pem'),
            cert: fs.readFileSync(__dirname + '/../ssl/SA1_ESN.crt')
        };
    }
    server = https.createServer({}, app);
}

const io = require('socket.io')(server);
let count = 0;
io.sockets.on('connection', function(socket) {
    /* istanbul ignore next */
    count++;
    io.sockets.emit('count', {
        number: count
    });
});


// add socket io to our response as a middleware
app.use(function(req, res, next) {
    res.io = io;
    next();
});

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// application/json
// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '5mb'}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/pictures', express.static(path.join(__dirname, 'public/pictures')));
app.use('/', indexRouter);
// app.use('/sign-up', registrationRouter);
app.use('/app', applicationRouter);
app.use('/example', indexRouter);
app.use('/api/users', usersRouter);
// app.use('/api/token', tokenRouter);
app.use('/api/chat-messages', chatMessagesRouter);
app.use('/api/private-chat-messages', privateChatMessagesRouter);
app.use('/api/usersList', usersListRouter);
app.use('/api/announcements', announcementRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/emergencyStatusDetail', emergencyStatusDetailRouter);
app.use('/api/spam-report', spamReportRouter);
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap-sass/assets')));
app.use('/requirejs', express.static(path.join(__dirname, 'node_modules/requirejs')));
app.use('/api/test', testRouter);
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
app.get('*', (req, res, next) => {
    /* istanbul ignore next */
    res.render('error', {
        title: 'FSE'
    });
});
// error handler
app.use(function(err, req, res, next) {
    /* istanbul ignore next */
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
app.disable('etag');

module.exports = {
    app: app,
    server: server
};
