/*
	Name: conditions.js
	Created By: Darryl
	Purpose: to handle the create on condition and outcome JSON objects
*/

goog.provide("conditions");

console.log("Enter conditions.js");

//function to create an condition object for graph transveral logic.
function conditions_createCondition(edge, html){

	var jsonObj = {
		'edge' : edge.data.id,
		"id" : getNextConditionID(edge), //id within edge
		'html' : html
	}

	return jsonObj;
}

//function to create an outcome object for graph transveral logic.
function conditions_createOutcome(edge, html){

	var jsonObj = {
		'edge' : edge.data.id,
		"id" : getNextOutcomeID(edge), //id within edge
		'html' : html
	}
	return jsonObj;
}

function getNextConditionID(edge){

	var id = -1;
	for(var i = 0; i<edge.data.conditions.length; i++){
		if(edge.data.conditions[i].id > id){
			id = edge.data.conditions[i].id;
		}
	}
	return ++id;
}

function getNextOutcomeID(edge){

	var id = -1;
	for(var i = 0; i<edge.data.outcomes.length; i++){
		if(edge.data.outcomes[i].id > id){
			id = edge.data.outcomes[i].id;
		}
	}
	return ++id;
}
