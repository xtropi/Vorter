const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  //Local LocalStrategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done){
    // Match case-insensitive useremail
    let email_r = new RegExp(["^", email, "$"].join(""), "i");
    let query = {email:email_r};
    User.findOne(query, function(err, user){
      if (err) throw err;
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
    });
  }));

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });
}
