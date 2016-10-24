/*
	Name:
	Created By:
	Purpose:
*/

var jwt = require('jwt-simple');
var bodyParser = require('body-parser');
var moment = require('moment')
var key = require('./key.js')

module.exports = function(req, res, next) {
  console.log('jwtAuth invoked')
  // code goes here
  //console.log(req.body)
  //console.log(req.query)
  //console.log(req.headers)
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
  if (token) {
    try {
      //console.log('SECRET: ' + key.secretKey())
      var decoded = jwt.decode(token, key.secretKey())
      //console.log(decoded)
      //console.log(Date.now())
      // handle token here
      console.log('tok exp: '+decoded.exp)
      console.log(Date.now())

      if (decoded.exp <= Date.now()) {
        console.log('expired token')
        //redirect(res)
        res.send('EXPIRED')
        //return
      }
      else{
        console.log('valid token')
        if(req.body){
          req.body.user = decoded.iss
        }
        else if(req.query){
          req.query.user = decoded.iss
        }

        next();
      }

    } catch (err) {
      console.log('jwtAuth err: ')
      console.log(err)
      //console.log(req.body)
      //return next();
      res.send('AUTH_ERROR')

    }
  } else {
    console.log('jwtAuth: No token')
    //next()
    res.send('NO_TOKEN')
    //next();
  }
};
