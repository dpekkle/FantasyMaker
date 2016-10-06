goog.provide('httpRequests')
goog.require('initCanvas')
//goog.require('pageTemplates')
//goog.require('project')

console.log("Enter httpRequests.js")



function http_save(project_project){
	console.log("save");
	console.log(project_project)

	//project_createNewProject();
	//project_updateProject();

	//jquery ajax post request
	return $.ajax({
		type: 'POST',
		url: '/saveProject',
		data: {
			"save" : JSON.stringify(project_project),
		},
		success: function(data) {
			console.log("Graph Saved")
			Materialize.toast("Project '" + project_project.projectName + "' Saved", 3000, 'rounded')
		},
		contenttype: "application/json"
	});


}

function http_load(projName){
	console.log("Load");

	//remove all elements from graph
	var col = cy.elements();
	cy.remove( col );

	//get graph data from server
	$.ajax({
		url: '/getProject',
		data: {
			"projectOwner" : "Admin",
			"projectName" : projName,
		},
		cache: false,
		type: 'GET',
		success: function(data) {
			//console.log(JSON.stringify(data));

			delete data[0]._id; //remove mongos _id attribute

			project_project = data[0];
			//console.log(project_project)
			//console.info(project_project.project_templates.Default)
			//selected_page_template = project_project.project_templates.Default;

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


		},
		contenttype: "application/json"
	});
}

function http_getUsersProjects(username,ret){
	return $.ajax({
		url: '/getUsersProjects',
		data: {
			"username" : username
		},
		cache: false,
		type: 'GET',
		success: function(data) {
			console.log(data)
			ret.names = data
		},
		contenttype: "application/json"
	});
}

function http_deleteProject(username,projName){
	console.log("Delete project");

	//project_createNewProject();
	//project_updateProject();

	//jquery ajax post request
	console.log(username + " " + projName)
	return $.ajax({
		type: 'POST',
		url: '/deleteProject',
		data: {
			"username" : username,
			"projName" : projName
		},
		success: function(data) { console.log(data) },
		contenttype: "application/json"
	});


}

function http_delete(elemList){
	console.log("Delete");
	//alert(JSON.stringify(elemList));

	//jquery ajax post request
	$.ajax({
		type: 'POST',
		url: 'php/delete.php', //FantasyMaker/php/save.php
		data: JSON.stringify(elemList), //pass all elements of graph as string
		success: function(data) { /*alert(data); */},
		contentType: "application/json"
	});

}

//function to package a projects information into the correct JSON structure for database storage.
function http_packageProject(uname,graph,statTypes){

	var jsonObj = {
		"username" : uname,
		"graph": [],
		"statTypes" : []
	}

	jsonObj.graph = graph;
	jsonObj.statTypes = statTypes;

	return jsonObj;
}
