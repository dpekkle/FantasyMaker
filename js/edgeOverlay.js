goog.provide('edgeOverlay')
goog.require('project')
goog.require('conditions')

var edgeOverlay_conditionCount = 0; //used to identify how many conds user has added to ui
var edgeOverlay_outcomeCount = 0; //used to identify how many outcomes user has added to ui
var edgeOverlay_selectedEdge; // edge that the user is modifying

//TODO - Get this working with materialize

function populateEdgeOverlay(edge){
	
	
	//reset for new page overlay
	edgeOverlay_conditionCount = 0; 
	edgeOverlay_outcomeCount = 0; 
	edgeOverlay_selectedEdge = edge;

	//for all condition in edge
	for(var i = 0; i<edgeOverlay_selectedEdge.data.conditions.length; i++){
		var curr = edgeOverlay_selectedEdge.data.conditions[i]; 
		
		//add condition to ui
		edgeOverlay_addCondition(); // adds default condition html to ui
		
		//update condition to reflect curr
		$('#condition_statTypeList' + i).val(curr.stat);
		$('#condition_compList' + i).val(curr.comparison);
		$('#condition_value' + i).val(curr.value);
		
		//refresh drop down boxes
		$('#condition_statTypeList' + i).material_select();
		$('#condition_compList' + i).material_select();
		
	}
		
	
	//for all outcomes in edge
	for(var i = 0; i<edgeOverlay_selectedEdge.data.outcomes.length; i++){
		var curr = edgeOverlay_selectedEdge.data.outcomes[i]; 
		
		//add condition to ui
		edgeOverlay_addOutcome(); // adds default condition html to ui
		
		//update condition to reflect curr
		$('#outcome_statTypeList' + i).val(curr.stat);
		$('#outcome_modList' + i).val(curr.modifier);
		$('#outcome_value' + i).val(curr.value);
		
		//refresh drop down boxes
		$('#outcome_statTypeList' + i).material_select();
		$('#outcome_modList' + i).material_select();
	}
		
}

function saveEdge(){
	
	//for all conditions in ui
	for(var i = 0; i<edgeOverlay_conditionCount; i++){
		
		//get values of menus/text from ui
		var stat = $('#condition_statTypeList' + i).val();
		var comp = $('#condition_compList' + i).val();
		var val = $('#condition_value' + i).val();
		
		//convert ui condition row into json obj
		var newConst = conditions_createCondition(stat,comp,val); 
		
		if(newConst != null){
			//check if updating existing condition or creating new condition -- Danielle Note: This will need to be more robust if we add in deletion of conditions
			if(i < edgeOverlay_selectedEdge.data.conditions.length){
				//condition already exists, update
				edgeOverlay_selectedEdge.data.conditions[i] = newConst;
			}
			else{
				//new condition, add
				edgeOverlay_selectedEdge.data.conditions.push(newConst);
			}
		}
		
	}
	
	//for all outcomes in ui
	for(var i = 0; i<edgeOverlay_outcomeCount; i++){
		
		//get values of menus/text from ui
		var stat = $('#outcome_statTypeList' + i).val();
		var mod = $('#outcome_modList' + i).val();
		var val = $('#outcome_value' + i).val();
		
		
		//convert ui condition row into json obj
		var newOut = conditions_createOutcome(stat,mod,val); 
		
		if(newOut != null){
			//check if updating existing condition or creating new condition
			if(i < edgeOverlay_selectedEdge.data.outcomes.length){
				//condition already exists, update
				edgeOverlay_selectedEdge.data.outcomes[i] = newOut;
			}
			else{
				//new condition, add
				edgeOverlay_selectedEdge.data.outcomes.push(newOut);
			}
		}
	}
}



