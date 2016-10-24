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
	app.post('/publish',jwtauth,function(req,res){
		console.log('entering publish')
		//var project = JSON.parse(req.body.save); //parse saveFile
    //need projectOwner, projectName

    if(req.body.projectOwner === undefined || req.body.projectName === undefined){
      console.log('/publish error: projName or projOwner undefined')
      return
    }

    var projectOwner = req.body.projectOwner
    var projectName = req.body.projectName

		//add name of project to url for db connection
		var url = serverPath + projectOwner;

    //get project
    //connect to db
    MongoClient.connect(url, function (err, db) {
      if (err) {
      res.send('Unable to connect to the mongoDB server.');
      } else {
      //successful connection
      var collection = db.collection(projectName); //get save file based on projectName
      //retreive all data in save file
      collection.find().toArray(function(err, results){
        if(err){
          console.log('getProject error: ')
          console.log(err)
        }
        else{
          if(results.length > 0){
            console.log('non published project retreived for duplication')
            console.log(results[0])
            var nonPublished = results[0]
						//var published = results[1]
            nonPublished.published = false
						nonPublished.publishedForPlay = true
            delete nonPublished._id
            //duplicate or update dplicated project
            //check whether project already exists in DB
      			collection.find({ "publishedForPlay": true}).count(function(err,results){
      				//if project already exists
              console.log('HERE')
      				if(results > 0){
      					//update published project in DB
      					collection.update({ "publishedForPlay": true}, nonPublished,function(err,results){
      						console.log("Published project updated");
									db.close()
      						res.send("Published project updated");
      					});
      				}
      				else{
      					//project does not exist in DB
      					collection.insert(nonPublished,function(){
      						console.log("Project published");
									db.close()
      						res.send("Project published");
      					});
      				}
      			});
          }
          else{
            console.log('No project found for duplication called ' + projectName + ' by ' + projectOwner)
						db.close()
            res.send('INVALID')
          }
        }

      });

      }
    });

	});
}
