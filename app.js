const createError = require('http-errors');
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');

var cors = require('cors'); //Cross Origin

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cn = require('./auth');
const mongodb = require('./mongo');
const indexRouter = require('./routes/index');
const campusRouter = require('./routes/campus');
const termRouter = require('./routes/term');
const subRouter = require('./routes/subs');
const crsRouter = require('./routes/courses');

var app = express();

// Certificate - Note that this was achieved using CertBot on a Debian VM
const pk = fs.readFileSync('/etc/letsencrypt/live/' + cn.cn_d + '/fullchain.pem', 'utf8');
const cert = fs.readFileSync('/etc/letsencrypt/live/' + cn.cn_d + '/fullchain.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/' + cn.cn_d + '/fullchain.pem', 'utf8');

const credentials = {
	key: pk,
	cert: cert,
	ca: ca
};

app.use((req, res) => {
	res.send('Hello there !');
});

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);


var cnn_str = "mongodb+srv://" + cn.cn_u + ":" + cn.cn_p + "@" + cn.cn_s +
  "/arg_react_sch?authSource=admin&retryWrites=true&w=majority";

mongodb.connect(cnn_str, function (err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    console.log('Connected to Mongo Established')
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
//cross original resource allow list logic
var allowedOrigins = ['http://localhost:3000',
                      'http://localhost:3040'];
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'Unauthorized origin, cannot respond.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
*/

app.use(cors());

app.use('/', indexRouter);
app.use('/campus', campusRouter);
app.use('/term', termRouter);
app.use('/subs', subRouter);
app.use('/courses', crsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//list on both http/https
httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});

module.exports = app;
