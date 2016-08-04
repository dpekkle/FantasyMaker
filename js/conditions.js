goog.provide("conditions");

console.log("Enter conditions.js");

//function to create an condition object for graph transveral logic.
function conditions_createCondition(edge, stat, comp, val){
	
	//need to validate stat
	
	//validate comp
	if( comp != "=" && comp != ">" && comp != "<" && comp != ">=" && comp != "<=" ){
		console.log("conditions_createCondition(): invalid comparison parameter. Could not generate condition object.");
		return;
	}
	
	//validate val
	if(isNaN(val) == true || val == ""){
		console.log("conditions_createCondition(): invalid value parameter(Not a number). Could not generate condition object.");
		return;
	}
	
	var jsonObj = {
		"edge" : edge.data.id, 			//associated edge
		"id" : getNextConditionID(edge), //id within edge
		"stat" : stat, 					//Attribute type. eg magic,strength etc.
		"comparison" : comp, 			//comparison method, eg =,>,<= etc.
		"value" : val 					//value to be evaluated, int/float.
	}
	
	return jsonObj;
}

//function to create an outcome object for graph transveral logic.
function conditions_createOutcome(edge, stat, mod, val){
	
	//validate stat 
	
	//validate mod
	if( mod != "+" && mod != "-" && mod != "/" && mod != "*" ){
		console.log("conditions_createOutcome(): invalid modifier parameter. Could not generate outcome object.");
		return;
	}
	
	//validate val
	if(isNaN(val) == true || val == ""){
		console.log("conditions_createOutcome(): invalid value parameter(Not a number). Could not generate outcome object.");
		return;
	}
	
	var jsonObj = {
		"edge" : edge.data.id, 			//associated edge
		"id" : getNextOutcomeID(edge), 	//id within edge
		"stat" : stat,
		"modifier" : mod,				//plus,minus etc
		"value" : val
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