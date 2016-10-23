goog.provide('controlOverlay')
goog.require('edgeOverlay')
goog.require('project')

var currentDraggedItem = resetCurentDraggedItem()//used for drag and drop
var currentHoverOver = null	//used for drag and drop
var currentSelectedNode = null //used for setting defaultFailEdge

function populateControlOverlay(node){

	$('#controlnode_name').text('Control Node: ' + node.json().data.name)
	$('#control-empty-text').show();

	currentDraggedItem = resetCurentDraggedItem()
	currentHoverOver = null
	currentSelectedNode = node
	//onmouseover=highlightElement('+ "'" + 'header_'+ curr.data.id + "'" +') onmouseout=resetFromHighlight()
	//load edges from control node priorityList
	for(var i = 0; i<node.json().data.priorityList.length; i++){

		$('#control-empty-text').hide();

		var curr = cy.edges("[id='" + node.json().data.priorityList[i]+ "']").json()
		var edgeHtml =	'<li id=connectedEdge_' + curr.data.id + ' >' +
											'<div id="header_'+ curr.data.id +'" draggable="true" ondragend=handleDragEnd(event) ondragstart=handleDrag(event,'+ "'" + curr.data.name + "'" +') ondragenter=handleDragEnter(event) class="collapsible-header highlight-list">Path '+ curr.data.name +
												'<i id="defaultIcon_' + curr.data.id + '" class="small material-icons"></i>' +
											'</div>' +
											'<div class="collapsible-body">' +
												'<ul id = "'+ curr.data.id + '_collapsible' +'" class="collapsible" data-collapsible="expandable">' +
													'<li>' +
														'<div class="collapsible-header">Conditions for '+ curr.data.name +'</div>' +
														'<div class="collapsible-body">' +
															'<ul id = "controlConditions_' + curr.data.id + '" class="list-unstyled" ></ul>' +
														'</div>' +
													'</li>' +
													'<li>' +
														'<div class="collapsible-header">Outcomes for '+ curr.data.name +'</div>' +
														'<div class="collapsible-body">' +
															'<ul id = "controlOutcomes_' + curr.data.id + '" class="list-unstyled" ></ul>' +
														'</div>' +
													'</li>' +
												'</ul>' +
												'<div class="row" style="text-align: right">' +
													'<div class="col s6 push-s6 m4 push-m8 l3 push-l9"><button type="button" class="btn btn-default" onClick=setDefaultFailEdge(' + "'" + curr.data.id + "'" +')>Set As Default Path</button></div>' +
												'</div>' +
											'</div>' +
										'</li>'

		$('#connectedEdgesList').append(edgeHtml) //add edge to list
		$('#' + curr.data.id + '_collapsible').collapsible({accordion : false}); //init collapsibles

		//add conditions html to edge
		for(var a = 0; a<curr.data.conditions.length; a++){
			edgeOverlay_addExistingCondition('controlConditions_' + curr.data.id, curr.data.conditions[a])
		}

		//add outcome html to edge
		for(var b = 0; b<curr.data.outcomes.length; b++){
			edgeOverlay_addExistingOutcome('controlOutcomes_' + curr.data.id, curr.data.outcomes[b])
		}
	}

	//add default fail edge icon to specified fail edge
	setDefaultFailEdge(node.json().data.defaultFailEdge)

	//bind highlight-list events to list
	activateHighlightList()
}

//saves changes made to conditions/outcomes in control overlay
function saveControl(node){
	node.connectedEdges().forEach(function( ele ){
		saveEdge(ele,"CONTROL_OVERLAY")
	});
	updatePriority(node) //save order of edge evaluation priority
}

//saves thee changes made to the priority of edges in the control node
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

