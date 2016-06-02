goog.provide('project');
goog.require('initCanvas');

console.log("Entering project.js");

var project_project = project_createNewProject();
project_updateProject(); //set up by deafult

function project_createNewProject(){
	
	var newProj = {
		"projectOwner" : "none",
		"projectName" : "none",
		"graph" : [],
		"statTypes" : []
	}
	
	return newProj;
}

function project_updateProject(){
	
	//instantiate a new project if projectName hass not been set
	if(project_project.projectOwner == "none"){
		console.log("Creating new project");
		project_project.projectOwner = "Admin";
		project_project.projectName = "newDemo";
		project_project.graph = cy.elements().jsons();
		//adding default statTypes for the moment, to be replaced with dynamic statType creation
		project_project.statTypes.push( { "type" : "MAGIC"} );
		project_project.statTypes.push( { "type" : "SPIRIT"} );
		project_project.statTypes.push( { "type" : "STRENGTH"} );
	}
	else{
		console.log("Updating project...");
		project_project.graph = cy.elements().jsons();
	}
	
}

