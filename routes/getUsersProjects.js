var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var bodyParser = require('body-parser');
var serverPath = 'mongodb://localhost/';

module.exports = function(app){

   app.get('/getUsersProjects',function(req,res){
		//console.log("getProject GET request received");

		//add name of project to url for db connection
		console.log(req.query.username)
		var url = serverPath + req.query.username;


		//connect to db
		MongoClient.connect(url, function (err, db) {
		  if (err) {
			res.send('getUsersProjects(): Unable to connect to the mongoDB server.');
		  } else {
			//successful connection

			db.listCollections().toArray(function(err, colNames){
    		// collInfos is an array of collection info objects that look like:
    		// { name: 'test', options: {} }
				var names = []
				for(var i = 0; i<colNames.length-1; i++){ //last element in colNames is system.indexes
					names.push(colNames[i])
				}
				res.json(names)
			});

			/*
			var collection = db.collections(function(err,cols){
				console.log(cols)
			}); //get save file based on projectName
			*/


			//retreive all data in save file
			/*
			collection.find().toArray(function(err, results){
				//operation complete
				db.close();
				res.json(results); //return results
			});
			*/

		  }
		});


	});

}
