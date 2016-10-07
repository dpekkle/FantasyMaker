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
	app.post('/saveProject',jwtauth,function(req,res){
		console.log('entering saveProject')
		var project = JSON.parse(req.body.save); //parse saveFile

		//add name of project to url for db connection
		var url = serverPath + project.projectOwner;

		//open connection to db
		MongoClient.connect(url, function (err, db) {
		  if (err) {
				console.log('save error: ')
				console.log(err)
				res.send('Unable to connect to the mongoDB server.');
		  } else {
			//successful connection
			var projName = project.projectName.trim().split(' ').join('_')
			var collection = db.collection(projName); //get save file based on projectName

			//check whether project already exists in DB
			collection.find({ "projectName": project.projectName}).count(function(err,results){
				//if project already exists
				if(results > 0){
					//update project in DB
					collection.updateOne({"projectName": project.projectName}, project, function(err,results){
						console.log("Project saved");
						res.send("Project saved");
					});
				}
				else{
					//project does not exist in DB
					collection.insert(project,function(){
						console.log("Project created");
						res.send("Project created");
					});
				}
			});

		  }
		});

	});
}
