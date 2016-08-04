goog.provide('edgeOverlay')
goog.require('project')
goog.require('conditions')

var edgeOverlay_newConditionCount = 0; //used to identify how many conds user has added to ui
var edgeOverlay_newOutcomeCount = 0; //used to identify how many outcomes user has added to ui
var edgeOverlay_selectedEdge; // edge that the user is modifying (DAZ NOTE - NOT USED?) 

function populateEdgeOverlay(edge){
	
	//reset for new page overlay
	edgeOverlay_newConditionCount = 0; 
	edgeOverlay_newOutcomeCount = 0; 
	edgeOverlay_selectedEdge = edge;

	//for all condition in edge
	for(var i = 0; i<edge.data.conditions.length; i++){
		var curr = edge.data.conditions[i]; 
		console.log(curr)
		
		//add condition to ui
		edgeOverlay_addExistingCondition("conditionsList",curr); // adds default condition html to ui
		
	}
	
	//for all outcome in edge
	for(var i = 0; i<edge.data.outcomes.length; i++){
		var curr = edge.data.outcomes[i]; 
		
		//add condition to ui
		edgeOverlay_addExistingOutcome("outcomesList",curr); // adds default outcome html to ui
	}
}

function saveEdge(selectedEdge, mode){
	
	var currEdge = selectedEdge.json();
	
	//save all existing conditions
	for(var i = 0; i<currEdge.data.conditions.length; i++){
		var temp = currEdge.data.conditions[i];
		var id = 'exCondition_' + temp.edge + '_' + temp.id
		
		temp.stat = $('#' + id + '_statTypeList').val()
		temp.comparison = $('#' + id + '_compList').val()
		temp.value = $('#' + id + '_value').val()
	}
	
	//save all existing outcomes
	for(var i = 0; i<currEdge.data.outcomes.length; i++){
		var temp = currEdge.data.outcomes[i];
		var id = 'exOutcome_' + temp.edge + '_' + temp.id
		
		temp.stat = $('#' + id + '_statTypeList').val()
		temp.modifier = $('#' + id + '_modList').val()
		temp.value = $('#' + id + '_value').val()
	}
	
	//only the edge overlay will be handling new conds/outcomes
	if(mode === "EDGE_OVERLAY"){
		//save all new conditions
		for(var i = 0; i<edgeOverlay_newConditionCount; i++){
			//get values of menus/text from ui
			var stat = $('#newCondition_statTypeList' + i).val();
			var comp = $('#newCondition_compList' + i).val();
			var val = $('#newCondition_value' + i).val();
			
			//convert ui condition row into json obj
			var newCond = conditions_createCondition(currEdge, stat, comp, val); 
			
			console.log(newCond)
			
			if(newCond !== undefined){
				currEdge.data.conditions.push(newCond);
			}
			
		}
		
		//save all new outcomes
		for(var i = 0; i<edgeOverlay_newOutcomeCount; i++){
			//get values of menus/text from ui
			var stat = $('#newOutcome_statTypeList' + i).val();
			var mod = $('#newOutcome_modList' + i).val();
			var val = $('#newOutcome_value' + i).val();
			
			//convert ui condition row into json obj
			var newOut = conditions_createOutcome(currEdge, stat, mod, val); 
			
			console.log(newOut)
			
			if(newOut !== undefined){
				currEdge.data.outcomes.push(newOut);
			}
			
		}
	}
	
	
}



//populate statType drop down menus based on contents of project_project.statTypes array
function populateStatsDropDownMenu(listID){
	
	var id = '#' + listID;
	//for all defined stat types
	for(var i = 0; i<project_project.statTypes.length; i++){
		//append element to drop down menu
		$(id).append( '<option value="' + project_project.statTypes[i].type + '">' + project_project.statTypes[i].type + "</option>");
		$(id).material_select();
	}

} 



