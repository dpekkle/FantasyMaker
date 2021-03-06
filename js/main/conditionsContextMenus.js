/*
	Name: conditionsContextMenu.js
	Created By: Darryl
	Purpose: To handle the dynamic behaviour of conditons and outcomes in relation to the UI they are represented on. 
*/

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

       //top level context menu catagories
       options.items.attConds = {
         name: 'Attribute Conditions',
         items: {}
       }

       options.items.invConds = {
         name: 'Inventory Conditions',
         items: {}
       }

       options.items.randConds = {
         name : 'Random Number Conditions',
         items: {}
       }

       //attribute conditions
			 options.items.attConds.items['type1'] = {
				 name: 'Compare Two Attributes',
				 callback: function(key, options){
					 setComparisonType('type1',$trigger.attr('id'))
				 }
			 }

			 options.items.attConds.items['type2'] = {
				 name: 'Compare Statement and Attribute',
				 callback: function(key, options){
					 setComparisonType('type2',$trigger.attr('id'))
				 }
			 }

			 options.items.attConds.items['type3'] = {
				 name: 'Compare Two Statements',
				 callback: function(key, options){
					 setComparisonType('type3',$trigger.attr('id'))
				 }
			 }

       //inventory conditions
       options.items.invConds.items['type4'] = {
         name: 'Item In Inventory',
         callback: function(key,options){
           setComparisonType('type4',$trigger.attr('id'))
         }
       }

       options.items.invConds.items['type5'] = {
         name: 'Amount Of Item In Inventory',
         callback: function(key,options){
           setComparisonType('type5',$trigger.attr('id'))
         }
       }

       //random number conditions
       options.items.randConds.items['type6'] = {
         name: 'Random Number Comparison',
         callback: function(key,options){
           setComparisonType('type6',$trigger.attr('id'))
         }
       }
		 }
     else{
       //top level catagories
       options.items.attMods = {
         name: 'Attribute Modifications',
         items: {}
       }

       options.items.textOutput = {
         name: 'Text Output To Page',
         items: {}
       }

       options.items.invOuts = {
         name: 'Inventory Modifications',
         items: {}
       }

       //attribute outcomes
       options.items.attMods.items['attMod'] = {
         name: 'Attribute Modification',
         callback: function(key,options){
           swapOutcome(key,$trigger.attr('id'))
         }
       }

       //text outcomes
       options.items.textOutput.items['playerOutputAttribute'] = {
         name: 'Outcome Output (Text : Attribute : Text)',
         callback: function(key, options){
          swapOutcome(key,$trigger.attr('id'))
         }
       }

       options.items.textOutput.items['playerOutputInvItem'] = {
         name: 'Outcome Output (Text : Inventory Amount: Text)',
         callback: function(key,options){
           swapOutcome(key,$trigger.attr('id'))
         }
       }


       options.items.textOutput.items['playerOutputText'] = {
         name: 'Outcome Output (Text Only)',
         callback: function(key, options){
          swapOutcome(key,$trigger.attr('id'))
         }
       }

       //inventory outcomes
       options.items.invOuts.items['inventory_addRemove'] = {
         name: 'Add or remove inventory items',
         callback: function(key,options){
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

		}

    if(trigger.hasClass('random') && trigger.hasClass('game-attributes') || trigger.hasClass('random') && trigger.hasClass('numbers')){
      options.items['sep'] = {
				name: '----------------------------------------------',
				disabled: true
			}
    }

		 //add all game attributes
		 if (trigger.hasClass('game-attributes')) {
       options.items.gameAtts = {
         name: 'Game Attributes',
         items: {}
       }
			 //if there are attributes in proj
			 if(Object.keys(project_project.gameAttributes).length > 0){
				 for(var key in project_project.gameAttributes){
					// add characters option
					var att = gameAttributes_find(key)
					addAttributeToContextMenu(att,options.items.gameAtts,trigger,'')
				}
			 }
			 else{
				 options.items.gameAtts.items.err = {
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
        if($trigger.hasClass('equals')){
          options.items.modifier.items['='] = {
            name: "=",
            callback: function(key,options){
              $('#' + $trigger.attr("id")).text(key)
            }
          }
        }
 			}
     } else {

     }

     return options;
   }
 });


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
      newCondition = generateCondition_type4(id)
      $('#' + id).replaceWith(newCondition)
      break;

    case 'type5':
      newCondition = generateCondition_type5(id)
      $('#' + id).replaceWith(newCondition)
      break;

    case 'type6':
      newCondition = generateCondition_type6(id)
      $('#' + id).replaceWith(newCondition)
      $('#' + id + '_randButton').tooltip({delay: 50});
      break;
	 }


 }


