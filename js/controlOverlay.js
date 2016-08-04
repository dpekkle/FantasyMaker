goog.provide('controlOverlay')
goog.require('edgeOverlay')

function populateControlOverlay(node){
	
	var edgeArray = node.connectedEdges().jsons()
	
	for(var i = 0; i<edgeArray.length; i++){
		var curr = edgeArray[i]
		var edgeHtml = '<li id=connectedEdge_' + curr.data.id + '><div class="collapsible-header">Edge '+ curr.data.name +'</div><div class="collapsible-body"><ul id = "'+ curr.data.id + '_collapsible' +'" class="collapsible" data-collapsible="expandable"><li><div class="collapsible-header">Conditions for '+ curr.data.name +'</div><div class="collapsible-body"><ul id = "controlConditions_' + curr.data.id + '" class="list-unstyled" ></ul></div></li><li><div class="collapsible-header">Outcomes for '+ curr.data.name +'</div><div class="collapsible-body"><ul id = "controlOutcomes_' + curr.data.id + '" class="list-unstyled" ></ul></div></li></ul></div></li>'
		
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
		//console.log( ele.id() );
		saveEdge(ele,"CONTROL_OVERLAY")
	});
}