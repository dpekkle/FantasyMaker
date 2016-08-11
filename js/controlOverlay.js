goog.provide('controlOverlay')
goog.require('edgeOverlay')

goog.require('project')

var currentDraggedItem = resetCurentDraggedItem()
var currentHoverOver = null

function populateControlOverlay(node){
	
	currentDraggedItem = resetCurentDraggedItem()
	currentHoverOver = null
	
	//load edges from control node priorityList
	for(var i = 0; i<node.json().data.priorityList.length; i++){
		var curr = cy.edges("[id='" + node.json().data.priorityList[i]+ "']").json()
		var edgeHtml = '<li id=connectedEdge_' + curr.data.id + ' ><div id="header_'+ curr.data.id +'" draggable="true" ondragend=handleDragEnd(event) ondrag=handleDrag(event,'+ "'" + curr.data.name + "'" +') ondragenter=handleDragEnter(event) class="collapsible-header">Edge '+ curr.data.name +'</div><div class="collapsible-body"><ul id = "'+ curr.data.id + '_collapsible' +'" class="collapsible" data-collapsible="expandable"><li><div class="collapsible-header">Conditions for '+ curr.data.name +'</div><div class="collapsible-body"><ul id = "controlConditions_' + curr.data.id + '" class="list-unstyled" ></ul></div></li><li><div class="collapsible-header">Outcomes for '+ curr.data.name +'</div><div class="collapsible-body"><ul id = "controlOutcomes_' + curr.data.id + '" class="list-unstyled" ></ul></div></li></ul></div></li>'
		
		$('#connectedEdgesList').append(edgeHtml)
		$('#' + curr.data.id + '_collapsible').collapsible({accordion : false});

		for(var a = 0; a<curr.data.conditions.length; a++){
			edgeOverlay_addExistingCondition('controlConditions_' + curr.data.id, curr.data.conditions[a])
		}
		
		for(var b = 0; b<curr.data.outcomes.length; b++){
			edgeOverlay_addExistingOutcome('controlOutcomes_' + curr.data.id, curr.data.outcomes[b])
		}
	}
}

function saveControl(node){

	node.connectedEdges().forEach(function( ele ){
		saveEdge(ele,"CONTROL_OVERLAY")
	});
	
	updatePriority(node) //save order of edge evaluation priority
	
}

function handleDrag(e, itemName){

	currentDraggedItem.ID = e.target.id
	currentDraggedItem.parentID = "connectedEdge_" + e.target.id.split('_')[1]
	currentDraggedItem.name = itemName
}

function handleDragEnter(e){
	
			
	var dropZone = '<li id="dropZoneOuter"><div id="dropZone" class="collapsible-header" ondrop=handleDrop(event) ondragover=allowDrop(event) style="font-style: italic; background-color: gray; opacity: 0.25;"> Edge '+ currentDraggedItem.name +'</div></li>'
	
	if(currentHoverOver !== e.target.id){ //cant drop item on itself
		console.log(e.target.id)
		currentHoverOver = e.target.id
		
		if(e.target.id.split('_')[0] !== 'dropZone'){ //if hovering over list element
			$('#dropZoneOuter').remove()//remove dropZone
			
			if(e.target.id === "connectedEdgesList"){
				var firstItemID = $('ul#connectedEdgesList li:first').attr('id').split('_')[1]
				$('#' + "connectedEdge_" + firstItemID).before(dropZone)
				//$('#connectedEdgesList').after(dropZone)
				
			}
			else{
				$('#' + 'connectedEdge_' + e.target.id.split('_')[1]).after(dropZone)
			}
			
			
			$('#dropZone').hide()
				
				
			$('#' + currentDraggedItem.ID).hide(300, function(){
				$('#dropZone').show(300)
			})
			
		}
		
		
		
		
		
	}
	
}


function handleDrop(e){
	

	//user has chosen valid drop zone
	var tempHtml = $('#' + currentDraggedItem.parentID).clone()
	$('#' + currentDraggedItem.parentID).remove()
	$('#dropZoneOuter').replaceWith(tempHtml)
	
	//reinit collapsibles(cond/outcome collapsible)
	$('#' + currentDraggedItem.parentID.split('_')[1] + '_collapsible').collapsible({accordion : false});
	
	//for some odd reason, after html for a dragged item has been placed, its style is set to display: none. no idea why - work around til i figure it out.
	$('#' + currentDraggedItem.ID).css('display', 'block')
	
	currentHoverOver = null
	
}

function allowDrop(e){
	e.preventDefault();
}

function handleDragEnd(e){
			
	$('#dropZone').hide(300, function(){
		$('#' + currentDraggedItem.ID).show(300)
	})
}

function resetCurentDraggedItem(){
	ret = {
		"parentID" : "null",
		"ID" : "null",
		"name" : "null"
	}
	return ret
}

function updatePriority(node){
	//dazNote - prob dont need to store usersOrder
	console.log(node.connectedEdges().jsons())
	
	var pList = node.json().data.priorityList // order of edges in control node surrently
	var usersOrder = [] //will store the order that the user has created in the ui
	
	//get order of edges as set by user in ui
	var connectedEdges = $("#connectedEdgesList li"); //get order of list in html
	connectedEdges.each(function(idx, li) {
		
		var pid = $(li).attr('id') 
		if(pid !== undefined){
			var pidSplit = pid.split('_')
			if(pidSplit[0] === 'connectedEdge'){ 
				usersOrder.push(pidSplit[1])			
			}
		}
	});
	
	//save new order to priorityList
	if(pList.length === usersOrder.length){ //daz idiot check
		for(var i = 0; i<pList.length; i++){
			pList[i] = usersOrder[i]
		}
	}

}