//handles selections on attribute buttons
 function handleSelection(selected, clickedItemID, att){

	 console.log(selected);
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
			 $('#' + clickedItemID).children().text(selected)
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
		 	newButton = generateAttributeButton(newID,'game-attributes numbers')
      $('#' + clickedItemID).parent().replaceWith(newButton)
			//$('#' + spl[0] + '_' +spl[1] + '_' + spl[2] + '_' + spl[3] + '_' + spl[4]).parent().replaceWith(newButton)
	 }
	 else if(spl[0] === 'exCondition'){
		 	newID = spl[0] + '_' + spl[1] + '_' + spl[2] + '_attButton_' + spl[4] + '_' + spl[5]
		 	newButton = generateAttributeButton( newID,'game-attributes numbers')
      $('#' + clickedItemID).parent().replaceWith(newButton)
			//$('#' + spl[0] + '_' + spl[1] + '_' + spl[2] + '_' + spl[3] + '_' + spl[4] + '_' + spl[5]).parent().replaceWith(newButton)
	 }
	 else if(spl[0] === 'newOutcome'){
		 newID = spl[0] + '_' +spl[1] + '_' + 'attButton' + '_' + spl[3]
		 newButton = generateAttributeButton(newID,'game-attributes numbers')
     $('#' + clickedItemID).parent().replaceWith(newButton)
		 //$('#' + spl[0] + '_' +spl[1] + '_' + spl[2] + '_' + spl[3]).parent().replaceWith(newButton)
	 }
	 else if(spl[0] === 'exOutcome'){
		 newID = spl[0] + '_' + spl[1] + '_' + spl[2] + '_attButton_' + spl[4]
		 newButton = generateAttributeButton( newID,'game-attributes numbers')
     $('#' + clickedItemID).parent().replaceWith(newButton)
		 //$('#' + spl[0] + '_' + spl[1] + '_' + spl[2] + '_' + spl[3] + '_' + spl[4]).parent().replaceWith(newButton)
	 }else if(spl[0] == 'inventoryItem'){
		 newID = clickedItemID;
	 }

	 //sconsole.log(newID + ' ' + att.path)
	 $('#' + newID).children().text(selected)
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


 	var html = generateInputField(id,'condition-context-menu-right game-attributes numbers')
 	//$('#comparisonButton').after(html)
 	$('#' + clickedItemID).parent().replaceWith(html)
 }

 function randomSelected(clickedItemID){
	 var spl = clickedItemID.split('_')
	var newID
	if(spl[0] === 'newCondition'){
		 newID = spl[0] + '_' +spl[1] + '_' + 'randValue' + '_' + spl[3] + '_' + spl[4]
		 var newButton = generateRandomButton(newID,'condition-context-menu game-attributes numbers')
     $('#' + clickedItemID).parent().replaceWith(newButton)
		 //$('#' + spl[0] + '_' +spl[1] + '_' + spl[2] + '_' + spl[3] + '_' + spl[4]).parent().replaceWith(html)
	}
	else if(spl[0] === 'exCondition'){
		 newID = spl[0] + '_' + spl[1] + '_' + spl[2] + '_randValue_' + spl[4] + '_' + spl[5]
		 var newButton = generateRandomButton(newID,'condition-context-menu game-attributes numbers')
     $('#' + clickedItemID).parent().replaceWith(newButton)
		 //$('#' + spl[0] + '_' + spl[1] + '_' + spl[2] + '_' + spl[3] + '_' + spl[4] + '_' + spl[5]).parent().replaceWith(html)
	}
	else if(spl[0] === 'newOutcome'){
		newID = spl[0] + '_' +spl[1] + '_' + 'randValue' + '_' + spl[3]
		var newButton = generateRandomButton(newID,'condition-context-menu game-attributes numbers')
    $('#' + clickedItemID).parent().replaceWith(newButton)
		//$('#' + spl[0] + '_' +spl[1] + '_' + spl[2] + '_' + spl[3]).parent().replaceWith(html)
	}
	else if(spl[0] === 'exOutcome'){
		newID = spl[0] + '_' + spl[1] + '_' + spl[2] + '_randValue_' + spl[4]
		var newButton = generateRandomButton(newID,'condition-context-menu game-attributes numbers')
    $('#' + clickedItemID).parent().replaceWith(newButton)
		//$('#' + spl[0] + '_' + spl[1] + '_' + spl[2] + '_' + spl[3] + '_' + spl[4]).parent().replaceWith(html)
	}

		$('#' + newID).tooltip({delay: 50});
 }

