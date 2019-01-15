#!/usr/bin/env node

//! DECLARING
// packages
const readline = require('readline');
const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express');
const path = require('path');
const { Client, Pool } = require('pg');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const app = express();
const redirectApp = express();
const router = express.Router();

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

let connectedToDB;

// functions
function startNotice(port){
  console.log(`Server started on port ${port}`);
};


const db = new Client({
  connectionString: selectedDB,
});



db.connect()
  .then(() => console.log('PostgreSQL connected.'))
  .catch(e => console.error('Connection error.', err.stack));

module.exports.db = db;

//! INITIALIZATIONS
// readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
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
//  store: new (require('connect-pg-simple')(session))(),
  resave: false,
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
  db.query(`SELECT * FROM USERS WHERE ID = '${req.user.id}'`, (err, result) => {
    if (err){
      console.log(err);
    } else {
      if (result.rows[0]) {
        user=result.rows[0];
        res.render('search', {
          user: user
        });
      };
    };
  });
});

app.get('/profile', function(req, res){
  db.query(`SELECT * FROM USERS WHERE ID = '${req.user.id}'`, (err, result) => {
    if (err){
      console.log(err);
    } else {
      if (result.rows[0]) {
        user=result.rows[0];
        res.render('profile', {
          user: user
        });
      };
    };
  });
});

app.post('/profile', function(req, res){
  bump = `
  UPDATE users SET 
    nickname = '${req.user.nickname}', timezone = '${req.user.timezone}',
    country = '${req.user.country}',  purpose = '${req.user.purpose}',
    overallskill = '${req.user.overallskill}', timefrom = '${req.user.timefrom}', 
    timeto = '${req.user.timeto}',  discord = '${req.user.discord}',
    steam = '${req.user.steam}'
  WHERE ID = '${req.user.id}'
  RETURNING *
  `;

  console.log(bump);

  if (!req.user){
    res.locals.user = null;
    res.redirect('/users/login');
  } else {
    res.locals.user = req.user;

    db.query(`
    UPDATE users SET 
      nickname = '${req.user.nickname}', timezone = '${req.user.timezone}',
      country = '${req.user.country}',  purpose = '${req.user.purpose}',
      overallskill = '${req.user.overallskill}', timefrom = '${req.user.timefrom}', 
      timeto = '${req.user.timeto}',  discord = '${req.user.discord}',
      steam = '${req.user.steam}'
    WHERE ID = '${req.user.id}'
    RETURNING *
    `, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result.rows[0]) {
          user=result.rows[0];
          req.flash("success", "Successful changed.");
          res.render('profile', {
            user: user
          });
        } else {
          user=result.rows[0];
          req.flash("error", "Error.");
          res.render('profile', {
            user: user
          });
        };

      }
    }); 
  }
});

app.post('/cancel', function(req, res){
  if (!req.user){
    res.locals.user = null;
    res.redirect('/users/login');
  } else {
    res.locals.user = req.user;
    res.redirect('/search');
  }
});

app.post('/searchStart', function(req, res){
  if (!req.user){
    res.locals.user = null;
    res.redirect('/users/login');
  } else {
    res.locals.user = req.user;

    bump = `
    UPDATE users SET
      timefrom = '${req.user.timefrom}',
      timeto = '${req.user.timeto}',
      game = '${req.user.game}',
      groupsize = '${req.user.groupsize}',
      searching = '1'
    WHERE ID = '${req.user.id}'
    RETURNING *
    `;
    db.query(`
    UPDATE users SET
      timefrom = '${req.user.timefrom}',
      timeto = '${req.user.timeto}',
      game = '${req.user.game}',
      groupsize = '${req.user.groupsize}',
      searching = '1'
    WHERE ID = '${req.user.id}'
    RETURNING *
    `, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result.rows[0]) {
          console.log(bump);
          user=result.rows[0];
          res.render('search', {
            user: user
          });
        } else {
          user=result.rows[0];
          req.flash("error", "Error.");
          res.render('search', {
            user: user
          });
        };
      }
    }); 
  }
});

app.post('/searchStop', function(req, res){
  if (!req.user){
    res.locals.user = null;
    res.redirect('/users/login');
  } else {
    res.locals.user = req.user;

    db.query(`
    UPDATE users SET searching = '0' 
    WHERE ID = '${req.user.id}'
    RETURNING *
    `, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result.rows[0]) {
          user=result.rows[0];
          db.query(`SELECT * FROM USERS WHERE ID = '${req.user.id}'`, (err, result) => {
            res.render('search', {
              user: user
            });
          });
        } else {
          user=result.rows[0];
          req.flash("error", "Error.");
          res.render('search', {
            user: user
          });
        };
      }
    }); 
  }
});

app.get('/faq', function(req, res){
  db.query(`SELECT * FROM USERS WHERE ID = '${req.user.id}'`, (err, result) => {
    if (result.rows[0]) {
      user=result.rows[0];
      res.render('faq', {
        nickname: user.nickname
      });
    };
  });
});

app.get('/about', function(req, res){
  db.query(`SELECT * FROM USERS WHERE ID = '${req.user.id}'`, (err, result) => {
    if (result.rows[0]) {
      user=result.rows[0];
      res.render('about', {
        nickname: user.nickname
      });
    };
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
//connectToDB();

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
      db.end();
    }
    process.exit(0);
  break;

  // case 'db restart':
  //   if (connectedToDB){
  //     db.close();
  //   }
  //   setTimeout(function(){
  //     connectToDB();
  //   }, 3000);
  // break;
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

  // case 'db set local':
  //   selectedDB = localDB;
  //   console.log('Selected database: local.');
  // break;

  // case 'db set remote':
  //   selectedDB = remoteDB;
  //   console.log('Selected database: remote.');
  // break;

  default:
    console.log(`Unknown command: ${input}`);
  }
});