//populate statType drop down menus based on contents of project_project.statTypes array
function populateStatsDropDownMenu(index, type){
	
	var id="";
	//check whether drop down menu to be populated is for conditions or outcomes
	if(type == "CONDITION"){
		id = '#condition_statTypeList' + index; 
	}
	else if(type == "OUTCOME"){
		id = '#outcome_statTypeList' + index; 
	}
	else{
		console.log("edgeOverlay_populateStatsDropDownMenu(): error - invalid type");
		return;
	}
	
	 //for all defined stat types
	for(var i = 0; i<project_project.statTypes.length; i++){
		//append element to drop down menu
		$(id).append( '<option value="' + project_project.statTypes[i].type + '">' + project_project.statTypes[i].type + "</option>");
		$(id).material_select();
	}
	
	
	
} 



function edgeOverlay_addCondition(){

	//TODO - this is still using Bootstrap - fix
	//html of condition row
	var conditionHtml = '<li><div class="input-field col s12" style = "display: inline-block; width: 20%; padding-left: 3%"><select id="condition_statTypeList' + edgeOverlay_conditionCount +'"></select></div><div class="input-field col s12" style = "display: inline-block; width: 20%; padding-left: 1%; padding-right: 1%;"><select id="condition_compList' + edgeOverlay_conditionCount +'"><option value=">">></option><option value="<"><</option><option value=">=">>=</option><option value="<="><=</option><option value="=">=</option></select></div><input placeholder="Enter Value" id="condition_value' + edgeOverlay_conditionCount +'" type="number" class="validate" style = "display: inline-block; width: 20%;"><div id="DummyDiv" class="input-field col s12" style = "display: inline-block; width: 30%;"></div><a id="condition_delete' + edgeOverlay_conditionCount +'" class="btn-floating btn waves-effect waves-light red" onclick=removeCondition(' + edgeOverlay_conditionCount + ')><i class="material-icons">delete</i></a></li>';
	
	//add html to conditionList html element
	$('#conditionsList').append(conditionHtml);
	$('#condition_statTypeList' + edgeOverlay_conditionCount).material_select();
	$('#condition_compList' + edgeOverlay_conditionCount).material_select();
	populateStatsDropDownMenu(edgeOverlay_conditionCount,"CONDITION"); //populate the statType menu

	edgeOverlay_conditionCount++;
}

function edgeOverlay_addOutcome(){

	//TODO - this is still using Bootstrap - fix
	//html of outcome row
	var outcomeHtml = '<li><div class="input-field col s12" style = "display: inline-block; width: 20%; padding-left: 3%"><select id="outcome_statTypeList' + edgeOverlay_outcomeCount +'"></select></div><div class="input-field col s12" style = "display: inline-block; width: 20%; padding-left: 1%; padding-right: 1%;"><select id="outcome_modList' + edgeOverlay_outcomeCount +'"><option value="+">+</option><option value="-">-</option><option value="*">*</option><option value="/">/</option><option value="=">=</option></select></div><input placeholder="Enter Value" id="outcome_value' + edgeOverlay_outcomeCount +'" type="number" class="validate" style = "display: inline-block; width: 20%;"><div id="DummyDiv" class="input-field col s12" style = "display: inline-block; width: 30%;"></div><a id="outcome_delete' + edgeOverlay_outcomeCount +'" class="btn-floating btn waves-effect waves-light red" onclick=removeOutcome('+ edgeOverlay_outcomeCount +')><i class="material-icons">delete</i></a></li>';	
	//add html to outcomeList
	$('#outcomeList').append(outcomeHtml);
	$('#outcome_statTypeList' + edgeOverlay_outcomeCount).material_select();
	$('#outcome_modList' + edgeOverlay_outcomeCount).material_select();
	populateStatsDropDownMenu(edgeOverlay_outcomeCount,"OUTCOME"); //populate the statType menu
	edgeOverlay_outcomeCount++;
}

function removeCondition(id){
	console.log("Removing condition " + id);
}

function removeOutcome(id){
	console.log("Removing outcome " + id);
}

					
