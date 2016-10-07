goog.provide('httpRequests')
goog.require('initCanvas')
goog.require('users')
//goog.require('pageTemplates')
//goog.require('project')

console.log("Enter httpRequests.js")


function http_redirectHome(){
	window.location = 'http://localhost:3000/create.html'
}

function http_save(project_project){
	console.log("save");

	http_addTokenToHeader()
	//jquery ajax post request
	return $.ajax({
		type: 'POST',
		url: '/saveProject',
		data: {
			"save" : JSON.stringify(project_project),
		},
		success: function(data) {
			if(http_handleAuth(data)){
				console.log("Graph Saved")
				Materialize.toast("Project '" + project_project.projectName + "' Saved", 3000, 'rounded')
			}
		},
		contenttype: "application/json"
	});


}

function http_load(projName){
	//projName is expected to be project name with whitespace
	projName = projName.split('_').join(' ')
	console.log("Load");

	http_addTokenToHeader()
	//remove all elements from graph
	var col = cy.elements();
	cy.remove( col );

	//get graph data from server
	$.ajax({
		url: '/getProject',
		data: {
			"projectOwner" : users_getUsername(),
			"projectName" : projName,
		},
		cache: false,
		type: 'GET',
		success: function(data) {
			if(http_handleAuth(data)){
				delete data[0]._id; //remove mongos _id attribute
				project_project = data[0];

				//database does not store methods, so we need to create new audioobj initialising it with the stored values - Danni
				project_project.audio = loadAudioObject(project_project.audio)
				loadTemplateMenuObj();


				$('#UI_projName').text('Project: ' + project_project.projectName)

				//for all elements in data
				for(var i = 0; i<data[0].graph.length; i++){
					//check if element is an edge
					if(data[0].graph[i].group == "edges"){
						//add edge to graph
						var newEdge = cy.add(data[0].graph[i]);
						//add event listener to edge
						newEdge.on('tap', function(event){this.select();});

					}
					else{
						cy.add(data[0].graph[i]);
					}
				}
				Materialize.toast("Project '" + project_project.projectName + "' Loaded", 3000, 'rounded')
				resizeCanvas();
			}

		},
		contenttype: "application/json"
	});
}

function http_getUsersProjects(username,ret){
	http_addTokenToHeader()
	return $.ajax({
		url: '/getUsersProjects',
		data: {
			"username" : username
		},
		cache: false,
		type: 'GET',
		success: function(data) {
			if(http_handleAuth(data)){
				//console.log('GETUSERSRESULTS')
				//console.log(data)
				ret.names = data
				for(var i = 0; i<ret.names.length; i++){
					//console.log('GETUSERSRESULTS PROCESSING')
					//console.log(ret.names[i].name)
					ret.names[i].name = ret.names[i].name.split('_').join(' ')
					//console.log(ret.names[i].name)
				}
			}
			console.log('getUsersProjects loaded')
		},
		contenttype: "application/json"
	});
}

function http_deleteProject(username,projName){
	//projName is expected to be project name with whitespace
	projName = projName.split('_').join(' ')
	//console.log("Delete project");
	http_addTokenToHeader()

	//jquery ajax post request
	return $.ajax({
		type: 'POST',
		url: '/deleteProject',
		data: {
			"username" : username,
			"projName" : projName
		},
		success: function(data) {
			if(http_handleAuth(data)){
				//console.log(data)
				console.log('project deleted')
			}
		},
		contenttype: "application/json"
	});


}

function http_signUp(newUser,ret){
	return $.ajax({
		url: '/signUp',
		data: {
			"data" : newUser
		},
		cache: false,
		type: 'POST',
		success: function(data) {
			if(http_handleAuth(data)){
				ret = data
			}
		},
		contenttype: "application/json"
	});
}

function http_login(uname,pwd,ret){
	return $.ajax({
		url: '/login',
		data: {
			"uname" : uname,
			"pwd" : pwd
		},
		cache: false,
		type: 'POST',
		success: function(data) {
			console.log('LOGIN RES:')
			console.log(data)
			ret.data = data
		},
		contenttype: "application/json"
	});
}

//examines response from server for authentication validation
function http_handleAuth(res){
	console.log('server returned' + res)
	if(res === 'EXPIRED' || res === 'NO_TOKEN'){
		if(res === 'EXPIRED'){
			console.log('http_handleAuth(): Token is expired')
		}
		else{
			console.log('http_handleAuth(): No Token')
		}

		users_flushToken() //remove anyexpired tokens
		http_redirectHome()
		return false
	}
	return true
}

function http_addTokenToHeader(){
	var token = window.localStorage.getItem('token');
	if (token) {
		var tok = JSON.parse(token).token
	  $.ajaxSetup({
	    headers: {
	      'x-access-token': tok
	    }
	  });
	}
}
