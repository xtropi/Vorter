const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { Client } = require('pg');

// Register Form
router.get('/register', function(req, res){
  if (!req.user){
    res.locals.user = null;
    res.render('register');
  } else {
    res.locals.user = req.user;
    res.redirect('/search');
  }
});


// Register Process
router.post('/register', function(req, res){
  // Get inputed values
  const email = req.body.email.toLowerCase();
  const nickname = req.body.nickname;
  const password = req.body.password;
  const password2 = req.body.password2;
  const timezone = req.body.timezone;
  const country = req.body.country;
  const purpose = '2';
  const overallskill = '2';
  const timefrom = '0:00';
  const timeto = '24:00';
  const discord = null;
  const steam = null;
  const game = null;
  const groupsize = '2';
  const searching = '0';

  // Check values through ExpressValidator
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('nickname', 'Nickname is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  req.checkBody('agreement', 'You did not sign the agreement').notEmpty();

  let validErrors = req.validationErrors();
  if(validErrors){
    res.render('register',{
      errors:validErrors
    });
  } else {
    // Check email & nickname in database
    checkOnExist(email, nickname, function(err, user, existEmail, existNickname) {
      if (err) {
        console.log(err);
      }
      if (!existEmail && !existNickname){
        createUser();
      } else {
        if (existEmail) {req.flash("danger", "Email is exist");}; // Email is already exist
        //if (existNickname) {req.flash("danger", "Nickname is exist");}; // nickname is already exist
        res.redirect('/users/register');
      }
    });
  };

  function checkOnExist(email, nickname, callback) {
    let existEmail = false;
    let existNickname = false;

    client.query(`SELECT * FROM USERS WHERE EMAIL = ${email}`, (err, user) => {
      if (err){
        callback(err, null, true, true);
      } else {
        if (user){
          existEmail = true;
        }
        client.query(`SELECT * FROM USERS WHERE NICKNAME = ${nickname}`, (err, user) => {
          if (err){
            callback(err, null, true, true);
          } else {
            if (user){
              existNickname = true;
            }
            callback(null, user, existEmail, existNickname);
          };
        });
      };
    });
  };

  function createUser(){
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(password, salt, function(err, hash){
        if (err){
          return console.log(err);
        }
        password = hash;
        
        client.query(`
        INSERT INTO users (
          email, password,
          nickname, timezone, 
          country, purpose, 
          overallskill, timefrom, 
          timeto, discord, 
          steam, game, 
          groupsize,searching)
        VALUES (
          ${email}, ${password},
          ${nickname}, ${timezone},
          ${country}, ${purpose},
          ${overallskill}, ${timefrom}, 
          ${timeto}, ${discord},
          ${steam}, ${game},
          ${groupsize}, ${searching})
        `, (err, user) => {
          if (err){
            return console.log(err);
          } else {
            req.flash("success", "Successful registered.");
            res.redirect('/users/login');
          }
        }); 
      });
    });
  };
});

//Login Form
router.get('/login', function(req, res){
  if (!req.user){
    res.locals.user = null;
    res.render('login');
  } else {
    res.locals.user = req.user;
    res.redirect('/search');
  }
});

// Login Process
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: true
  }), function(req, res) {
      if (req.body.remember) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
      } else {
        req.session.cookie.expires = false; // Cookie expires at end of session
      }
      res.redirect('/');
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/users/login');
});
module.exports = router;
