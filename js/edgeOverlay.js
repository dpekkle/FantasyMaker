goog.provide('edgeOverlay')
goog.require('project')

var edgeOverlay_constraintCount = 0; //used to identify each drop down list

//populate statType drop down menus based on contents of project_project.statTypes array
function populateStatsDropDownMenu(index){
	var id = '#statTypeList' + index; //id of a single drop down menu
	$(id).children().remove(); //reload list incase of changes between  overlay loads
	 
	 //for all defined stat types
	for(var i = 0; i<project_project.statTypes.length; i++){
		//append element to drop down menu
		 $(id).append( '<option value="' + project_project.statTypes[i].type + '">' + project_project.statTypes[i].type + "</option>");
	}
	
} 

function edgeOverlay_addConstraint(){
	
	//html of constraint row
	var constraintHtml = '<li><ul class="nav nav-pills" id="constraintsList"><li><select class="form-control" id="statTypeList' + edgeOverlay_constraintCount +'"><select></li><li><select class="form-control"><option value="=">=</option><option value=">">></option><option value="<"><</option><option value=">=">>=</option><option value="<="><=</option></select></li><li><input type="text" class="form-control" id="statsValInput" placeholder="Enter value"></li></ul><li>';
	
	//add html to constraintList html element
	$('#constraintList').append(constraintHtml);
	populateStatsDropDownMenu(edgeOverlay_constraintCount); //populate the statType menu

	edgeOverlay_constraintCount++;
}

function edgeOverlay_addOutcome(){
	
	//html of outcome row
	var outcomeHtml = '<li><ul class="nav nav-pills"><li><select class="form-control" id="statTypeList' + edgeOverlay_constraintCount + '"><select></li><li><select class="form-control"><option value="+">+</option><option value="-">-</option><option value="/">/</option><option value="*">*</option><option value="=">=</option></select></li><li><input type="text" class="form-control" id="statsValInput" placeholder="Enter value"></li></ul></li>';
	
	//add html to constraintList
	$('#constraintList').append(outcomeHtml);
	populateStatsDropDownMenu(edgeOverlay_constraintCount); //populate the statType menu
	edgeOverlay_constraintCount++;
}

					
