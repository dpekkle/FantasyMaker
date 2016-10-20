goog.provide('project');
goog.require('initCanvas');
goog.require('states')
goog.require('httpRequests')
goog.require('projectSettings')
goog.require('users')
goog.require('navigation')
goog.require('host')

console.log("Entering project.js");

//var host = 'http://localhost:3000/'
//initialise cytoscape etc
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
				"name": "Default",
				"html":	"<li><a onclick=\"chooseNodeTemplate('Default');\">Default</a></li>",
				"data":
				{
					pagestyle: "width: 800px; flex: 0 0 800px; height:600px; border: 3px solid black",
					outputcontainer: "",
					imgcontainers: [],
					vidcontainers: [],
					textcontainers: [],
					decisioncontainers: [],
					buttoncontainers: [],
					specialbuttons: [],
				},
			}
		},
		"button_list":
		{
		},

		"template_menus": new templateMenuObj(),
		"audio": new audioObj(),

		"projectOwner" : username,
		"projectName" : projName,
		"dateCreated" : project_getCurrentTime(),
		"lastModified" : project_getCurrentTime(),
		"published" : false,

		//game browser attributes
		"title" : projName,
		"author" : username,
		"description" : "No description available.",
		"imageLink" : "No URL provided",
		"backgroundLink" : "No URL provided",
		"gameLink" : host_play() + username + '/' + projName,

		"graph" : [],
		"gameAttributes" : {},
		"gameInventory" : {},
		"attributesHTML" : "",
		"resolution" : {"x": 1000, "y": 800}
	};
	return newProj
}