function setDefaultFailEdge(newDefaultEdgeID){

	if(currentSelectedNode !== null && currentSelectedNode !== undefined){

		//remove old default icon
		var oldID = "#defaultIcon_" + currentSelectedNode.json().data.defaultFailEdge
		$(oldID).html("")

		//add new default icon
		var newID = "#defaultIcon_" + newDefaultEdgeID
		$(newID).html("stars")

		//set edge classes for old default fail edge
		cy.$("#" + currentSelectedNode.json().data.defaultFailEdge).removeClass('fail-edge')
		cy.$("#" + currentSelectedNode.json().data.defaultFailEdge).addClass('success-edge')

		//set new default fail edge in control node
		currentSelectedNode.json({ data:{ defaultFailEdge: newDefaultEdgeID }})

		//set edge classes for new default fail edge
		cy.$("#" + newDefaultEdgeID).removeClass('success-edge')
		cy.$("#" + newDefaultEdgeID).addClass('fail-edge')
		console.log("new default is " + newDefaultEdgeID)
	}

}

function removeEdgeFromPriorityList(edge){
	var src = cy.nodes("[id='" + edge.json().data.source + "']")
	if(src !== undefined){
		//remove edge from priorityList
		for(var i = 0; i<src.json().data.priorityList.length; i++){
			if(src.json().data.priorityList[i] === edge.json().data.id){
				src.json().data.priorityList.splice(i,1)
			}
		}

		//check if removed edge was defaultFailEdge
		if(src.json().data.defaultFailEdge === edge.json().data.id){
			if(src.json().data.priorityList.length > 0){
				//set to first element in priorityList
				src.json({data:{defaultFailEdge: src.json().data.priorityList[0]}})
				setDefaultFailEdge(src.json().data.priorityList[0])
			}
			else{
				src.json({data:{defaultFailEdge: "none"}})
			}
		}
	}

}



/*	------------------------------------------ 		EDGE DRAG AND DROP FUNCTIONS	----------------------------- */
function handleDrag(ev, itemName){

	resetFromHighlight(ev.target.id)//handle drag event for highlight-list (leaves drag image coloured)
	ev.dataTransfer.setData("Text", "Dropped in zone!"); //nessecary for mozilla compat

	currentHoverOver = ev.target.id //when item s initially dragged, its always hovering over itself

	//if an item is dragged, close all collapsible-headers
	$( '.collapsible-header.active.highlight-list' ).each(function( index ) {
			$(this).click()
	})

	//set current dragged item
	currentDraggedItem.ID = ev.target.id
	currentDraggedItem.parentID = "connectedEdge_" + ev.target.id.split('_')[1]
	currentDraggedItem.name = itemName

}

//handles the hinding/showing of the dropzone
function handleDragEnter(e){
		//html for dropzone
		var dropZone = '<li id="dropZoneOuter"><div id="dropZone" class="collapsible-header" ondrop=handleDrop(event) ondragover=allowDrop(event) style="font-style: italic; background-color: gray; opacity: 0.25;"> Edge '+ currentDraggedItem.name +'</div></li>'

		if(currentHoverOver !== e.target.id){ //cant drop item on itself
			currentHoverOver = e.target.id

			if(currentHoverOver.split('_')[0] !== 'dropZone'){ //if hovering over list element

				$('#dropZoneOuter').remove()//remove dropZone

				if(currentHoverOver === "connectedEdgesList"){
					//handle case where user is dragging to top of list
					var firstItemID = $('ul#connectedEdgesList li:first').attr('id').split('_')[1]
					$('#' + "connectedEdge_" + firstItemID).before(dropZone) //add dropzone to top of list
				}
				else{
					//handle case where user is dragging to an element in the list ther than the first
					$('#' + 'connectedEdge_' + currentHoverOver.split('_')[1]).after(dropZone) //add dropzone to after currentlyHoverOver list element
				}

				//hide the item that the user dragged then show dropzone
				$('#dropZoneOuter').hide()
				$('#' + currentDraggedItem.ID).hide(0, function(){
					$('#dropZoneOuter').show(0)
				})

			}
		}
	}

