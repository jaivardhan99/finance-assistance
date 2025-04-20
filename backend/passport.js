const LocalStrategy = require('passport-local').Strategy;
const User = require('./schemas/user'); // assuming passport-local-mongoose is used

module.exports = function(passport) {
  passport.use(new LocalStrategy(User.authenticate())); // strategy provided by passport-local-mongoose

  passport.serializeUser(User.serializeUser()); // serializes user ID into session
  passport.deserializeUser(User.deserializeUser()); // deserializes ID back into user
};
