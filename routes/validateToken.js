/*
	Name:
	Created By:
	Purpose:
*/

var bodyParser = require('body-parser');
var serverPath = 'mongodb://localhost/';
var jwtauth = require('./jwtAuth.js')

module.exports = function(app){

	//route for handling POST to '/saveProject2'
	app.get('/validateToken',jwtauth,function(req,res){
		console.log('validateToken entered')
    res.send('VALID_TOKEN')
	});
}
