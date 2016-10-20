goog.provide('httpRequests')
goog.require('initCanvas')
goog.require('users')
goog.require('navigation')
goog.require('host')
//goog.require('pageTemplates')
//goog.require('project')

console.log("Enter httpRequests.js")


function http_redirectHome(){
	window.location = host_create()
	//users_flushToken()
	//nav_toLogin()

}

function http_save(project_project,ret){

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
				ret.data = true
			}
			else{
				ret.data = false
				console.log(data)
			}
		},
		contenttype: "application/json"
	});


}

function http_load(projName){
	console.log('PROJECT HAS LOADED')
	//projName is expected to be project name with whitespace
	projName = projName.split('_').join(' ')

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
				$.each(project_project.button_list, function(index, val) {
					this.callback = generateJumpButtonCallback();
				});


				$('#UI_projName').text('Project: ' + project_project.title)

				//add nodes first
				for(var i = 0; i<data[0].graph.length; i++){
					//check if element is an edge
					if(data[0].graph[i].group !== "edges"){
						cy.add(data[0].graph[i]);
					}
				}
				//now add the edges
				for(var i = 0; i<data[0].graph.length; i++){
					//check if element is an edge
					if(data[0].graph[i].group == "edges"){
						var newEdge = cy.add(data[0].graph[i]);
						//add event listener to edge
						newEdge.on('tap', function(event){this.select();});
					}
				}

				Materialize.toast("Project '" + project_project.title + "' Loaded", 3000, 'rounded')
				resizeCanvas();
				defaultState();
			}

		},
		contenttype: "application/json"
	});
}

function http_setupCy(){
	//database does not store methods, so we need to create new audioobj initialising it with the stored values - Danni
	//project_project.audio = loadAudioObject(project_project.audio)
	//loadTemplateMenuObj();


	//$('#UI_projName').text('Project: ' + project_project.projectName)

	//for all elements in data
	for(var i = 0; i<project_project.graph.length; i++){
		//check if element is an edge
		if(project_project.graph[i].group == "edges"){
			//add edge to graph
			var newEdge = cy.add(project_project.graph[i]);
			//add event listener to edge
			newEdge.on('tap', function(event){this.select();});

		}
		else{
			cy.add(project_project.graph[i]);
		}
	}
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

				if(data.projects.length > 0){
					ret.projects = data.projects
					/*
					ret.names = data
					for(var i = 0; i<ret.names.length; i++){
						//console.log('GETUSERSRESULTS PROCESSING')
						//console.log(ret.names[i].name)
						ret.names[i].name = ret.names[i].name.split('_').join(' ')
						//console.log(ret.names[i].name)
					}
					*/
				}
				console.log(data)
			}
		},
		contenttype: "application/json"
	});
}

function http_deleteProject(username,projName){
	//projName is expected to be project name with whitespace
	//projName = projName.split('_').join(' ')
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
			ret.data = data
		},
		contenttype: "application/json"
	});
}

//examines response from server for authentication validation
function http_handleAuth(res){
	if(res === 'EXPIRED' || res === 'NO_TOKEN' || res === 'AUTH_ERROR'){
		if(res === 'EXPIRED'){
			console.log('http_handleAuth(): Token is expired')
		}
		else if(res === 'AUTH_ERROR'){
			console.log('http_handleAuth(): auth error')
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

function http_getProjectsForBrowser(ret){
	http_addTokenToHeader()
	return $.ajax({
		url: '/getAllUsersProjects',
		cache: false,
		type: 'GET',
		success: function(data) {
			if(http_handleAuth(data)){
				//console.log('GETUSERSRESULTS')
				//console.log(data)
				//console.log(data)
				ret = data
			}
			//console.log('getAllUsersProjects loaded')
		},
		contenttype: "application/json"
	});
}

function http_validateToken(){
	http_addTokenToHeader()
	return $.ajax({
		url: '/validateToken',
		cache: false,
		type: 'GET',
		success: function(data) {
			if(data === 'EXPIRED' || data === 'NO_TOKEN' || data === 'AUTH_ERROR'){
				if(data === 'EXPIRED'){
					console.log('http_handleAuth(): Token is expired')

				}
				else if(data === 'AUTH_ERROR'){
					console.log('http_handleAuth(): auth error')
				}
				else{
					console.log('http_handleAuth(): No Token')
				}

				users_flushToken() //remove anyexpired tokens
			}
			else{
				//ret = data
				console.log('USER IS ALREADY LOGGED IN')
				$('#profile_button').text(users_getUsername())
				projectSettings_prepThenNavToProjects(project_project)
			}

		},
		contenttype: "application/json"
	});
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