function project_createNewProject(){

		myModal.prompt("Create New Project", "Enter a title for your project.", [{name: "Project Title", default: "", type: "text"}],
				function(results){

				},
				function(results){

					var randProjID = project_generateID()
					project_project = initEmptyProject(users_getUsername(),randProjID)
					project_project.title = results[0]
					cy.elements().remove()
					var ret2 = {
						"data" : []
					}
					$.when(http_save(project_project,ret2)).done(function(){
						if(ret2.data === true){
							Materialize.toast("Project '" + project_project.title + "' created!", 3000, 'rounded')
							$('#prompt-modal').closeModal();
							$('#UI_projName').text('Project: ' + project_project.title)
							nav_toMain()
							http_getUsersProjects(users_getUsername(),projectSettings_userProjects)

						}
						else{
							Materialize.toast("Failed to create project. Please log in again.", 3000, 'rounded')
						}
					})

					/*
					var regex = new RegExp("^[a-zA-Z0-9_-]+$");
					if(results[0] == "")
					{
						myModal.warning("Project ID cannot be empty");
					}
				 	else if(regex.test(results[0]) === false){
						myModal.warning("Project ID can only contain letters, numbers, underscores or hyphens")
					}
					else
					{
						var ret1 = {}
						$.when(http_getUsersProjects(users_getUsername(),ret1)).done(function(){
							if(ret1.hasOwnProperty('projects')){
								for(var i = 0; i<ret1.projects.length; i++){
									if(results[0].trim() === ret1.projects[i].projName){
										myModal.warning('You already have a project with the ID ' + ret1.projects[i].projName + '. Please choose something else.')
										return
									}
								}
							}


							var randProjID = project_generateID()
							project_project = initEmptyProject(users_getUsername(),randProjID)
							project_project.title = results[0]
							cy.elements().remove()
							var ret2 = {
								"data" : []
							}
							$.when(http_save(project_project,ret2)).done(function(){
								if(ret2.data === true){
									Materialize.toast("Project '" + project_project.title + "' created!", 3000, 'rounded')
									$('#prompt-modal').closeModal();
									$('#UI_projName').text('Project: ' + project_project.title)
									nav_toMain()
									http_getUsersProjects(users_getUsername(),projectSettings_userProjects)

								}
								else{
									Materialize.toast("Failed to create project. Please log in again.", 3000, 'rounded')
								}
							})
						})
						*/
					//}
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

function project_saveProject()
{
	//remove all the selections/styles, or they get stuck
	cy.nodes().removeClass('source_node disconnected jumpenderror');
	cy.elements().unselect();
	project_project.graph = cy.elements().jsons();
	project_project.lastModified = project_getCurrentTime()
	var ret0 = {
		'data' : false
	}
	$.when(http_save(project_project,ret0)).done(function(){
		if(ret0.data === true){
			Materialize.toast("Saved project", 3000, 'rounded')
		}
		else{
			Materialize.toast("Failed to save project. Please log in again.", 3000, 'rounded')
		}
	})
}

function project_login(){

		myModal.prompt("Log In", "Log in and continue creating!", [{name: "Username", default: "", type: "text"},{name: "Password", default: "", type: "password"}],
				function(results){
				},
				function(results){

					results[0] = results[0].trim()
					var regex = new RegExp("^[a-zA-Z0-9]+$");
					if(regex.test(results[0]) === false){
						myModal.warning("Usernames can only contain letters and numbers")
						return false
					}

					var res = {
						"data" : {}
					}
					$.when(http_login(results[0],results[1],res)).done(function(){

						if(res.data !== 'INVALID_USERNAME' && res.data !== 'INVALID_PASSWORD' && res.data !== 'SERVER_ERR'){
							project_successfulLogin(res)
							Materialize.toast("Welcome back " + users_getUsername() + "!", 3000, 'rounded')
						}
						else{
							myModal.warning("Login details were invalid. Please try again.");
						}
					})
		});
}

function project_successfulLogin(res){
	users_flushToken()
	window.localStorage.setItem('token', JSON.stringify(res.data))
	$('#prompt-modal').closeModal();
	console.log(users_getUsername() + ' logged in')
	$('#profile_button').text(users_getUsername())
	projectSettings_prepThenNavToProjects(project_project)
}

function project_signUp(){

		myModal.prompt("Sign Up", "Become a game creator with FantasyMaker!", [{name: "Username", default: "", type: "email"},{name: "Password", default: "", type: "password"},{name: "Confirm Password", default: "", type: "password"}],
				function(results){

					},
					function(results){
						results[0] = results[0].trim()
						var regex = new RegExp("^[a-zA-Z0-9]+$");
						if(results[0] === '' || results[1] === '' || results[2] ===''){
							myModal.warning('All fields must be filed out.')
							return false
						}
						else if(results[1] !== results[2]){
							myModal.warning('Your password and confirmation password do not match.')
							return false
						}
						else if(regex.test(results[0]) === false){
							myModal.warning("Usernames can only contain letters and numbers")
							return false
						}
						else{
							var newUser = users_generateNewUser()
							newUser.username = results[0]
							newUser.password = results[1]
							var ret = ''
							$.when(http_signUp(newUser,ret)).done(function(ret){
								if(ret === 'VALID'){
									Materialize.toast("Welcome to FantasyMaker " + results[0] + ".", 3000, 'rounded')
									$('#prompt-modal').closeModal();

									//sign in automatically
									var res = {
										"data" : {}
									}
									$.when(http_login(newUser.username,newUser.password,res)).done(function(){

										if(res.data !== 'INVALID_USERNAME' && res.data !== 'INVALID_PASSWORD' && res.data !== 'SERVER_ERR'){
											project_successfulLogin(res)
										}
										else{
											myModal.warning("Login details were invalid. Please try again.");
										}
									})
								}
								else{
									myModal.warning('That username has already been taken. Please try another username')
								}
							})
						}
				});
}

function project_logOut(){

		myModal.prompt("Log Out", "Are you sure you wish to log out? Any unsaved progress will be lost.",
		[],
		function(results)
		{
			console.log(users_getUsername() + ' logged out')

			nav_toLogin()
			users_flushToken()
			project_project = initEmptyProject('none','none')
			http_redirectHome()
		},
		function(results) //this is the verification function
		{
			//save project locally?
			return true
		});
}

function project_getCurrentTime(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	return dd + '-' + mm + '-' + yyyy
}

function project_modifyTitle(){
	myModal.prompt("Modify Project Title", "Change the title of your project. This will appear as the name of your project in the game browser.", [{name: "Title", default: project_project.title, type: "text"}],
			function(results){
				project_project.title = results[0]
				$('#currentProject_title').text(project_project.title)
				project_saveProject()
			},
			function(results){
				if(results[0] === ''){
					myModal.warning('Title field cannot be empty.')
					return false
				}
				return true
			}
	);
}

function project_modifyAuthor(){
	myModal.prompt("Modify Project Author", "Change the name that appears as the author of your project in the game browser.", [{name: "Author", default: project_project.author, type: "text"}],
			function(results){
				project_project.author = results[0]
				$('#currentProject_author').text(project_project.author)
				project_saveProject()
			},
			function(results){
				if(results[0] === ''){
					myModal.warning('Author field cannot be empty.')
					return false
				}
				return true
			}
	);
}

function project_modifyImage(){
	myModal.prompt("Modify Project Image", "Change the image that appears with your project in the game browser.", [{name: "URL", default: project_project.imageLink, type: "text"}],
			function(results){
				project_project.imageLink = results[0]
				$('#currentProject_imageLink').text(project_project.imageLink)
				project_saveProject()
			},
			function(results){
				if(results[0] === ''){
					myModal.warning('URL field cannot be empty.')
					return false
				}
				return true
			}
	);
}

function project_modifyBackgroundImage(){
	myModal.prompt("Modify Game Background Image", "Change the image that appears in the background when your game is played in the play module.", [{name: "URL", default: project_project.backgroundLink, type: "text"}],
			function(results){
				project_project.backgroundLink = results[0]
				$('#currentProject_backgroundImageLink').text(project_project.backgroundLink)
				project_saveProject()
			},
			function(results){
				if(results[0] === ''){
					myModal.warning('URL field cannot be empty.')
					return false
				}
				return true
			}
	);
}

function project_modifyResolution(){
	myModal.prompt("Modify The Target Resolution Of The Project", "Change the resolution that you intend your viewers to view this game on.", [{name: "Width", default: project_project.resolution.x, type: "number"},{name: "Height", default: project_project.resolution.y, type: "number"}],
			function(results){
				project_project.resolution.x = parseInt(results[0])
				project_project.resolution.y = parseInt(results[1])
				$('#currentProject_resolution').text('Width: ' + project_project.resolution.x + 'px Height: ' +project_project.resolution.y + 'px')
				project_saveProject()
			},
			function(results){
				if(isNaN(parseInt(results[0])) || isNaN(parseInt(results[1]))){
					myModal.warning('Width and height fields cannot be empty.')
					return false
				}
				else if(parseInt(results[0]) < 0 || parseInt(results[1]) < 0){
					myModal.warning('Width and height must be greater than 0')
					return false
				}
				return true
			}
	);
}

//onclick handler for published switch
$( "#pubSwitch" ).click(function() {

	event.preventDefault()
  if($('#pubSwitch').prop('checked')){
		res = 'You have enabled publishing on your project.'
			+' A published project will be viewable to the world through the game browser. '
			+' Click the edit button next to the toggle switch to pusblish this project.'
	}
	else{
		res = 'You have disabled publishing on your project.'
			+ ' People will no longer be able to play your game through the game browser.'
	}
	myModal.prompt("Publish Project", res, [],
			function(results){
				console.log(myModal.confirm)

				var chk = $('#pubSwitch').prop('checked')
				project_project.published = !chk
				if(project_project.published){
					$('#currentProject_gameLink').text(project_project.gameLink)
					$('#currentProject_gameLink').attr('href',project_project.gameLink)
					$('#currentProject_gameLink').attr('href',project_project.gameLink)
					$('#currentProject_gameLink').show()
					$('#currentProject_noGameLink').hide()
					project_updatePublishedHtml(true)
					project_saveProject()
					$('#pubSwitch').prop('checked',true)
				}
				else{
					project_updatePublishedHtml(false)
					$('#currentProject_gameLink').hide()
					$('#currentProject_noGameLink').show()
					project_saveProject()
					$('#pubSwitch').prop('checked',false)
				}

			},
			function(results){
				return true
			}
	);
});

function project_modifyDesc(){
	myModal.prompt("Modify Project Description", "Change the description of your game that appears with your project in the game browser.", [{name: "Description", default: project_project.description, type: "text"}],
			function(results){
				project_project.description = results[0]
				$('#currentProject_desc').text(project_project.description)
				project_saveProject()
			},
			function(results){
				if(results[0] === ''){
					myModal.warning('Description field cannot be empty.')
					return false
				}
				return true
			}
	);
}

function project_updatePublishedHtml(published){
  if(published === true){
    pubHTML =   '<div id="'+project_project.projectName+ '_pub' +'">'
                + '<p style="color: green;">Published</p>'
                +   '<p>Link to play game:'
                +   '<span><a href="'+project_project.gameLink+'" target="_blank">'+project_project.gameLink+'</a></span>'
                + '</p>'
                +'</div>'
  }
  else{
    var pubExpl = 'Load your project and view the settings tab to publish your project for the world to see!'
    pubHTML = '<p id="'+project_project.projectName+ '_pub' +'" class="pubTT tooltipped" data-position="bottom" data-delay="50" data-tooltip="'+pubExpl+'" style="color: red;">Project is not published</p>'
  }
  $('#' + project_project.projectName + '_pub').replaceWith(pubHTML)
  $('.pubTT').tooltip({delay: 50});

}

function project_generateID()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 20; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
