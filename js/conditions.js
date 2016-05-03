goog.provide("conditions");

console.log("Enter conditions.js");

//function to create an condition object for graph transveral logic.
function conditions_createCondition(stat, comp, val){
	
	//need to validate stat
	
	//validate comp
	if( comp != "=" && comp != ">" && comp != "<" && comp != ">=" && comp != "<=" ){
		console.log("jsonFactory_createCondition(): invalid comparison parameter. Could not generate condition object.");
		return;
	}
	
	//validate val
	if(isNaN(val) == true){
		console.log("jsonFactory_createCondition(): invalid value parameter(Not a number). Could not generate condition object.");
		return;
	}
	
	var jsonObj = {
		"stat" : stat, 			//Attribute type. eg magic,strength etc.
		"comparison" : eval, 	//comparison method, eg =,>,<= etc.
		"value" : val 			//value to be evaluated, int/float.
	}
	
	return jsonObj;
}

//function to create an outcome object for graph transveral logic.
function conditions_createOutcome(stat, mod, val){
	
	//validate stat 
	
	//validate mod
	if( mod != "+" && mod != "-" && mod != "/" && mod != "*" ){
		console.log("jsonFactory_createOutcome(): invalid modifier parameter. Could not generate outcome object.");
		return;
	}
	
	//validate val
	if(isNaN(val) == true){
		console.log("jsonFactory_createOutcome(): invalid value parameter(Not a number). Could not generate outcome object.");
		return;
	}
	
	var jsonObj = {
		"stat" : stat,
		"modifier" : eval, //plus,minus etc
		"value" : val
	}
	
	return jsonObj;
}