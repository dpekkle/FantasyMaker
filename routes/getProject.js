var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var bodyParser = require('body-parser');
var jwtauth = require('./jwtAuth.js')
var serverPath = 'mongodb://localhost/';

module.exports = function(app){

   app.get('/getProject',jwtauth,function(req,res){
		//console.log("getProject GET request received");
    console.log('entering getProject')
		//add name of project to url for db connection
		var url = serverPath + req.query.projectOwner;

		//connect to db
		MongoClient.connect(url, function (err, db) {
		  if (err) {
			res.send('Unable to connect to the mongoDB server.');
		  } else {
			//successful connection
      var projName = req.query.projectName.trim().split(' ').join('_')
			var collection = db.collection(projName); //get save file based on projectName
			//retreive all data in save file
			collection.find().toArray(function(err, results){
				//operation complete
				db.close();
        if(err){
          console.log('getProject error: ')
          console.log(err)
        }
        else{
          if(results.length > 0){
            console.log('getProject retreived')
            res.json(results); //return results
          }
          else{
            console.log('No project found called ' + projName + ' by ' + req.query.projectOwner)
            res.send('INVALID')
          }
        }

			});

		  }
		});

	});

}
