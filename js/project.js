goog.provide('project');
goog.require('initCanvas');

console.log("Entering project.js");

var project_project = project_createNewProject();
project_updateProject(); //set up by default
defaultState();
function project_createNewProject(){

	var newProj = {
		"projectOwner" : "none",
		"projectName" : "none",
		"graph" : [],
		"gameAttributes" : {}
	}

	return newProj;
}

//Add top level attribute directly under gameAttributes
function project_addGameAttribute(name){
	var attID = generateID();
	project_project["gameAttributes"][attID] = new GameAttribute(null, null, name, attID, 50);
	//TODO - CREATE HTML AND BIND ID TO HTML
	console.log("new top level attribute added: " + project_project["gameAttributes"][attID].path[0]);
}


function project_updateProject(){

	//instantiate a new project if projectName has not been set
	if(project_project.projectOwner == "none"){
		console.log("Creating new project");
		project_project.projectOwner = "Admin";
		project_project.projectName = "newDemo";
		project_project.graph = cy.elements().jsons();
		//adding default statTypes for the moment, to be replaced with dynamic statType creation
		/* project_project.statTypes.push( { "type" : "MAGIC"} );
		project_project.statTypes.push( { "type" : "SPIRIT"} );
		project_project.statTypes.push( { "type" : "STRENGTH"} );
		//add default character
		character = {}
		for(var i = 0; i< project_project.statTypes.length; i++){
			character[project_project.statTypes[i].type] = 0
		}
		project_project.characters.push(character) */
	}
	else{
		console.log("Updating project...");
		project_project.graph = cy.elements().jsons();
	}

}
