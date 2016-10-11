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
      filter = {"published": true}
    }
    else{
      filter = {}
    }
    collection.find(filter,{"title": true,"author": true,"description": true,"imageLink": true,"gameLink": true, "published": true, "dateCreated": true, "lastModified": true ,"_id":false}).toArray(function(err, results){
      //operation complete
      if(err){
        console.log('getAllUsersProjects : getUsersProject() error: ')
        console.log(err)
      }
      else{
        if(results.length > 0){
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
