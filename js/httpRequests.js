goog.provide('httpRequests')
goog.require('initCanvas')
goog.require('project')

console.log("Enter httpRequests.js")


function http_save(){
	console.log("save");
	
	//project_createNewProject();
	project_updateProject();
	

	//jquery ajax post request	
	$.ajax({
		type: 'POST',
		url: '/saveProject', 
		data: {
			"save" : JSON.stringify(project_project),
		},
		success: function(data) { alert("Graph Saved"); },
		contenttype: "application/json"
	});
	

}

function http_load(){
	console.log("Load");
	
	//remove all elements from graph
	var col = cy.elements();
	cy.remove( col );
	
	//get graph data from server
	$.ajax({
		url: '/getProject', 
		data: {
			"projectOwner" : "Admin",
			"projectName" : "newDemo",
		}, 
		cache: false,
		type: 'GET',
		success: function(data) { 
			//console.log(JSON.stringify(data));
			
			delete data[0]._id; //remove mongos _id attribute
			
			project_project = data[0];
			
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
			
		},
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