function handleDrop(e){
	e.preventDefault(); //nessecary for mozilla compat

	//replace dropzone with dragged item html
	var tempHtml = $('#' + currentDraggedItem.parentID).clone()
	$('#' + currentDraggedItem.parentID).remove()
	$('#dropZoneOuter').replaceWith(tempHtml)

	//reinit collapsibles(cond/outcome collapsible)
	$('#' + currentDraggedItem.parentID.split('_')[1] + '_collapsible').collapsible({accordion : false});

	//show element
	$('#' + currentDraggedItem.ID).show()

	currentHoverOver = null //element is no longer being dragged
	activateHighlightListElement(currentDraggedItem.ID)//rebind highlight-list events to dragged item
}

//hides the dropzone when user drags out of a list element
function handleDragEnd(e){
	$('#dropZoneOuter').hide(0, function(){
		$('#' + currentDraggedItem.ID).show(0)
	})
}

function allowDrop(e){
	e.preventDefault();
}

function resetCurentDraggedItem(){
	ret = {
		"parentID" : "null",
		"ID" : "null",
		"name" : "null"
	}
	return ret
}





/*------------------------------ HIGHLIGHT-LIST FUNCTIONS -----------------------------------*/
//binds events to a single element. used to re-bind events after drag/drop of a list element
function activateHighlightListElement(id){
	$( '#' + id )
  .mouseover(function() {
    highlightElement(this.id)
  })
  .mouseout(function() {
    resetFromHighlight()
  });
}

//binds events to all elements with 'highlight-list' class
function activateHighlightList(){
	$( ".highlight-list" )
  .mouseover(function() {
    highlightElement(this.id)
  })
  .mouseout(function() {
    resetFromHighlight()
  });

}

/*reference - http://code-tricks.com/highlight-a-div-and-fade-others-using-css/ */
function highlightElement(item){

	$( '.highlight-list' ).each(function( index ) {

		var id =  $(this).attr('id')
		if(id === item){
			//select list element
			$('#' + id).css('box-shadow','3px 3px 15px #666')
			$('#' + id).css('border-color','#C76C0C')
			$('#' + id).css('background','#C76C0C')
			$('#' + id).css('color','#fff')
			$('#' + id).css('cursor','cursor')
			$('#' + id).css('filter','alpha(opacity=100)')
			$('#' + id).css('opacity','1')
		}
		else{
			//deselect other list elements
			$('#' + id).css('box-shadow','')
			$('#' + id).css('border-color','')
			$('#' + id).css('background','')
			$('#' + id).css('color','')
			$('#' + id).css('cursor','')
			$('#' + id).css('filter','')
			$('#' + id).css('opacity','')

			$('#' + id).css('filter','alpha(opacity=45)')
			$('#' + id).css('opacity','0.45')
			$('#' + id).css('-webkit-transition','opacity .25s ease-in-out')
			$('#' + id).css('-moz-transition','opacity .25s ease-in-out')
			$('#' + id).css('-ms-transition','opacity .25s ease-in-out')
			$('#' + id).css('-o-transition','opacity .25s ease-in-out')
			$('#' + id).css('transition','opacity .25s ease-in-out')

		}
	});
}


function resetFromHighlight(dragEleID){

	//dragEleID will be undefined when this func is called from an onmouseover event (hover over a list element)
	//dragEleID will be defined when an element is dragged. its used to allow the dragged element to remain coloured while dragging

	$( '.highlight-list' ).each(function( index ) {
		//console.log($('.highlight-list.active').length)
		var id =  $(this).attr('id')
		//check if element is open
		if(id !== $('.highlight-list.active').attr('id')){
			//reset css
			if(id !== dragEleID){
				$('#' + id).css('box-shadow','')
				$('#' + id).css('border-color','')
				$('#' + id).css('background','')
				$('#' + id).css('color','')
				$('#' + id).css('cursor','')
				$('#' + id).css('filter','')
				$('#' + id).css('opacity','')
				$('#' + id).css('filter','')

				$('#' + id).css('-webkit-transition','')
				$('#' + id).css('-moz-transition','')
				$('#' + id).css('-ms-transition','')
				$('#' + id).css('-o-transition','')
				$('#' + id).css('transition','')
			}
		}
	});
}
