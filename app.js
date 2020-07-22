var createError = require('http-errors');
var express = require('express');

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

var app = express();

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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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


app.use('/', indexRouter);
app.use('/campus', campusRouter);
app.use('/term', termRouter);
app.use('/subs', subRouter);

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

module.exports = app;
