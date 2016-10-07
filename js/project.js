goog.provide('project');
goog.require('initCanvas');
goog.require('states')
goog.require('httpRequests')
goog.require('projectSettings')

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

function project_createNewProject(projectname){
	project_project = initEmptyProject('Admin', projectname);
	cy.elements().remove()
	$.when(http_save(project_project)).done(projectSettings_populateProjectsList("Admin"),$('#UI_projName').text('Project: ' + project_project.projectName),resizeCanvas())
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
