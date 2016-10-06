var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var bodyParser = require('body-parser');
var jwtauth = require('./jwtAuth.js')
var serverPath = 'mongodb://localhost/';

module.exports = function(app){

   app.get('/getUsersProjects',jwtauth,function(req,res){
     console.log('getUsersProjects entered')
		//console.log("getProject GET request received");

		//add name of project to url for db connection
    //console.log(req.body)
    //console.log(req.query)
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
				for(var i = 0; i<colNames.length; i++){ //last element in colNames is system.indexes
          if(colNames[i].name !== 'system.indexes' && colNames[i].name !== 'user_details'){
            	names.push(colNames[i])
          }

				}
				res.json(names)
			});

		  }
		});


	});

}
