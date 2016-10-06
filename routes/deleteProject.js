var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var bodyParser = require('body-parser');
var serverPath = 'mongodb://localhost/';
var jwtauth = require('./jwtAuth.js')
var async = require('async');

module.exports = function(app){

	//bodyParser has a payload limit. Set to 50mb.
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

	//route for handling POST to '/saveProject2'
	app.post('/deleteProject',jwtauth,function(req,res){
		console.log('deleteProject entered')


		//add name of project to url for db connection
		var url = serverPath + req.body.username;

		//open connection to db
		MongoClient.connect(url, function (err, db) {
		  if (err) {
			res.send('Unable to connect to the mongoDB server.');
		  } else {
			//successful connection
			var projName = req.body.projName.trim().split(' ').join('_')
			var collection = db.collection(projName); //get save file based on projectName

			//console.log(req.body.projName)
			//check whether project already exists in DB
			collection.find({ "projectName": req.body.projName}).count(function(err,results){
				//if project already exists
				if(results > 0){
					//delete collection
          collection.drop()
					console.log('collection deleted')
          res.send('Collection Deleted')
				}
        else{
					console.log('failed to delete collection')
          res.send('Unable to delete collection')
        }
			});

		  }
		});

	});
}
