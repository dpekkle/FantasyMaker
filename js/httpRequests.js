goog.provide('httpRequests')
goog.require('initCanvas')

console.log("Enter httpRequests.js")

//Array to hold elemets of graph to be deleted.
//Elements get deleted via http_save().
var http_modStack = [];

function http_save(){
	console.log("save");
	//console.log("modstack")
	//console.log(JSON.stringify(http_modStack));

	//jquery ajax post request	
	$.ajax({
		type: 'POST',
		url: '/saveProject', 
		data: {
			"save" : JSON.stringify(cy.elements().jsons()),
			"deletedObjects" : JSON.stringify(http_modStack),
			"projectOwner" : "Admin",
			"projectName" : "Demo",
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
			"projectName" : "Demo",
		}, 
		cache: false,
		type: 'GET',
		success: function(data) { 
			console.log(JSON.stringify(data));
			cy.add(data);
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

