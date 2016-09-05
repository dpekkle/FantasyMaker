goog.provide('project');
goog.require('initCanvas');

console.log("Entering project.js");

var project_project = project_createNewProject();

project_updateProject(); //set up by default
defaultState();
project_updateProject(); //set up by deafult


//add template_menu_lists from contextMenu.js
//add gridmode and showhandles bools
//add page_templates from pageTemplates.js

function project_createNewProject(){

	var newProj = {
		"projectOwner" : "none",
		"projectName" : "none",
		"graph" : [],
		"gameAttributes" : {},
		"attributesHTML" : "",
		"resolution" : {"x": 1000, "y": 800}
	};

	return newProj;
}

//Add top level attribute directly under gameAttributes
function project_addGameAttribute(name){
	var attID = generateID();
	project_project["gameAttributes"][attID] = new GameAttribute(null, null, name, attID, false);
	var newAttributeHTML = '<li class="' + attID  + ' margin">' + name + '<ul id="' + attID + '-inner_list"></ul></li>';
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
		/* 
		 //adding default statTypes for the moment, to be replaced with dynamic statType creation
		 project_project.statTypes.push( { "type" : "MAGIC"} );
		project_project.statTypes.push( { "type" : "SPIRIT"} );
		project_project.statTypes.push( { "type" : "STRENGTH"} );
		//add default character
		character = {}
		for(var i = 0; i< project_project.statTypes.length; i++){
			character[project_project.statTypes[i].type] = 0
		}
		project_project.characters.push(character) 
		TODO - REMOVE COMMENT
		*/
	}
	else{
		console.log("Updating project...");
		project_project.graph = cy.elements().jsons();
	}

}
