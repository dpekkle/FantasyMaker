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
	app.post('/saveProject',function(req,res){
	
		var project = JSON.parse(req.body.save); //parse saveFile
		var deletedObjects = JSON.parse(req.body.deletedObjects); //parse list of elements to be deleted(if any)
		
		//add name of project to url for db connection
		var url = serverPath + project.projectOwner;
		
		//open connection to db
		MongoClient.connect(url, function (err, db) {
		  if (err) {
			res.send('Unable to connect to the mongoDB server.');
		  } else {
			//successful connection
			var collection = db.collection(project.projectName); //get save file based on projectName
			
			//check whether project already exists in DB
			collection.find({ "projectName": project.projectName}).count(function(err,results){
				//if project already exists
				if(results > 0){
					//update project in DB
					collection.updateOne({"projectName": project.projectName}, project, function(err,results){
						console.log("entry updated");
						res.send("Databse updated");
					});
				}
				else{
					//project does not exist in DB
					collection.insert(project,function(){
						console.log("entry created");
						res.send("New project saved");
					});
				}
			});
			
		  }
		});
		
	});
}
