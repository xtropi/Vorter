#!/usr/bin/env node

//! DECLARING
// packages
const readline = require('readline');
const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const passport = require('passport');
const app = express();
const redirectApp = express();

//environment variables
const environment = process.env.NODE_ENV;
const localDB = process.env.VORTER_LOCAL_DB;
const remoteDB = process.env.VORTER_REMOTE_DB;
if ((!environment)||(!localDB)||(!remoteDB)){
  console.log("Environment variables is underfined!");
}
let secure = false;
let options;
if (environment=="development") secure = false;
if (environment=="production") secure = true;
let server;
let serverSecure;

let port = 80;
let portSSL = 443;

// selected database
let selectedDB = localDB;
if (!selectedDB){
  console.log("Database Error!");
  process.exit(0);
}
let db = mongoose.connection;
let connectedToDB;

// functions
function startNotice(port){
  console.log(`Server started on port ${port}`);
};

function connectToDB() {
  mongoose.connect(selectedDB);
};


//! INITIALIZATIONS
// readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// MongoDB Events
db.on('connecting', function () {
  connectedToDB = false;
  console.log('MongoDB: Connecting...');
});
db.on('connected', function () {
  console.log('MongoDB: Connected.');
});
db.on('open', function(){
  connectedToDB = true;
  console.log('MongoDB: Connection opened.');
});
db.on('disconnected', function () {
  connectedToDB = false;
  console.log('MongoDB: Disconnected.');
});
db.on('disconnect', function (err) {
  console.log('MongoDB: Disconnecting with error- ', err);
});
db.on('close', function () {
  console.log('MongoDB: Connection closed.');
});
db.on('reconnected', function () {
    console.log('MongoDB: Reconnected.');
});
db.on('reconnecting', function () {
  console.log('MongoDB: Reconnecting...');
});
db.on('error', function(err){
  connectedToDB = false;
  console.log('MongoDB: ERROR-', err);
});

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Express-messages Middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  store: new MongoStore({ mongooseConnection: db }),
  resave: true,
  saveUninitialized: true,
}));

// Express Messages Middleware
app.use(function (req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;
    while(namespace.length){
      formParam += '['+namespace.shift()+']';
    }
    return{
      param : formParam,
      msg : msg,
      value: value
    };
  }
}));

// Passport config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


//! ROUTING
// redirect
redirectApp.get('*', function(req, res, next){
  res.redirect('https://' + req.headers.host + req.url);
});

// route Files
let users = require('./routes/users');
let User = require('./models/user');
app.use('/users', users);

app.get('*', function(req, res, next){
  if (req.isSocket)
    res.redirect('https://' + req.headers.host + req.url);
  if (!req.user){
    res.locals.user = null;
    res.redirect('/users/login');
  } else {
    res.locals.user = req.user;
    next();
  }
});

// Home Route
app.get('/', function(req, res){
  if (!req.user){
    res.locals.user = null;
    res.redirect('/users/login');
  } else {
    res.locals.user = req.user;
    res.redirect('/search');
  }
});

app.get('/search', function(req, res){
  User.findById(req.user.id, function(err, user){
    res.render('search', {
      author: user.username
    });
  });
});

app.get('/profile', function(req, res){
  User.findById(req.user.id, function(err, user){
    res.render('profile', {
      author: user.username
    });
  });
});

app.get('/faq', function(req, res){
  User.findById(req.user.id, function(err, user){
    res.render('faq', {
      author: user.username
    });
  });
});

app.get('/about', function(req, res){
  User.findById(req.user.id, function(err, user){
    res.render('about', {
      author: user.username
    });
  });
});

app.get('*', function(req, res, next){
  if (!req.user){
    res.locals.user = null;
    res.redirect('/users/login');
  } else {
    res.locals.user = req.user;
    res.redirect('/search');
  }
});

//! STARTING
// start database
connectToDB();

// start server
if (secure){
  // SSL
  options = {
    key: fs.readFileSync('./ssl/RSA_PRIVATE_KEY.pem'),
    cert: fs.readFileSync('./ssl/CERTIFICATE.pem')
  };
  server = https.createServer(options, app).listen(portSSL, startNotice(portSSL));
  server = http.createServer(redirectApp).listen(port, startNotice(port));
} else {
  server = http.createServer(app).listen(port, startNotice(port));
}

// console events (readline)
rl.on('line', (input) => {
  switch(input){
  case 'stop':
    if (server){
      console.log('Stopping server...');
      server.close();
      server = (function () { return; })(); //set underfined
      console.log('Server stopped.');
    }
    if (connectedToDB){
      db.close();
    }
  break;

  case 'exit':
  case 'quit':
  case 'q':
    console.log('Closing application...');
    if (server){
      server.close();
      server = (function () { return; })();
      console.log('Server stopped.');
    }
    if (connectedToDB){
      db.close();
    }
    process.exit(0);
  break;

  case 'db restart':
    if (connectedToDB){
      db.close();
    }
    setTimeout(function(){
      connectToDB();
    }, 3000);
  break;
  // case 'start':
  //   if (!connectedToDB){
  //     connectToDB();
  //   } else {
  //     console.log('MongoDB: Already connected.');
  //   }
  //   if (!server){
  //     console.log('Starting server...');
  //     server = http.createServer(app).listen(port, startNotice());
  //   } else {
  //     console.log('Server is already running!');
  //   }
  // break;
  //
  // case 'restart':
  // case 'r':
  //   console.log('Restarting...');
  //   if (server){
  //     console.log('Server closing...');
  //     server.close();
  //     console.log('Server closed.');
  //   }
  //   if (connectedToDB){
  //     db.close();
  //   }
  //   setTimeout(function(){
  //     connectToDB();
  //     server = http.createServer(app).listen(port, startNotice());
  //   }, 3000);
  // break;
  //
  // case 'port set http':
  //   port = 80;
  //   console.log(`Current port: ${port}`);
  // break;
  //
  // case 'port set https':
  //   port = 443;
  //   console.log(`Current port: ${port}`);
  // break;
  //
  // case 'port set default':
  //   port = 3000;
  //   console.log(`Current port: ${port}`);
  // break;
  //
  // case 'port get':
  //   console.log(`Current port: ${port}`);
  // break;

  case 'db set local':
    selectedDB = localDB;
    console.log('Selected database: local.');
  break;

  case 'db set remote':
    selectedDB = remoteDB;
    console.log('Selected database: remote.');
  break;

  default:
    console.log(`Unknown command: ${input}`);
  }
});
