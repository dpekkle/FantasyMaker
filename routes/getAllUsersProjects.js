var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var bodyParser = require('body-parser');
var jwtauth = require('./jwtAuth.js')
var Async = require('async')
var getProjectAttributes = require('./getProjectAttributes.js')
var serverPath = 'mongodb://localhost/';

module.exports = function(app){

   app.get('/getAllUsersProjects',function(req,res){
     console.log('getAllUsersProjects entered')
     console.log(req.query)
     if(req.query.published === undefined){
       console.log('getAllUsersProjects() error: query.published undefined.' )
       res.send('INVALID')
       return
     }
     var ret = {
       "users" : []
     }
     getAllUsers(ret,function(){ //add all usernames to obj
        // 1st para in async.each() is the array of items
        Async.each(ret.users,
          // 2nd param is the function that each item is passed to
          function(item, outer_callback){
            // Call an asynchronous function, often a save() to DB
            getUsersProjectNames(item,function (){ //add all projects from each user to array
              // Async call is done, alert via callback
              getAllUsersProjects(item,req.query.published,function(){
                outer_callback();
              })

            });
          },
          // 3rd param is the function to call when everything's done
          function(err){
            // All tasks are done now
            /*
            var allProjs = []
            for(var i = 0; i<ret.users.length; i++){
              var projects = ret.users[i].projects
              if(projects.length > 0){
                for(var a=0; a<projects.length; a++){
                  var proj = projects[a]
                  if(proj.hasOwnProperty('author')){
                    allProjs.push(ret.users[i].projects[a])
                  }
                }
              }
            }
            */

            var newRet = {
              'users' : []
            }
            //remove any unpublished games
            for(var i = 0; i<ret.users.length; i++){
              var projects = ret.users[i].projects
              if(projects.length > 0){
                var usr = {
                  'name' : ret.users[i].name,
                  'projects' : []
                }

                for(var a=0; a<projects.length; a++){
                  var proj = projects[a]
                  if(proj.hasOwnProperty('author')){
                    //project is published, add.
                    //ret.users[i].projects.splice(a,1)

                    usr.projects.push(proj)
                  }
                }
                if(usr.projects.length > 0){
                  newRet.users.push(usr)
                }
              }
            }

            /*
            //remove any users with no published games
            var removeIndexes = []
            for(var i = 0; i<ret.users.length; i++){
              if(ret.users[i].projects.length === 0){
                console.log('user ' + ret.users[i].name + ' has no projects')
                ret.users.splice(i,1)
              }
            }
            */


            console.log(JSON.stringify(newRet))
            res.json(newRet)
          }
        );

     })

	});

}

//gets all usernames from database
function getAllUsers(data,callback){
  var url = serverPath + 'SYSTEM_USERS'
  //connect to db
  MongoClient.connect(url, function (err, db) {
    if (err) {
    res.send('getAllUsersProjects(): Unable to connect to the mongoDB server.');
    } else {
      //successful connection
      var collection = db.collection('SYSTEM_USERS');
      collection.find().toArray(function(err, results){
        //operation complete
        if(err){
          console.log('getAllUsers() error: ')
          console.log(err)
        }
        else{
          if(results.length > 0){

            for(var i = 0; i<results.length; i++){
              delete results[i]._id
            }
            data.users = results

            console.log('all users retreived')
            callback()
          }
          else{
            console.log('No users found')
          }
        }
        db.close();
      });
    }
  });
}

//gets all project names from a given user
function getUsersProjectNames(user,callback){
  //connect to db
  var url = serverPath + user.name
  MongoClient.connect(url, function (err, db) {
    if (err) {
    res.send('getAllUsersProjects(): Unable to connect to the mongoDB server.');
    } else {
    //successful connection
      var projs = []
      db.listCollections().toArray(function(err, colNames){

        for(var i = 0; i<colNames.length; i++){ //last element in colNames is system.indexes
          if(colNames[i].name !== 'system.indexes' && colNames[i].name !== 'user_details'){
              var data = {
                "projName" : colNames[i].name
              }
              projs.push(data)
          }
        }
        user.projects = projs
        callback()
      });
    }
  });
}

//gets all data about a users project
function getAllUsersProjects(user,pub,callback){
  var url = serverPath + user.name
  Async.each(user.projects,
    // 2nd param is the function that each item is passed to
    function(item, callback){
      // Call an asynchronous function, often a save() to DB
      getProjectAttributes.getProjectAttributes(item,pub,user.name,function(){
        // Async call is done, alert via callback
        callback();
      });
    },
    // 3rd param is the function to call when everything's done
    function(err){
      // All tasks are done now
      callback()
    }
  );

}

/*
//gets the requires attributes from a users project
function getProjectAttributes(project,username,callback){
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
    //retreive all data in save fil
    //game browser attributes
    collection.find({"published" : true},{"title": true,"author": true,"description": true,"imageLink": true,"gameLink": true, "_id":false}).toArray(function(err, results){
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
        }
        else{
          console.log('No project found called ' + project.projName + ' by ' + username)
        }
      }
      db.close();
      callback()

    });
   }
  });
}
*/
