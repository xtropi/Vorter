const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs');
const db = require('../db');

module.exports = function(passport){
  //Local LocalStrategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done){
    // Match case-insensitive useremail
    let email_r = new RegExp(["^", email, "$"].join(""), "i");

    db.query(`SELECT * FROM USERS WHERE EMAIL = ${email_r}`, (err, result) => {
      if (err){
        console.log(err);
      } else {
        if (!user){
          return done(null, false, {message: 'No user found'});
        }
              // Match password
        bcrypt.compare(password, user.password, function(err, isMatch){
          if (err) throw err;
          if (isMatch){
            return done(null, user);
          } else {
            return done(null, false, {message: 'Wrong password'});
          }
        });
      };
    });
  }));

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done){
    db.query(`SELECT * FROM USERS WHERE ID = ${id}`, (err, result) => {
      if (err){
        console.log(err);
      } else {
        done(err, user);
      };
    });
  });
}
