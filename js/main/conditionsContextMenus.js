goog.provide('conditionsContextMenu')
goog.require('project')

/**************************************************
 * Edge Overlay context menus
 **************************************************/

 $.contextMenu({
	 selector: ".condition-settings-context-menu",
	trigger: 'left',
	 build: function($trigger) {
		 var options = {
			 callback: function(key, options) {
				 var m = "clicked: " + key;
				 window.console && console.log(m) || alert(m);
			 },
			 items: {}
		 }

		 if( !$trigger.hasClass('outcome') ){
			 options.items['type1'] = {
				 name: 'Compare Two Attributes',
				 callback: function(key, options){
					 setComparisonType('type1',$trigger.attr('id'))
				 }
			 }

			 options.items['type2'] = {
				 name: 'Compare Statement and Attribute',
				 callback: function(key, options){
					 setComparisonType('type2',$trigger.attr('id'))
				 }
			 }

			 options.items['type3'] = {
				 name: 'Compare Two Statements',
				 callback: function(key, options){
					 setComparisonType('type3',$trigger.attr('id'))
				 }
			 }

       options.items['type4'] = {
         name: 'Inventory Condition',
         callback: function(key,options){
           setComparisonType('type4',$trigger.attr('id'))
         }
       }
		 }
     else{

       options.items.attMod = {
         name: 'Attribute Modification',
         callback: function(key,options){
           swapOutcome(key,$trigger.attr('id'))
         }
       }

       options.items.playerOutputAttribute = {
         name: 'Player Output (Text : Attribute : Text)',
         callback: function(key, options){
          swapOutcome(key,$trigger.attr('id'))
         }
       }

       options.items.playerOutputText = {
         name: 'Player Output (Text Only)',
         callback: function(key, options){
          swapOutcome(key,$trigger.attr('id'))
         }
       }

     }

     options.items['sep'] = {
       name: '----------------------------------------------',
       disabled: true
     }


		 var spl = $trigger.attr('id').split('_')
		 var name
		 if(spl[0] === 'newCondition' || spl[0] === 'exCondition'){
			 name = 'Remove Condition'
		 }
		 else if(spl[0] === 'newOutcome' || spl[0] === 'exOutcome'){
			 name = 'Remove Outcome'
		 }

		 options.items['remove'] = {
			 name: name,
			 callback: function(key,options){
				 if(name === 'Remove Condition'){
					 if(spl[0] === 'newCondition'){
						 removeCondition(spl[0] + '_' + spl[1])
					 }
					 else{
						 removeCondition(spl[0] + '_' + spl[1] + '_' + spl[2])
					 }

				 }
				 else if(name === 'Remove Outcome'){
					 if(spl[0] === 'newOutcome'){
						 removeOutcome(spl[0] + '_' + spl[1])
					 }
					 else{
						 removeOutcome(spl[0] + '_' + spl[1] + '_' + spl[2])
					 }
				 }
			 }
		 }
		 return options
	 }
 });

 function addAttributeToContextMenu(att,options,trigger,parent){

	 if(att.is_leaf === false){	//if attribute has no value ( !leaf )
		 //add attribute to list
		 options.items[att.name] = {
			 name: att.name,
			 items: {}
		 }

		 //add attributes children to list
		 for(var i = 0; i<att.childrenArray.length; i++){
			 var next = gameAttributes_find(att.path + "_" + att.childrenArray[i])
			 addAttributeToContextMenu(next,options.items[att.name],trigger,att.name)
		 }
	 }
	 else{ //if attribute has value (leaf)
		 options.items[att.name] = {
			 name: att.name,
			 callback: function(key,option){
				 handleSelection(key,trigger.attr('id'),att)
			 }
		 }
	 }
 }

 function generateConditionContextMenu(trigger){
	 var options = {
		 callback: function(key, options) {

		 },
		 items: {}
	 };

	 //if(trigger.hasClass('condition-context-menu')) {

	 	if (trigger.hasClass('random')){
			//trigger is a random button
			options.items.setRandRange = {
				name: "Set Random Number Range",
				callback: function(key,options){
					setRandomNumberRange(trigger.attr('id'))
				}
			}
			options.items['sep'] = {
				name: '----------------------------------------------',
				disabled: true
			}
		}

		 //add all game attributes
		 if (trigger.hasClass('game-attributes')) {
			 //if there are attributes in proj
			 if(Object.keys(project_project.gameAttributes).length > 0){
				 for(var key in project_project.gameAttributes){
					// add characters option
					var att = gameAttributes_find(key)
					addAttributeToContextMenu(att,options,trigger,'')
				}
			 }
			 else{
				 options.items.err = {
					 name: 'No attributes available',
					 disabled: true
				 }
			 }
		 }


		 if(trigger.hasClass('numbers')){
				// add value option
				options.items.specValue = {
					name: "Specific Value",
					callback: function(key,options){
						handleSelection(key,trigger.attr('id'))
						//numberSelected($trigger.attr("id"))
					}
				}

				// add rand option
				options.items.randValue = {
					name: "Random Value",
					callback: function(key,option){
						handleSelection(key,trigger.attr('id'))
						//randomSelected($trigger.attr("id"))
					}
				}

			}

	 return options;
 }

 $.contextMenu({
   selector: ".condition-context-menu",
	 trigger: 'left',
   build: function($trigger) {
     return generateConditionContextMenu($trigger)
   }
 });

 $.contextMenu({
   selector: ".condition-context-menu-right",
	 trigger: 'right',
   build: function($trigger) {
     return generateConditionContextMenu($trigger)
   }
 });

 $.contextMenu({
   selector: ".comparison-context-menu",
	 trigger: 'left',
   build: function($trigger) {
     var options = {
       callback: function(key, options) {
         var m = "clicked: " + key;
         window.console && console.log(m) || alert(m);
       },
       items: {}
     };

     if ($trigger.hasClass('comparison-context-menu')) {

 			if($trigger.hasClass('comps')){
 				// add characters option
 				options.items.comparison = {
 					name: "comparison",
 					items: {
 						"=" : {
 							name: "=",
 							callback: function(key,options){
								$('#' + $trigger.attr("id") ).text(key)

 							}
 						},
 						"<" : {
 							name: "<",
 							callback: function(key,options){
 								$('#' + $trigger.attr("id")).text(key)
 							}
 						},
 						">" : {
 							name: ">",
 							callback: function(key,options){
 								$('#' + $trigger.attr("id")).text(key)
 							}
 						},
 						"<=" : {
 							name: "<=",
 							callback: function(key,options){
 								$('#' + $trigger.attr("id")).text(key)
 							}
 						},
 						">=" : {
 							name: ">=",
 							callback: function(key,options){
 								$('#' + $trigger.attr("id")).text(key)
 							}
 						}
 					}
 				}
 			}

 			if($trigger.hasClass('mods')){
 				options.items.modifier = {
 					name: "Modifier",
 					items: {
            "=" : {
 							name: "=",
 							callback: function(key,options){
 								$('#' + $trigger.attr("id")).text(key)
 							}
 						},
 						"+" : {
 							name: "+",
 							callback: function(key,options){
 								$('#' + $trigger.attr("id")).text(key)
 							}
 						},
 						"-" : {
 							name: "-",
 							callback: function(key,options){
 								$('#' + $trigger.attr("id")).text(key)
 							}
 						},
 						"*" : {
 							name: "*",
 							callback: function(key,options){
 								$('#' + $trigger.attr("id")).text(key)
 							}
 						},
 						"/" : {
 							name: "/",
 							callback: function(key,options){
 								$('#' + $trigger.attr("id")).text(key)
 							}
 						}
 					}
 				}
 			}
     } else {

     }

     return options;
   }
 });

