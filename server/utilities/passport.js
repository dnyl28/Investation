let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let GoogleStrategy = require('passport-google-oauth20').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let mongoose = require('mongoose');
let User = mongoose.model('User');
let backend = require('../config').backend;

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]'
}, function(email, password, done) {
  User.findOne({email: email}).then(function(user){
    if(!user || !user.validPassword(password)){
      return done(null, false, {errors: {'email or password': 'is invalid'}});
    }
    return done(null, user);
  }).catch(done);
}));


passport.use(new GoogleStrategy({
  clientID: "970213840540-hjn4j2ajjpscp1353j99enckoqr5u2bh.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: backend + "/api/user/auth/google/callback",
  passReqToCallback: false,
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));


passport.use(new FacebookStrategy({
  clientID: '5168405613220218',
  clientSecret: '7db90702ddbc1e9e1b5ce3226a6a202a',
  callbackURL:  backend + "/api/user/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)'],
  enableProof: false
},
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