function setRandomNumberRange(clickedItemID){

    myModal.prompt("Set Random Number Range", "Set the minimum and maximum values to be generated.", [{name: "Minimum", default: parseFloat($('#' + clickedItemID).attr('min')), type: "number"},{name: "Maximum", default: parseFloat($('#' + clickedItemID).attr('max')), type: "number"}],
  			function(results){
          $('#' + clickedItemID).attr('min',results[0])
  				$('#' + clickedItemID).attr('max',results[1])
  				$('#' + clickedItemID).attr('data-tooltip','Minimum: ' + results[0] + '<br>Maximum: ' + results[1])
  				$('#' + clickedItemID).tooltip({delay: 50});
          return true
  			},
  			function(results){
  				if(parseFloat(results[0]) > parseFloat(results[1])){
  					myModal.warning('Minimum field cannot be greater than Maximum field')
  					return false
  				}
  				return true
  			}
  	);
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

//inventory exists
 function generateCondition_type4(id){
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

//inventory amount
function generateCondition_type5(id){
  var html = '<li id=' + id + '>'+
               '<div class="row" type="5">'+
                 generateSettingsButton(id) +
                 generateInventoryButton(id + '_invButton') +
                 generateInputField(id + '_inputField','','Amount In Inventory')+
               '</div>'+
               '<div class="divider"></div>'+
             '</li>'
   return html
}

//random number condition
function generateCondition_type6(id){
  var html = '<li id=' + id + '>'+
               '<div class="row" type="1">'+
                 generateSettingsButton(id) +
                 generateRandomButton(id + '_randButton','condition-context-menu') +
                 generateComparisonButon(id + '_compMenu_s1', 'comps', '=') +
                 generateInputField(id + '_inputField','','Enter Number')+
               '</div>'+
               '<div class="divider"></div>'+
             '</li>'
   return html
}


//standard attribute modification
 function generateOutcome(id){
	 var html = '<li id=' + id + '>'+
								'<div class="row" type="Attribute Modification">'+
									generateSettingsButton(id) +
									generateAttributeButton(id + '_attButton_1', 'game-attributes') +
									generateComparisonButon(id + '_compMenu', 'mods equals', '+') +
									generateAttributeButton(id + '_attButton_2', 'game-attributes numbers') +
								'</div>'+
								'<div class="divider"></div>'+
							'</li>'
		return html
 }

//text outcome with attribute (text : attribute : text)
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

 //text outcome with attribute (text : invItem : text)
  function generatePlayerOutputInvItem(id){
    var html = '<li id=' + id + '>'+
 								'<div class="row" type="Text-InvItem-Text">'+
 									generateSettingsButton(id) +
                  generateTextButton(id + '_text_1')+
 									generateInventoryButton(id + '_invButton')+
                  generateTextButton(id + '_text_2')+
 								'</div>'+
 								'<div class="divider"></div>'+
 							'</li>'
 		return html
  }

//just text outcome
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

 function generateOutcome_inventoryAddRemove(id){
   var html = '<li id=' + id + '>'+
                '<div class="row" type="inventory_addRemove">'+
                  generateSettingsButton(id) +
                  generateAddRemoveButton(id + '_addRemove')+
                  generateInputField(id,'','Amount to add')+
                  generateInventoryButton(id + '_invButton')+
                '</div>'+
                '<div class="divider"></div>'+
              '</li>'
    return html
 }



 function generateAttributeButton(id,classes,mode){
	 var ret = '<div class="col s2">'
            +   '<div id="' + id + '" class="condition-context-menu '+classes+' attribute-button tooltipped" data-html="true" data-position="bottom" data-delay="50" data-tooltip=""><p class="truncate"></p></div>'
            +'</div>'
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

 function generateRandomButton(id,classes){
	 var html = '<div class="col s2"><div id="' + id + '" class="random attribute-button tooltipped '+ classes +'" max="100" min="0" data-html="true" data-position="bottom" data-delay="50" data-tooltip="Minimum: 0<br>Maximum: 100">Random Number</div></div>'

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

function generateInputField(id,classes,placeHolderText){

  if(placeHolderText === undefined){
    placeHolderText = 'Enter Value'
  }
  var html = '<div class="input-field col s2">'+
 							  '<input placeholder="'+ placeHolderText +'" id="'+id+'_inputField' +'" type="number" class="input-field autosetvalue '+ classes +' ">'+
                '<label for="'+id+'_inputField">'+placeHolderText+'</label>' +
 							'</div>'

  return html
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

function generateAddRemoveButton(id){
    var html =     '<div class="col s2 truncate">'
                 +   '<a href="#" ><div id="' + id + '" state="add" onclick=addRemoveButtonSwapState(this.id) class="attribute-button"><p class="truncate">Add</p></div></a>'
                 + '</div>'
    return html
}

function addRemoveButtonSwapState(id){
  var state = $('#' + id).attr('state')
  var spl = id.split('_')
  var inputFieldID
  if(spl[0] === 'newOutcome'){
    inputFieldID = spl[0] + '_' + spl[1] + '_inputField'
  }
  else if(spl[0] === 'exOutcome'){
    inputFieldID = spl[0] + '_' + spl[1] + '_' + spl[2] + '_inputField'
  }

  if(state === 'remove'){
    $('#' + id).children().text('Add')
    $('#' + id).attr('state','add')
    $('#' + inputFieldID ).attr('placeholder','Amount to add')
    $('#' + inputFieldID ).siblings().text('Amount to add')
  }
  else{
    $('#' + id).children().text('Remove')
    $('#' + id).attr('state','remove')
    $('#' + inputFieldID).attr('placeholder','Amount to remove')
    $('#' + inputFieldID).siblings().text('Amount to remove')
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
   $('#'+id).children().text('...........')
   $('#'+id).attr('path','')
   $('#' + id).attr('data-tooltip',"There are no attributes in your project. <br> Add attributes via the 'Attributes' button. ")
   $('#'+id).tooltip({delay: 50});

/*
	 if(Object.keys(project_project.gameAttributes).length > 0){
		 for(var key in project_project.gameAttributes){
			 var path = findFirstLeafPath(key)

			 if(path !== undefined){
				 var att = gameAttributes_find(path)
				 $('#'+id).children().text(att.name)
				 $('#'+id).attr('path',path)
				 updateTooltip(id,path)

				 return
			 }
		 }
	 }
*/

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
   else if(type === 'inventory_addRemove'){

     html = generateOutcome_inventoryAddRemove(replaceId)
     $('#' + replaceId).replaceWith(html)
     $('#'+ replaceId + '_invButton').tooltip({delay: 50});
   }
   else if(type === 'playerOutputInvItem'){
     html = generatePlayerOutputInvItem(replaceId)
     $('#' + replaceId).replaceWith(html)
     initAttributeButton(replaceId + '_attButton_1')
     $('#'+ replaceId + '_text_1').tooltip({delay: 50});
      $('#'+ replaceId + '_text_2').tooltip({delay: 50});
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

function setInputFieldValues(){
  $('.autosetvalue').each(function(i,obj){
    console.log($(obj).val())
    $(obj).attr('value',$(obj).val())
  })
}

function setInventoryButtonSelection(id,itemID){
  var item = gameInventory_getItem(itemID)
  $('#'+id).children().text(item.name)
  $('#'+id).attr('data-tooltip',item.name)
  $('#'+id).attr('itemid',item.itemID)
  $('#'+id).tooltip({delay: 50});
}


 $.contextMenu({
  selector: ".inventory-context-menu",
 trigger: 'left',
  build: function($trigger) {
    var options = {
      items: {}
    }



    if(Object.keys(project_project.gameInventory).length > 0){
      options.items.inventory = {
        name: 'Inventory Item',
        items: {}
      }

      for(var key in project_project.gameInventory){
       // add characters option
       var item = gameInventory_getItem(key)
       console.log(item)
       options.items.inventory.items[key] = {
         name: item.name,
         callback: function(key,options){
           setInventoryButtonSelection($trigger.attr('id'),item.itemID)
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

$.contextMenu({
	selector: ".swap-controlmenu",
 trigger: 'left',
	build: function($trigger) {
		var options = {
			items: {}
		}

		options.items.maker = {
			name: 'Game Maker Output',
			callback: function(key,options){
				if( !$('.output-container').hasClass('maker') ){
					$('.output-container').removeClass('player')
					$('.output-container').addClass('maker')
					//$('.output-container').children().remove()
					//$('.output-container').children().append(logger.makerOutput())
				}
			}
		}

		options.items.player = {
			name: 'Game Player Output',
			callback: function(key,options){
				if( !$('.output-container').hasClass('player') ){
					$('.output-container').removeClass('maker')
					$('.output-container').addClass('player')
					//$('.output-container').children().remove()
					//$('.output-container').children().append(logger.playerOutput())
				}
			}
		}

		return options
	}
});