function edgeOverlay_addNewCondition(listID){

	//html of condition row
	var conditionHtml = '<li id="' + 'newCondition_' + edgeOverlay_newConditionCount + '"><div class="input-field col s12" style = "display: inline-block; width: 20%; padding-left: 3%"><select id="newCondition_statTypeList' + edgeOverlay_newConditionCount +'"></select></div><div class="input-field col s12" style = "display: inline-block; width: 20%; padding-left: 1%; padding-right: 1%;"><select id="newCondition_compList' + edgeOverlay_newConditionCount +'"><option value=">">></option><option value="<"><</option><option value=">=">>=</option><option value="<="><=</option><option value="=">=</option></select></div><input placeholder="Enter Value" id="newCondition_value' + edgeOverlay_newConditionCount +'" type="number" class="validate" style = "display: inline-block; width: 20%;"><div id="DummyDiv" class="input-field col s12" style = "display: inline-block; width: 30%;"></div><a id="newCondition_delete' + edgeOverlay_newConditionCount +'" class="btn-floating btn waves-effect waves-light red" onclick=removeCondition(' + "'" + 'newCondition_' + edgeOverlay_newConditionCount + "'" + ')><i class="material-icons">delete</i></a></li>';
	
	//add html to conditionList html element
	$('#' + listID).append(conditionHtml);
	
	//do fancy animation
	$('#' + 'newCondition_' + edgeOverlay_newConditionCount).hide(0,function(){
		$('#' + 'newCondition_' + edgeOverlay_newConditionCount).show(300);
	});
	
	
	$('#newCondition_statTypeList' + edgeOverlay_newConditionCount).material_select();
	$('#newCondition_compList' + edgeOverlay_newConditionCount).material_select();
	populateStatsDropDownMenu('newCondition_statTypeList' + edgeOverlay_newConditionCount); //populate the statType menu

	edgeOverlay_newConditionCount++;
}

function edgeOverlay_addNewOutcome(listID){


	//html of outcome row
	var outcomeHtml = '<li id= newOutcome_' + edgeOverlay_newOutcomeCount + '><div class="input-field col s12" style = "display: inline-block; width: 20%; padding-left: 3%"><select id="newOutcome_statTypeList' + edgeOverlay_newOutcomeCount +'"></select></div><div class="input-field col s12" style = "display: inline-block; width: 20%; padding-left: 1%; padding-right: 1%;"><select id="newOutcome_modList' + edgeOverlay_newOutcomeCount +'"><option value="+">+</option><option value="-">-</option><option value="*">*</option><option value="/">/</option><option value="=">=</option></select></div><input placeholder="Enter Value" id="newOutcome_value' + edgeOverlay_newOutcomeCount +'" type="number" class="validate" style = "display: inline-block; width: 20%;"><div id="DummyDiv" class="input-field col s12" style = "display: inline-block; width: 30%;"></div><a id="newOutcome_delete' + edgeOverlay_newOutcomeCount +'" class="btn-floating btn waves-effect waves-light red" onclick=removeOutcome('+ "'newOutcome_" + edgeOverlay_newOutcomeCount + "'" + ')><i class="material-icons">delete</i></a></li>';	
	
	//add html to outcomeList
	$('#' + listID).append(outcomeHtml);
	
	//do fancy animation
	$('#' + 'newOutcome_' + edgeOverlay_newOutcomeCount).hide(0,function(){
		$('#' + 'newOutcome_' + edgeOverlay_newOutcomeCount).show(300);
	});
	
	$('#newOutcome_statTypeList' + edgeOverlay_newOutcomeCount).material_select();
	$('#newOutcome_modList' + edgeOverlay_newOutcomeCount).material_select();
	populateStatsDropDownMenu('newOutcome_statTypeList' + edgeOverlay_newOutcomeCount); //populate the statType menu
	edgeOverlay_newOutcomeCount++;
}