//handles selections on attribute buttons
 function handleSelection(selected, clickedItemID, att){

	 console.log(selected)
	 if(selected === 'randValue'){
		 randomSelected(clickedItemID)
	 }
	 else if(selected === 'specValue'){
		 numberSelected(clickedItemID)
	 }
	 else{
		 //attribute was selected
		 var spl = clickedItemID.split('_')
		 if(spl[2] !== 'attButton'){
			 attributeSelected(selected,clickedItemID,att)
		 }
		 else{
			 $('#' + clickedItemID).text(selected)
			 $('#' + clickedItemID).attr('path',att.path)
			 updateTooltip(clickedItemID,att.path)
		 }
	 }

 }


//change name of this
 function attributeSelected(selected, clickedItemID, att){
	 var spl = clickedItemID.split('_')
	 var newID
	 if(spl[0] === 'newCondition'){
		 	newID = spl[0] + '_' +spl[1] + '_' + 'attButton' + '_' + spl[3] + '_' + spl[4]
		 	newButton = generateAttributeButton(newID,'game-attributes numbers','NO_COL')
			$('#' + spl[0] + '_' +spl[1] + '_' + spl[2] + '_' + spl[3] + '_' + spl[4]).replaceWith(newButton)
	 }
	 else if(spl[0] === 'exCondition'){
		 	newID = spl[0] + '_' + spl[1] + '_' + spl[2] + '_attButton_' + spl[4] + '_' + spl[5]
		 	newButton = generateAttributeButton( newID,'game-attributes numbers','NO_COL')
			$('#' + spl[0] + '_' + spl[1] + '_' + spl[2] + '_' + spl[3] + '_' + spl[4] + '_' + spl[5]).replaceWith(newButton)
	 }
	 else if(spl[0] === 'newOutcome'){
		 newID = spl[0] + '_' +spl[1] + '_' + 'attButton' + '_' + spl[3]
		 newButton = generateAttributeButton(newID,'game-attributes numbers','NO_COL')
		 $('#' + spl[0] + '_' +spl[1] + '_' + spl[2] + '_' + spl[3]).replaceWith(newButton)
	 }
	 else if(spl[0] === 'exOutcome'){
		 newID = spl[0] + '_' + spl[1] + '_' + spl[2] + '_attButton_' + spl[4]
		 newButton = generateAttributeButton( newID,'game-attributes numbers','NO_COL')
		 $('#' + spl[0] + '_' + spl[1] + '_' + spl[2] + '_' + spl[3] + '_' + spl[4]).replaceWith(newButton)
	 }else if(spl[0] == 'inventoryItem'){
		 newID = clickedItemID;
	 }

	 console.log(newID + ' ' + att.path)
	 $('#' + newID).text(selected)
	 $('#' + newID).attr('path',att.path)
	 updateTooltip(newID,att.path)
 }

 function numberSelected(clickedItemID){

	 var spl = clickedItemID.split('_')
	 var id
	 if(spl[0] === 'newCondition'){
		 id = spl[0] + '_' + spl[1] + '_specValue_'+ spl[3] + '_' + spl[4]
	 }
	 else if(spl[0] === 'exCondition'){
		 id = spl[0] + '_' + spl[1] + '_' + spl[2] +'_specValue_'+ spl[4] + '_' + spl[5]
	 }
	 else if(spl[0] === 'newOutcome'){
		 id = spl[0] + '_' + spl[1] + '_specValue_' + spl[3]
	 }
	 else if(spl[0] === 'exOutcome'){
		 id = spl[0] + '_' + spl[1] + '_' + spl[2] + '_specValue_' + spl[4]
	 }


 	var html = '<div id="'+id +'" class="input-field">'+
 							'<input placeholder="Enter Value" id="'+id+'_inputField' +'" type="number" class="input-field condition-context-menu-right game-attributes numbers">'+
 							'</div>'
 	//$('#comparisonButton').after(html)
 	$('#' + clickedItemID).replaceWith(html)
 }

 function randomSelected(clickedItemID){
	 var spl = clickedItemID.split('_')
	var newID
	if(spl[0] === 'newCondition'){
		 newID = spl[0] + '_' +spl[1] + '_' + 'randValue' + '_' + spl[3] + '_' + spl[4]
		 var html = generateRandomButton(newID)
		 $('#' + spl[0] + '_' +spl[1] + '_' + spl[2] + '_' + spl[3] + '_' + spl[4]).replaceWith(html)
	}
	else if(spl[0] === 'exCondition'){
		 newID = spl[0] + '_' + spl[1] + '_' + spl[2] + '_randValue_' + spl[4] + '_' + spl[5]
		 var html = generateRandomButton(newID)
		 $('#' + spl[0] + '_' + spl[1] + '_' + spl[2] + '_' + spl[3] + '_' + spl[4] + '_' + spl[5]).replaceWith(html)
	}
	else if(spl[0] === 'newOutcome'){
		newID = spl[0] + '_' +spl[1] + '_' + 'randValue' + '_' + spl[3]
		var html = generateRandomButton(newID)
		$('#' + spl[0] + '_' +spl[1] + '_' + spl[2] + '_' + spl[3]).replaceWith(html)
	}
	else if(spl[0] === 'exOutcome'){
		newID = spl[0] + '_' + spl[1] + '_' + spl[2] + '_randValue_' + spl[4]
		var html = generateRandomButton(newID)
		$('#' + spl[0] + '_' + spl[1] + '_' + spl[2] + '_' + spl[3] + '_' + spl[4]).replaceWith(html)
	}

		$('#' + newID).tooltip({delay: 50});
 }

