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

    if(req.query.projectOwner === undefined || req.query.projectName === undefined || req.query.source === undefined){
      console.log('getProject(): query is undefined')
      res.send('INVALID')
      return
    }

		//connect to db
		MongoClient.connect(url, function (err, db) {
		  if (err) {
			res.send('Unable to connect to the mongoDB server.');
		  } else {
			//successful connection
      var projName = req.query.projectName.trim().split(' ').join('_')
			var collection = db.collection(projName); //get save file based on projectName
			//retreive all data in save file
      var filter = {}
      if(req.query.source === "play"){
        console.log("PLAY MODULE GET PROJECT")
        filter = {"publishedForPlay": true}
      }
			collection.find().toArray(function(err, createResults){
				//operation complete
				//db.close();
        if(err){
          console.log('getProject error: ')
          console.log(err)
        }
        else{
          if(createResults.length > 0){
            if(req.query.source === "play"){
              //source is play.html
              if(createResults[0].published === true){
                collection.find({"publishedForPlay":true}).toArray(function(err, playResults){
                  if(playResults.length > 0){
                    console.log('getProject retreived')
                    res.json(playResults); //return results
                  }

                })
              }
              else{
                res.send('NOT_PUBLISHED')
              }

            }
            else{
              //source is create.html
              console.log('getProject retreived')
              res.json(createResults); //return results
            }

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
