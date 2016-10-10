var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var bodyParser = require('body-parser');
var serverPath = 'mongodb://localhost/';
var async = require('async');

module.exports = function(app){

	//bodyParser has a payload limit. Set to 50mb.
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

	//route for handling POST to '/saveProject2'
	app.post('/signUp',function(req,res){
		console.log('signup entered')
		//var project = JSON.parse(req.body.save); //parse saveFile

		//add name of project to url for db connection
		var url = serverPath + req.body.data.username;

		//open connection to db
		MongoClient.connect(url, function (err, db) {
		  if (err) {
			  res.send('Unable to connect to the mongoDB server.');
		  } else {
  			//successful connection
  			var collection = db.createCollection("user_details",{strict:true},function(err,collection){
          if(err){
            console.log(err)
            res.send('INVALID')
          }
          else{
            collection.insert(req.body.data,function(){

							var data = {
								"name" : req.body.data.username
							}
							addToSysUsers(data,function(){
								console.log('new user created')
								db.close()
	              res.send('VALID')
							})
            })
          }

        });

		  }
		});

	});
}

function addToSysUsers(data,callback){
	var url = serverPath + 'SYSTEM_USERS'
	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to SYSTEM_USERS.');
			callback()
		} else {
			var collection = db.collection("SYSTEM_USERS",function(err,collection){
				if(err){
					console.log('addToSysUsers() error:')
					console.log(err)
					callback()
				}
				else{
					collection.insert(data,function(){
						console.log('user added to SYSTEM_USERS')
						db.close()
						callback()
					})
				}
			})
		}
	})
}
