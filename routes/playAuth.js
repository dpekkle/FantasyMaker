var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var moment = require('moment')
var key = require('./key.js');
var serverPath = 'mongodb://localhost/';


module.exports = function(app){

	//bodyParser has a payload limit. Set to 50mb.
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

	//route for handling POST to '/saveProject2'
	app.post('/playAuth',function(req,res){

		console.log('entering playAuth')
		//console.log(req.body)
		//var project = JSON.parse(req.body.save); //parse saveFile

    if(req.body.uname === 'guest'){
      var expires = moment().add(10,'m').valueOf();
      var token = jwt.encode({
          iss: req.body.uname,
          exp: expires
        },
        key.secretKey()
      );

      res.json({
        token : token,
        expires: expires,
        user: req.body.uname
      });
    }
    else{
      console.log('INVALID_PLAY_AUTH')
      res.send('INVALID_PLAY_AUTH')
    }
  })
}
