/*
	Name: retrieva tutorial
	Created By: Darryl
	Purpose: sets tutorial project for a new user
*/

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
//var bodyParser = require('body-parser');
//var jwtauth = require('./jwtAuth.js')
var serverPath = 'mongodb://localhost/';
var getProjectAttributes = require('./getProjectAttributes.js')
var Async = require('async')

module.exports.retreiveTutorial = function(projectToReturn, outer_callback){

   //app.get('/getUsersProjects',jwtauth,function(req,res){
     console.log('getUsersProjects entered')
		//console.log("getProject GET request received");

		//add name of project to url for db connection
    //console.log(req.body)
    //console.log(req.query)
		var url = serverPath + 'Admin';


		//connect to db
		MongoClient.connect(url, function (err, db) {
		  if (err) {
			res.send('getUsersProjects(): Unable to connect to the mongoDB server.');
		  } else {
			//successful connection

			db.listCollections().toArray(function(err, colNames){
    		// collInfos is an array of collection info objects that look like:
    		// { name: 'test', options: {} }
				var all = {
          'projects' : []
        }
				for(var i = 0; i<colNames.length; i++){ //last element in colNames is system.indexes
          if(colNames[i].name !== 'system.indexes' && colNames[i].name !== 'user_details'){
            var proj = {
              'projName' : colNames[i].name
            }
            console.log(proj)
            all.projects.push(proj)
          }
				}

        Async.each(all.projects,
          // 2nd param is the function that each item is passed to
          function(item, callback){
            // Call an asynchronous function, often a save() to DB
            getProjectAttributes.getProjectAttributes(item,false,'Admin',function(){
              callback()
            })
          },
          // 3rd param is the function to call when everything's done
          function(err){
            // All tasks are done now


            //find projName of project called 'Tutorial'
            var tutName = {
              data: "Tutorial project not found"
            }
            for(var i = 0; i<all.projects.length; i++){
              if(all.projects[i].title === 'Tutorial'){
                tutName = all.projects[i]
                i = all.projects.length
              }
            }

          //  console.log('TUTNAME')
            //console.log(tutName)
            if( !tutName.hasOwnProperty('projName') ){
              console.log('tutorial project not found')
              projectToReturn = {}
              outer_callback()
            }
            else{
              //get tutorial project data
              var collection = db.collection(tutName.projName); //get save file based on projectName
              collection.find({"projectName": tutName.projName}).toArray(function(err, results){
                //operation complete
                //db.close();
                if(err){
                  console.log('get Tutorial Project error: ')
                  console.log(err)
                  projectToReturn = {}
                  db.close()
                  outer_callback()
                  //return
                }
                else{
                  if(results.length > 0){
                      //source is create.html
                      console.log('Tutorial Project retreived')
                      delete results[0]._id
                      //console.log(results[0])
                      projectToReturn.data = results[0]
                      db.close()
                      outer_callback()
                      //return
                  }
                  else{
                      console.log('No project found called ' + projName + ' by Admin')
                      projectToReturn = {}
                      db.close()
                      outer_callback()
                      //return
                  }
                }

              });
            }



            console.log(all)
            //res.json(all)
          }
        );
			});

		  }
		});


//	});

}