function setRandomNumberRange(clickedItemID){
	myModal.prompt("Set Random Number Range", "Set the minimum and maximum values to be generated", [{name: "Minimum", default: parseFloat($('#' + clickedItemID).attr('min')), type: "number"},{name: "Maximum", default: parseFloat($('#' + clickedItemID).attr('max')), type: "number"}], function(results){
			if(!myModal.confirm) //don't run if cancel clicked
				return;

			if(results[0] <= results[1]){
				$('#' + clickedItemID).attr('min',results[0])
				$('#' + clickedItemID).attr('max',results[1])
				$('#' + clickedItemID).attr('data-tooltip','Minimum: ' + results[0] + '<br>Maximum: ' + results[1])
				$('#' + clickedItemID).tooltip({delay: 50});
			}
			else{
				Materialize.toast('Invalid range. Min must be less than max.', 4000)
			}
		});
}


 function generateCondition_type1(id){

	 var html = '<li id=' + id + '>'+
  							'<div class="row" type="1">'+
  								generateSettingsButton(id) +
									generateAttributeButton(id + '_attButton_s1_1', 'game-attributes') +
									generateComparisonButon(id + '_compMenu_s1', 'comps', '=') +
									generateAttributeButton(id + '_attButton_s1_2', 'game-attributes numbers') +
								'</div>'+
			 					'<div class="divider"></div>'+
			 				'</li>'
		return html
 }

 function generateCondition_type2(id){
	 var html = '<li id=' + id + '>'+
  							'<div class="row" type="2">'+
  								generateSettingsButton(id) +
									generateAttributeButton(id + '_attButton_s1_1', 'game-attributes') +
									generateComparisonButon(id + '_compMenu_s1', 'mods', '+') +
									generateAttributeButton(id + '_attButton_s1_2', 'game-attributes numbers') +
									generateComparisonButon(id + '_pivot', 'comps', '=') +
									generateAttributeButton(id + '_attButton_s2_1', 'game-attributes numbers') +
								'</div>'+
			 					'<div class="divider"></div>'+
			 				'</li>'
		return html
 }

 function generateCondition_type3(id){
	 var html = '<li id=' + id + '>'+
								'<div class="row" type="3">'+
									generateSettingsButton(id) +
									generateAttributeButton(id + '_attButton_s1_1', 'game-attributes') +
									generateComparisonButon(id + '_compMenu_s1', 'mods', '+') +
									generateAttributeButton(id + '_attButton_s1_2', 'game-attributes numbers') +
									generateComparisonButon(id + '_pivot', 'comps', '=') +
									generateAttributeButton(id + '_attButton_s2_1', 'game-attributes numbers') +
									generateComparisonButon(id + '_compMenu_s2', 'mods', '+') +
									generateAttributeButton(id + '_attButton_s2_2', 'game-attributes numbers') +
								'</div>'+
								'<div class="divider"></div>'+
							'</li>'
		return html
 }

 function generateInventoryCondition(id){
   var html = '<li id=' + id + '>'+
  							'<div class="row" type="4">'+
  								generateSettingsButton(id) +
									generateInventoryButton(id + '_invButton') +
                  generateExistsButton(id + '_existsButton')+
								'</div>'+
			 					'<div class="divider"></div>'+
			 				'</li>'
		return html
 }

 function generateOutcome(id){
	 var html = '<li id=' + id + '>'+
								'<div class="row" type="Attribute Modification">'+
									generateSettingsButton(id) +
									generateAttributeButton(id + '_attButton_1', 'game-attributes') +
									generateComparisonButon(id + '_compMenu', 'mods', '+') +
									generateAttributeButton(id + '_attButton_2', 'game-attributes numbers') +
								'</div>'+
								'<div class="divider"></div>'+
							'</li>'
		return html
 }

 function generatePlayerOutputAttribute(id){
   var html = '<li id=' + id + '>'+
								'<div class="row" type="Text-Attribute-Text">'+
									generateSettingsButton(id) +
                  generateTextButton(id + '_text_1')+
									generateAttributeButton(id + '_attButton_1', 'game-attributes') +
                  generateTextButton(id + '_text_2')+
								'</div>'+
								'<div class="divider"></div>'+
							'</li>'
		return html
 }

 function generatePlayerOutputText(id){
   var html = '<li id=' + id + '>'+
								'<div class="row" type="Text">'+
									generateSettingsButton(id) +
                  generateTextButton(id + '_text_1')+
								'</div>'+
								'<div class="divider"></div>'+
							'</li>'
		return html
 }



 function generateAttributeButton(id,classes,mode){
	 var ret
	 if(mode === 'NO_COL'){
		 ret = '<div id="' + id + '" class="condition-context-menu '+classes+' attribute-button tooltipped" data-html="true" data-position="bottom" data-delay="50" data-tooltip=""></div>'
	 }
	 else{
		 ret = '<div class="col s2"><div id="' + id + '" class="condition-context-menu '+classes+' attribute-button tooltipped" data-html="true" data-position="bottom" data-delay="50" data-tooltip=""></div></div>'
	 }
	 return ret
 }

 function generic_generateAttributeButton(id, classes, mode){
	 var ret;
	// if(mode === 'NO_COL'){
		 ret = '<div id="' + id + '" class="condition-context-menu '+classes+' attribute-button tooltipped" data-html="true" data-position="bottom" data-delay="50" data-tooltip=""></div>'
	 //}
	 //else{
		// ret = '<div class="col s2"><div id="inventoryItem_' + id + '" class="condition-context-menu '+classes+' attribute-button tooltipped" data-html="true" data-position="bottom" data-delay="50" data-tooltip=""></div></div>'
	 //}
	 return ret
 }

 function generateComparisonButon(id,classes,initial){
	 var ret = '<div id="' + id +'" class="col s1 comparison-context-menu ' + classes + ' comparison-button">'+initial+'</div>'
	 return ret
 }

 function generateSettingsButton(id){
	 var ret
	 if(id.split('_')[0] === 'newOutcome' || id.split('_')[0] === 'exOutcome'){
		 ret = '<div class="col s1"><div id="' + id + '_settings'+ '" class="condition-settings-context-menu outcome condition-settings-button"><a class="btn-floating waves-effect waves-light gray"><i class="material-icons">settings</i></a></div></div>'
	 }
	 else{
		 var ret = '<div class="col s1"><div id="' + id + '_settings'+ '" class="condition-settings-context-menu condition-settings-button"><a class="btn-floating waves-effect waves-light gray"><i class="material-icons">settings</i></a></div></div>'
	 }
	 return ret
 }

 function generateRandomButton(id){
	 var html = '<div id="' + id + '" class="condition-context-menu random game-attributes numbers attribute-button tooltipped" max="100" min="0" data-html="true" data-position="bottom" data-delay="50" data-tooltip="Minimum: 0<br>Maximum: 100">Random Number</div>'
	 return html
 }

 function generateTextButton(id){
   var html =     '<div class="col s2 truncate">'
                +   '<div id="' + id + '" onclick=editTextModal(this.id) class="attribute-button tooltipped" data-html="true" data-position="bottom" data-delay="50" data-tooltip=""><p class="truncate">Click to add text</p></div>'
                + '</div>'
   return html
 }

