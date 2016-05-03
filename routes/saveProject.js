var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var bodyParser = require('body-parser');
var serverPath = 'mongodb://localhost/';
var async = require('async');

module.exports = function(app){

	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

    //route for handling POST to '/saveProject'
	app.post('/saveProject',function(req,res){
		var json = JSON.parse(req.body.save);
		var deletedObjects = JSON.parse(req.body.deletedObjects);
		//console.log(deletedObjects);
		//console.log(json);
		
		//add name of project to url for db connection
		var url = serverPath + req.body.projectOwner;

		MongoClient.connect(url, function (err, db) {
		  if (err) {
			res.send('Unable to connect to the mongoDB server.');
		  } else {
			//successful connection
			var collection = db.collection(req.body.projectName); //get save file based on projectName
			
			var asyncTasks = []; //array to hold async functions to be completed
			
			//add updateDB() to asyncTasks array.
			asyncTasks.push(function(callback){ 
				updateDB(json,collection,callback);
			});
			
			//add deleteDB() to asyncTasks array.
			asyncTasks.push(function(callback){ 
				deleteDB(deletedObjects,collection,callback);
			});
			
			//execute all functions in asyncTask array
			async.parallel(asyncTasks,function(){
				//once all async tasks have completed, close db and return.
				console.log("/saveProject: User '"+ req.body.projectOwner + "' has saved their project '" + req.body.projectName + "' successfully.");
				db.close();
				res.send("200 ok");
			});
			
		  }
		});
		
	});

}

function deleteDB(json,collection,callback){
	//asyncronosly process deletes of elements in json array
	async.each(json,//the deleted elemets array
			
		function(obj, callback){ //function to process each element in array
			//remove elemet from database
			collection.remove({ "data.id": obj.data.id}, function(err,results){
				//once element is removed, alert async.each that task has finished.
				callback();
			});
		},
		function(err){
			//all async tasks have finished.
			callback(); // alert async.parallel that all tasks have finished.
		}
	);
}

function updateDB(json,collection,callback){
	//asyncronosly process updates and inserts of elements in json array
	async.each(json,//the array of elements to be updated or inserted
		
		function(obj, callback){ //function to process each element in array
					
			//check whether obj already exists in DB
			collection.find({ "data.id": obj.data.id}).count(function(err,results){
				//if obj already exists
				if(results > 0){
					//update obj in DB
					collection.updateOne({"data.id": obj.data.id}, obj, function(err,res){
						callback();//alert async.each that task is complete
					});
				}
				else{
					//obj does not exist in DB
					//insert obj into DB
					collection.insert(obj,function(){
						callback();//alert async.each that task has complete
					});
				}
			});
		},
		function(err){
			//all async tasks finished
			callback(); //alert async.parallel that all tasks have completed
		}
	);
}