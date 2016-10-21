var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var Async = require('async')
var getProjectAttributes = require('./getProjectAttributes.js')
var serverPath = 'mongodb://localhost/';

module.exports.getProjectAttributes = function(project,published,username,callback){
  //connect to db
  console.log('getProjectAttributes: ')
  console.log(project)
  console.log(username)
  var url = serverPath + username
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server.');
    } else {
    //successful connection
    var collection = db.collection(project.projName); //get save file based on projectName

    //setup filter for whether project is published or not
    var filter

    if(published === 'true'){
      filter = {"publishedForPlay": true}
    }
    else{
      filter = {}
    }

    var exclude = {
      "graph" : false,
  		"gameAttributes" : false,
  		"gameInventory" : false,
  		"attributesHTML" : false,
  		"resolution" : false,
      "project_templates": false,
      "button_list": false,
      "template_menus": false,
      "audio": false,
      "backgroundLink": false,
      "_id" : false
    }
    collection.find({},exclude).toArray(function(err, results){
      //operation complete
      if(err){
        console.log('getAllUsersProjects : getUsersProject() error: ')
        console.log(err)
      }
      else{
        if(results.length > 0){
          if(published === true){
            //call is from game browser, only return published projects
            if(results[1] !== undefined){ // if there is a duplicated project
              //if(results[1].hasOwnProperty('publishedForPlay')){
                if(results[0].published === true && results[1].publishedForPlay === true){
                  console.log('users project for browser retreived')
                  console.log(results)
                  project.title = results[0].title
                  project.author = results[0].author
                  project.description = results[0].description
                  project.imageLink = results[0].imageLink
                  project.gameLink = results[0].gameLink
                  project.published = results[0].published
                  project.dateCreated = results[0].dateCreated
                  project.lastModified = results[0].lastModified
                }
              //}
            }

          }
          else{
            //call is from create.html. load all projects
            console.log('users project for create retreived')
            console.log(results)
            project.title = results[0].title
            project.author = results[0].author
            project.description = results[0].description
            project.imageLink = results[0].imageLink
            project.gameLink = results[0].gameLink
            project.published = results[0].published
            project.dateCreated = results[0].dateCreated
            project.lastModified = results[0].lastModified
          }

        }
        else{
          console.log('getProjectAttributes(): No published project found called ' + project.projName + ' by ' + username)
        }
      }
      db.close();
      callback()

    });
   }
  });
}
