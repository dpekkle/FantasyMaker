/*
	Name:play
	Created By: Darryl
	Purpose: allow user to play a game
*/

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var bodyParser = require('body-parser');
//var jwt = require('jwt-simple');
//var moment = require('moment')
var serverPath = 'mongodb://localhost/';
//var async = require('async');

module.exports = function(app){

	//bodyParser has a payload limit. Set to 50mb.
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

	//route for handling POST to '/saveProject2'
	app.get('/play/:username/:projName',function(req,res){
		console.log('entering play')
    //res.send(req.params)
    //res.redirect('/create.html')
		if(req.params.username !== undefined && req.params.projName !== undefined){
			res.cookie('FM_playUsername',req.params.username,{ maxAge: 900000, httpOnly: false})
			res.cookie('FM_playProject',req.params.projName,{ maxAge: 900000, httpOnly: false})
	    res.redirect('/play.html')
		}
		else{
			res.send('INVALID PARAMTERS')
		}

	});
}
