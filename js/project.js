goog.provide('project');
goog.require('initCanvas');
goog.require('states')
goog.require('httpRequests')
goog.require('projectSettings')
goog.require('users')

console.log("Entering project.js");


//var project_project = project_createNewProject();

/*
project_updateProject(); //set up by default
defaultState();
project_updateProject(); //set up by deafult
*/
var project_project = initEmptyProject('none','none')
defaultState();

//add template_menu_lists from contextMenu.js
//add gridmode and showhandles bools
//add page_templates from pageTemplates.js
function initEmptyProject(username,projName){
	var newProj = {
		"project_templates":
		{
			"Default":
			{
				pagestyle: "width: 800px; flex: 0 0 800px; height:600px; border: 3px solid black",
				outputcontainer: "",
				imgcontainers: [],
				vidcontainers: [],
				textcontainers: [],
				decisioncontainers: [],
			}
		},
		"template_menus": new templateMenuObj(),
		"audio": new audioObj(),

		"projectOwner" : username,
		"projectName" : projName,
		"graph" : [],
		"gameAttributes" : {},
		"attributesHTML" : "",
		"resolution" : {"x": 1000, "y": 800}
	};
	return newProj
}

function project_createNewProject(){
	/*
	myModal.prompt("Create New Project", "Enter the name of your new project", [{name: "Project Name", default: "", type: "text"}], function(results){
			if(!myModal.confirm) //don't run if cancel clicked
				return;

				project_project = initEmptyProject(users_getUsername(),results[0].trim())
				cy.elements().remove()
				$.when(http_save(project_project)).done($('#UI_projName').text('Project: ' + project_project.projectName),showMainContent(),http_getUsersProjects(users_getUsername(),projectSettings_userProjectsNames))
		});
*/

		myModal.prompt("Create New Project", "You should manually save this project once you've created it to ensure that you can access it from any computer.",
		[{name: "Project Title", default: "", type: "text"}],
		function(results)
		{
			project_project = initEmptyProject(users_getUsername(),results[0].trim())
			cy.elements().remove()
			$.when(http_save(project_project)).done($('#UI_projName').text('Project: ' + project_project.projectName),showMainContent(),http_getUsersProjects(users_getUsername(),projectSettings_userProjectsNames))
		},
		function(results) //this is the verification function
		{
			console.log("Verifying ", results[0]);
			if (results[0] == "")
			{
				console.log("Project name empty");
				return false;
			}
			else
			{
				console.log("Project name succesfully verified");
				return true;
			}
		});
}

//Add top level attribute directly under gameAttributes
function project_addTopGameAttributeFolder(name){
	var attID = generateID();
	project_project["gameAttributes"][attID] = new GameAttribute(null, null, name, attID, false);
	var newAttributeHTML = '<li class="' + attID  + '-list-element margin pointer"><a onclick="gameAttributes_display('+ '\'' + attID + '\'' + ')">' + name + '</a><ul id="' + attID + '-inner_list"></ul></li>';
	$('#attributes-list').append(newAttributeHTML);
	console.log("new top level attribute added: " + project_project["gameAttributes"][attID].path);
}


function project_updateProject(){

	//instantiate a new project if projectName has not been set
	if(project_project.projectOwner == "none"){
		console.log("Creating new project");
		project_project.projectOwner = "Admin";
		project_project.projectName = "newDemo";
		project_project.graph = cy.elements().jsons();

	}
	else{
		console.log("Updating project...");
		project_project.graph = cy.elements().jsons();
	}

}

function project_saveProject(){
	project_updateProject()
	http_save(project_project)
}

function project_showMainContent(){
	if(!$('#projectMain').hasClass('hide')){
		$('#projectMain').addClass('hide')
	}

	if($('#mainContent').hasClass('hide')){
		$('#mainContent').removeClass('hide')
	}
}

function project_login(){
	myModal.prompt("Login", "Login as an existing user.", [{name: "Username", default: "", type: "text"},{name: "Password", default: "", type: "password"}], function(results){
			if(!myModal.confirm) //don't run if cancel clicked
				return;
				var res = {
					"data" : {}
				}
				$.when(http_login(results[0],results[1],res)).done(function(){

					if(res.data !== 'INVALID_USERNAME' || res.data !== 'INVALID_PASSWORD' || res.data !== 'SERVER_ERR'){
						users_flushToken()
						window.localStorage.setItem('token', JSON.stringify(res.data))
						project_successfulLogin()
					}
					else{
						console.log('invalid credentials')
					}
				})

		});
}

function project_successfulLogin(){
	console.log(users_getUsername() + ' logged in')
	$('#login_button').hide()
	$('#signup_button').hide()
	$('#project_button').removeClass('hide')
	$('#profile_button').removeClass('hide')
	$('#settings_button').removeClass('hide')
	$('#profile_button').text(users_getUsername())
	$("#profile_button").dropdown();
	Materialize.toast("Welcome back " + users_getUsername() + "!", 3000, 'rounded')
}

function project_signUp(){
	myModal.prompt("Sign Up", "Sign up as a new user.", [{name: "Username", default: "", type: "email"},{name: "Password", default: "", type: "password"},{name: "Confirm Password", default: "", type: "password"}], function(results){
			if(!myModal.confirm) //don't run if cancel clicked
				return;
			if(results[0] !== undefined && results[1] !== undefined && results[2] !== undefined && results[1] === results[2]){
				var newUser = users_generateNewUser()
				newUser.username = results[0]
				newUser.password = results[1]
				var ret = ''
				$.when(http_signUp(newUser,ret)).done(function(ret){
					if(ret === 'VALID'){
						Materialize.toast("User '" + results[0] + "' Created", 3000, 'rounded')
					}
					else{
						Materialize.toast("User '" + results[0] + "' already exists", 3000, 'rounded')
					}
				})
			}
		});
}

function project_logOut(){
	myModal.prompt("Log Out", "Are you sure you wish to log out? unsaved progress may be lost.",[],function(results){
			if(!myModal.confirm) //don't run if cancel clicked
				return;

			console.log(users_getUsername() + ' logged out')
			$('#project_button').addClass('hide')
			$('#profile_button').addClass('hide')
			$('#settings_button').addClass('hide')
			$('#login_button').show()
			$('#signup_button').show()
			$('#profile_button').text('')
			users_flushToken()
			http_redirectHome()

		});
}
