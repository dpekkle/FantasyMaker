goog.provide('project');
goog.require('initCanvas');

console.log("Entering project.js");

var project_project = {};

function project_createNewProject(){
	
	project_project = {
		"projectOwner" : "Admin",
		"projectName" : "newTest",
		"graph" : [],
		"statTypes" : []
	}
	
	//adding default statTypes for the moment, to be replaced with dynamic statType creation
	project_project.statTypes.push( { "type" : "MAGIC"} );
	project_project.statTypes.push( { "type" : "SPIRIT"} );
	project_project.statTypes.push( { "type" : "STRENGTH"} );
	
}

function project_updateProject(){
	project_project.graph = cy.elements().jsons();
}

