goog.provide('httpRequests')
goog.require('initCanvas')

console.log("Enter httpRequests.js")

function http_save(){
	console.log("save");
	
	
	//jquery ajax post request
	$.ajax({
		type: 'POST',
		url: 'php/save.php', //FantasyMaker/php/save.php
		data: JSON.stringify(cy.elements().jsons()), //pass all elements of graph as string
		success: function(data) { alert("Graph Saved"); },
		contentType: "application/json"
	});

}

function http_load(){
	console.log("Load");
	
	//remove all elements from graph
	var col = cy.elements();
	cy.remove( col );
	
	//get graph data from server
	$.get("php/load.php", function(data,status){
		var json = JSON.parse(data); //convert response to JSON
		cy.add(json); //add all elements to graph
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

