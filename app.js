const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
const applicationRouter = require('./routes/application');
const usersRouter = require('./routes/users');
const chatMessagesRouter = require('./routes/chatMessages');
const privateChatMessagesRouter = require('./routes/privateChatMessages');
const usersListRouter = require('./routes/usersList');
const announcementRouter = require('./routes/announcements');
const resourcesRouter = require('./routes/resources');
const emergencyStatusDetailRouter = require('./routes/emergencyStatusDetail');
const testRouter = require('./routes/testroute');
const spamReportRouter = require('./routes/spamReport');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

let ENVIRONMENT = 'development';

/* istanbul ignore next */
if (process.env.NODE_ENV != undefined ) {
    ENVIRONMENT = process.env.NODE_ENV;
}

// redirect library for https - uncomment on server
// var httpsRedirectTool = require('express-http-to-https').redirectToHTTPS
const app = express();

// API RATE LIMIT CONFIGURATION
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);
const limiter = rateLimit({
    // windowMs: 15 * 60 * 1000, // 15 minutes
    windowMs: 60 * 1000, // 1 minutes
    max: 200, // limit each IP to 200 requests per windowMs
    message:
        'Too many requests from this IP',
});


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
/* istanbul ignore next */
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
app.use(bodyParser.json({limit: '5mb'}));

app.use(compression({filter: shouldCompress}));
function shouldCompress(req, res) {
    // fallback to standard filter function
    return compression.filter(req, res);
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(cookieParser());
// setup static assets cache control
const publicOptions = {
    dotfiles: 'ignore',
    etag: false,
    index: false,
    maxAge: '15d',
    redirect: false,
};
app.use(express.static(path.join(__dirname, 'public'), publicOptions));
app.use('/api/', limiter);
// cache invalidation
app.locals.versionedAssets = 218;

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
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/requirejs', express.static(path.join(__dirname, 'node_modules/requirejs')));
app.use('/api/test', testRouter);
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
/* istanbul ignore next */
app.get('*', (req, res, next) => {
    /* istanbul ignore next */
    res.render('error', {
        title: 'FSE'
    });
});
// error handler
/* istanbul ignore next */
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
