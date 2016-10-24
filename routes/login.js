/*
	Name:
	Created By:
	Purpose:
*/

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var moment = require('moment')
var serverPath = 'mongodb://localhost/';
var key = require('./key.js')
var async = require('async');

module.exports = function(app){

	//bodyParser has a payload limit. Set to 50mb.
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

	//route for handling POST to '/saveProject2'
	app.post('/login',function(req,res){

		console.log('entering login')
		//console.log(req.body)
		//var project = JSON.parse(req.body.save); //parse saveFile

		//add name of project to url for db connection
		var url = serverPath + req.body.uname;

		//open connection to db
		MongoClient.connect(url, function (err, db) {
		  if (err) {
				console.log('login error:')
				console.log(err)
				db.close()
			  res.send('SERVER_ERR');
		  } else {
  			//successful connection
  			var collection = db.collection("user_details",{strict:true},function(err,collection){
          if(err){
						console.log('login error(invalid username): ')
            console.log(err)
						db.close()
            res.send('INVALID_USERNAME')
          }
          else{
            collection.findOne(function(err, details){
              //console.log(details)
              if(req.body.pwd === details.password){
                var expires = moment().add(10,'h').valueOf();
                var token = jwt.encode({
                    iss: req.body.uname,
                    exp: expires
                  },
                  key.secretKey()
                );

								db.close()
                res.json({
                  token : token,
                  expires: expires,
                  user: details.username
                });
              }
              else{
								console.log('INVALID_PASSWORD')
								db.close()
                res.send('INVALID_PASSWORD')
              }

            })
          }

        });

		  }
		});

	});
}
