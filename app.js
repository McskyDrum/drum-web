var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var adminlogin  = require("./routes/adminlogin");
var adminStudent  = require("./routes/student");
var adminStudentLevel  = require("./routes/student-level");
var adminStudentLeave  = require("./routes/student-leave");
var adminCourse  = require("./routes/course");
var adminCourseSchedule  = require("./routes/course-schedule");
var adminTeacher  = require("./routes/teacher");
var adminCash = require("./routes/cash");


var studentLogin = require("./routes/student/studentLogin");



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);
app.use('/adminlogin', adminlogin);
app.use('/adminStudent', adminStudent);
app.use('/adminStudentLevel', adminStudentLevel);
app.use('/adminStudentLeave', adminStudentLeave);
app.use('/adminCourse', adminCourse);
app.use('/adminCourseSchedule', adminCourseSchedule);
app.use('/adminTeacher', adminTeacher);
app.use('/adminCash', adminCash);

app.use('/studentLogin', studentLogin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