function generateInventoryButton(id){
  var html =     '<div class="col s2 truncate">'
               +   '<div id="' + id + '" class="attribute-button tooltipped inventory-context-menu" data-html="true" data-position="bottom" data-delay="50" data-tooltip="" itemid="" ><p class="truncate">.....</p></div>'
               + '</div>'
  return html
}

function setInventoryButtonSelection(id,item){
  $('#'+id).children().text(item.name)
  $('#'+id).attr('data-tooltip',item.name)
  $('#'+id).attr('itemid',item.itemID)
  $('#'+id).tooltip({delay: 50});
}

function generateExistsButton(id){
    var html =     '<div class="col s2 truncate">'
                 +   '<a href="#" ><div id="' + id + '" state="false" onclick=existsButtonSwapState(this.id) class="attribute-button"><p class="truncate">Not in inventory</p></div></a>'
                 + '</div>'
    return html
}

function existsButtonSwapState(id){
  var bool = $('#' + id).attr('state')
  if(bool === 'false'){
    $('#' + id).children().text('Is in inventory')
    $('#' + id).attr('state','true')
  }
  else{
    $('#' + id).children().text('Not in inventory')
    $('#' + id).attr('state','false')
  }
}

 function setComparisonType(type,id){
	 var spl = id.split('_')
	 var newCondition = ''
	 var id
	 if(spl[0] === 'newCondition'){
		 id = spl[0] + '_' + spl[1]
	 }
	 else if(spl[0] === 'exCondition'){
		 id = spl[0] + '_' + spl[1] + '_' + spl[2]
	 }

	 switch(type){
		case 'type1':
			newCondition = generateCondition_type1(id)
			$('#' + id).replaceWith(newCondition)
			initAttributeButton(id + '_attButton_s1_1')
			initAttributeButton(id + '_attButton_s1_2')
		 	break;
		case 'type2':
			newCondition = generateCondition_type2(id)
			$('#' + id).replaceWith(newCondition)
			initAttributeButton(id + '_attButton_s1_1')
			initAttributeButton(id + '_attButton_s1_2')
			initAttributeButton(id + '_attButton_s2_1')

			break;
		case 'type3':
			newCondition = generateCondition_type3(id)
			$('#' + id).replaceWith(newCondition)
			initAttributeButton(id + '_attButton_s1_1')
			initAttributeButton(id + '_attButton_s1_2')
			initAttributeButton(id + '_attButton_s2_1')
			initAttributeButton(id + '_attButton_s2_2')
			break;

    case 'type4':
      newCondition = generateInventoryCondition(id)
      $('#' + id).replaceWith(newCondition)
	 }


 }

