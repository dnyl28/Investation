let jwt = require('express-jwt');
let secret = require('../config').secret;
let mongoose = require('mongoose');

let User = mongoose.model('User');
let UnauthorizedResponse = require('express-http-response').UnauthorizedResponse;
function getTokenFromHeader(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}
const user = (req, res, next) => {
  User.findById(req.payload.id).then(function(user){
    if(!user){
      next(new UnauthorizedResponse ());
    }
       // also add here bit of status
    req.user = user
    next();
  }).catch(next);
}
const admin = (req, res, next) => {
  User.findById(req.payload.id).then(function(user){
    if(!user && (user.role !== 2 || user.role !== 3)){
      next(new UnauthorizedResponse ());
    }
    req.user = user;
    next();
  }).catch(next);
}
let auth = {
  required: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: secret,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  }),
  user,
  admin 
};

module.exports = auth;
