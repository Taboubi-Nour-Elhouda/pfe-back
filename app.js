var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const nodemailer = require("nodemailer");
var mongoose =require('mongoose');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var conferencesRouter = require('./routes/conferences');
var programsRouter = require('./routes/program');
const details = require("./details.json");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({
  origin: ['http://localhost:4200','http://127.0.0.1:4200'],
  credentials:true
}))
mongoose.connect('mongodb://localhost/ConfeWebManager');
//passport 
var passport = require('passport');
var session = require('express-session');
app.use(session({
  name:'myname.sid',
  resave: false,
  saveUninitialized:false,
  secret: 'secret',
  cookie:{
    maxAge:36000000,
    httpOnly:false,
    secure:false
  }
}));
require('./passport-config')
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/conferences', conferencesRouter);
app.use('/programs', programsRouter);


//mailing 
app.post("/sendmail", (req, res) => {
  let user = req.body;
  sendMail(user, info => {
    console.log(`The mail has beed send and the id is ${info.messageId}`);
    res.send(info);
  });
});

async function sendMail(user, callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: details.email,
      pass: details.password
    }
  });

  let mailOptions = {
    from: '"E-Congress"<example.gimail.com>', // sender address
    to: user.email, // list of receivers
    subject: "Request approved", // Subject line
    html: `<h3>Congratulation!</h3>
    <p>You depose a program named :`+ user.program +  `,and the scientific community accept it . </p>
    <p>Thank you for joining us,</p>
    <h5>Regards.</h5>`
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);
}
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