function edgeOverlay_addExistingCondition(listID, cond){
	//html of condition row
	var id = 'exCondition_' + cond.edge + '_' + cond.id
	var conditionHtml = '<li id="' + id + '"><div class="input-field col s12" style = "display: inline-block; width: 20%; padding-left: 3%"><select id="' + id + '_statTypeList' + '"></select></div><div class="input-field col s12" style = "display: inline-block; width: 20%; padding-left: 1%; padding-right: 1%;"><select id="' + id + '_compList' +'"><option value=">">></option><option value="<"><</option><option value=">=">>=</option><option value="<="><=</option><option value="=">=</option></select></div><input placeholder="Enter Value" id="' + id + '_value' + '" type="number" class="validate" style = "display: inline-block; width: 20%;"><div id="DummyDiv" class="input-field col s12" style = "display: inline-block; width: 30%;"></div><a id="' + id + '_delete' +'" class="btn-floating btn waves-effect waves-light red" onclick=removeCondition(' + "'" + id + "'" + ')><i class="material-icons">delete</i></a></li>';
	
	//add html to conditionList html element
	$('#' + listID).append(conditionHtml);
	
	$('#' + id + '_statTypeList').material_select();
	$('#' + id + '_compList').material_select();
	populateStatsDropDownMenu(id + '_statTypeList'); //populate the statType menu
	
	//var id = 'exCondition_' + cond.edge + '_' + cond.id
	//update outcome to reflect curr
	$('#' + id + '_statTypeList').val(cond.stat);
	$('#' + id + '_compList').val(cond.comparison);
	$('#' + id + '_value').val(cond.value);
		
	//refresh drop down boxes
	$('#' + id + '_statTypeList').material_select();
	$('#' + id + '_compList').material_select();
	
	//do fancy animation
	$('#' + id).hide(0,function(){
		$('#' + id).show(300);
	});
	
}



function edgeOverlay_addExistingOutcome(listID, out){
	
	//html of condition row
	var id = 'exOutcome_' + out.edge + '_' + out.id
	var outcomeHtml = '<li id=' + id + '><div class="input-field col s12" style = "display: inline-block; width: 20%; padding-left: 3%"><select id="' + id + '_statTypeList' + '"></select></div><div class="input-field col s12" style = "display: inline-block; width: 20%; padding-left: 1%; padding-right: 1%;"><select id="' + id + '_modList' +'"><option value="+">+</option><option value="-">-</option><option value="*">*</option><option value="/">/</option><option value="=">=</option></select></div><input placeholder="Enter Value" id="' + id + '_value' +'" type="number" class="validate" style = "display: inline-block; width: 20%;"><div id="DummyDiv" class="input-field col s12" style = "display: inline-block; width: 30%;"></div><a id="'+ id + '_delete' +'" class="btn-floating btn waves-effect waves-light red" onclick=removeOutcome('+ "'" + id + "'" + ')><i class="material-icons">delete</i></a></li>';	
	
	//add html to conditionList html element
	$('#' + listID).append(outcomeHtml);
	
	$('#' + id + '_statTypeList').material_select();
	$('#' + id + '_modList').material_select();
	populateStatsDropDownMenu(id + '_statTypeList'); //populate the statType menu
	
	//var id = 'exOutcome_' + out.edge + '_' + out.id
	//update outcome to reflect curr
	$('#' + id + '_statTypeList').val(out.stat);
	$('#' + id + '_modList').val(out.modifier);
	$('#' + id + '_value').val(out.value);
		
	//refresh drop down boxes
	$('#' + id + '_statTypeList').material_select();
	$('#' + id + '_modList').material_select();
	
	//do fancy animation
	$('#' + id).hide(0,function(){
		$('#' + id).show(300);
	});

}



function removeCondition(id){
	//remove html of element
	$('#' + id).hide(300, function(){
		$('#' + id).remove();
	});
	
	//console.log(id)
	var arr = id.split('_')
	
	if(arr[0] === 'newCondition'){
		//new conditon being deleted
	}
	else if(arr[0] === 'exCondition'){
		//existing condtion being deleted
		//delete from model
		var edge = cy.edges("[id='" + arr[1] +"']").json();
		for(var i = 0; i < edge.data.conditions.length; i++){
			if(i === parseInt(arr[2])){
				edge.data.conditions.splice(i,1)
			}
		}
	}
	else{
		console.log("removeCondition(): error in id formatting")
	}
	
}

function removeOutcome(id){
	console.log("Removing outcome " + id);
	//remove html of element
	$('#' + id).hide(300, function(){
		$('#' + id).remove();
	});
	
	//console.log(id)
	var arr = id.split('_')
	
	if(arr[0] === 'newOutcome'){
		//new conditon being deleted
	}
	else if(arr[0] === 'exOutcome'){
		//existing condtion being deleted
		//delete from model
		var edge = cy.edges("[id='" + arr[1] +"']").json();
		for(var i = 0; i < edge.data.outcomes.length; i++){
			if(i === parseInt(arr[2])){
				edge.data.outcomes.splice(i,1)
			}
		}
	}
	else{
		console.log("removeOutcome(): error in id formatting")
	}
}

