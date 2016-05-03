var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var bodyParser = require('body-parser');
var serverPath = 'mongodb://localhost/';
	
module.exports = function(app){

   app.get('/getProject',function(req,res){
		//console.log("getProject GET request received");

		//add name of project to url for db connection
		var url = serverPath + req.query.projectOwner;

		//connect to db
		MongoClient.connect(url, function (err, db) {
		  if (err) {
			res.send('Unable to connect to the mongoDB server.');
		  } else {
			//successful connection
			var collection = db.collection(req.query.projectName); //get save file based on projectName
			//retreive all data in save file
			collection.find().toArray(function(err, results){
				//operation complete
				db.close();
				res.json(results); //return results
			});
			
		  }
		});
		
	});

}