function findFirstLeafPath(path){
	var att = gameAttributes_find(path)
	if(att.is_leaf === false){
		for(var i = 0; i<att.childrenArray.length; i++){
			var temp = findFirstLeafPath(path + '_' + att.childrenArray[i])
			if(temp !== undefined){
				return temp
			}
		}
	}
	else{
		return path
	}
}

 function initAttributeButton(id){
	 if(Object.keys(project_project.gameAttributes).length > 0){
		 for(var key in project_project.gameAttributes){
			 var path = findFirstLeafPath(key)
			 if(path !== undefined){
				 var att = gameAttributes_find(path)
				 $('#'+id).text(att.name)
				 $('#'+id).attr('path',path)
				 updateTooltip(id,path)

				 return
			 }
		 }
	 }
	 else{
		 $('#'+id).text('...........')
		 $('#'+id).attr('path','')
		 $('#' + id).attr('data-tooltip',"There are no attributes in your project. <br> Add attributes via the 'Attributes' button. ")
		 $('#'+id).tooltip({delay: 50});
	 }

 }

 function updateTooltip(id,path){
	 //add path nams to tool tip
	 var spl = path.split('_')
	 var ttText = ''
	 var currPath = ''
	 for(var i = 0; i<spl.length; i++){
		 if(i === 0 ){
			 currPath += spl[0]
		 }
		 else{
			 currPath += '_' + spl[i]
		 }
		 var temp = gameAttributes_find(currPath)
		 ttText = ttText + temp.name
		 if(i !== spl.length-1){
			 ttText += ' > '
		 }
	 }
	 $('#' + id).attr('data-tooltip',ttText)

	 //init tooltipp
	 $('#'+id).tooltip({delay: 50});
 }

 function swapOutcome(type,id){
   var html
   var replaceId
   var spl = id.split('_')
   if(spl[0] === 'newOutcome'){
     replaceId = spl[0] + '_' + spl[1]
   }
   else if(spl[0] === 'exOutcome'){
     replaceId = spl[0] + '_' + spl[1] + '_' + spl[2]
   }

   if(type === 'attMod'){
     //swapping to attribute modification
     html = generateOutcome(replaceId)
     $('#' + replaceId).replaceWith(html)
     initAttributeButton(replaceId + '_attButton_1')
     initAttributeButton(replaceId + '_attButton_2')
   }
   else if(type === 'playerOutputAttribute'){
     //swapping to player output
     html = generatePlayerOutputAttribute(replaceId)
     $('#' + replaceId).replaceWith(html)
     initAttributeButton(replaceId + '_attButton_1')
     $('#'+ replaceId + '_text_1').tooltip({delay: 50});
   	 $('#'+ replaceId + '_text_2').tooltip({delay: 50});
   }
   else if(type === 'playerOutputText'){
     //swapping to player output
     html = generatePlayerOutputText(replaceId)
     $('#' + replaceId).replaceWith(html)
     $('#'+ replaceId + '_text_1').tooltip({delay: 50});
   }



 }

 function editTextModal(id){
   //console.log(id)
   var data = $('#' + id).attr('data-tooltip')

   myModal.prompt("Modify Text For Player Output", "Specify the text that appears in the control output of the following page during gameplay.", [{name: "Text", default: data, type: "text"}],
 			function(results){
        $('#' + id).children().text('"' + results[0] + '"')
 				$('#' + id).attr('data-tooltip',results[0])
        $('#' + id).tooltip({delay: 50});
 			},
 			function(results){
 				return true
 			}
 	);

 }

 $.contextMenu({
  selector: ".inventory-context-menu",
 trigger: 'left',
  build: function($trigger) {
    var options = {
      items: {}
    }

    options.items.inventory = {
      name: 'Inventory Item',
      items: {}
    }

    if(Object.keys(project_project.gameInventory).length > 0){
      for(var key in project_project.gameInventory){
       // add characters option
       var item = gameInventory_getItem(key)
       options.items.inventory.items[key] = {
         name: item.name,
         callback: function(key,options){
           setInventoryButtonSelection($trigger.attr('id'),item)
         }
       }
     }
    }
    else{
      options.items.err = {
        name: 'No inventory items available',
        disabled: true
      }
    }


    return options
  }
 });
