goog.provide('genericComparisonRow')
goog.require('conditionsContextMenu')

function generic_example(){
  generic_addRow('row_1_','your-settings-menu','exampleList')
}

//param 1(string) - unique id of the row
//param 2(string) - selector name of the settings menu you want to use
//param 3(string) - id of ul list you want to append this row to
function generic_addRow(rowID,yourSettingsMenu,ul_ID){
  $('#' + ul_ID).append(generic_generateRow(rowID,yourSettingsMenu))
  initAttributeButton(rowID + 'attButton1')
  initAttributeButton(rowID + 'attbutton2')
}

//example settings menu
//context generate on left click
$.contextMenu({
 selector: ".your-settings-menu",
 trigger: 'left',
 build: function($trigger) {
   var options = {
     items : {}
   }

   options.items.dosomething = {
     name: 'do something',
     callback: function(key,options){
       alert('Done something')
     }
   }

   return options
 }
});


function generic_generateRow(id,yourSettingsMenu){
  var html = '<li id=' + id + '>'+
               '<div class="row" type="1">'+
                 generic_yourSettingsButton(id,yourSettingsMenu) + //define your own for this, my one is pretty linked into conditions/outcomes
                 generic_generateAttributeButton(id + 'attButton1', 'game-attributes') + //context menu just has game attributes
                 generateComparisonButon(id + '_compMenu', 'comps', '=') +
                 generic_generateAttributeButton(id +'attbutton2', 'game-attributes numbers') + //context menu game attributes and specific/random number
               '</div>'+
               '<div class="divider"></div>'+
             '</li>'
   return html
}

function generic_yourSettingsButton(id,yourSettingsMenu){
  return '<div class="col s1"><div id="' + id + '_settings'+ '" class="'+ yourSettingsMenu +' condition-settings-button"><a class="btn-floating waves-effect waves-light gray"><i class="material-icons">settings</i></a></div></div>'
}


//context generate on left click
$.contextMenu({
 selector: ".generic-attributes-menu",
 trigger: 'left',
 build: function($trigger) {
   return generic_generateContextMenu($trigger)
 }
});

//context generate on right (for input field swapping)
$.contextMenu({
 selector: ".generic-attributes-menu-right",
 trigger: 'right',
 build: function($trigger) {
   return generic_generateContextMenu($trigger)
 }
});

function generic_generateContextMenu(trigger){
  var options = {
    items: {}
  }

  //adds all game-attributes
  if(Object.keys(project_project.gameAttributes).length > 0){
    for(var key in project_project.gameAttributes){
     var att = gameAttributes_find(key)
     generic_addFolderToContextMenu(att,options,trigger)
    }
  }
  else{
    options.items.err = {
      name: 'No attributes available',
      disabled: true
    }
  }

  if(trigger.hasClass('numbers')){
     // add value option
     //add specific value field
     options.items.specValue = {
       name: "Specific Value",
       callback: function(key,options){
         //handleSelection(key,trigger.attr('id'))
         //numberSelected($trigger.attr("id"))
         generic_numberSelected(trigger.attr('id'))
       }
     }

     // add rand option
     /*
     options.items.randValue = {
       name: "Random Value",
       callback: function(key,option){
         //handleSelection(key,trigger.attr('id'))
         //randomSelected($trigger.attr("id"))
       }
     }
     */
   }

  return options
}

//recursive function to poplulate context menu
function generic_addFolderToContextMenu(att,options,trigger){
  if(att.is_leaf === false){    //if attribute has no value ( folder )
    //add attribute to list
    options.items[att.name] = {
      name: att.name,
      items: {}
    }
    //add attributes children to list
    for(var i = 0; i<att.childrenArray.length; i++){
      var next = gameAttributes_find(att.path + "_" + att.childrenArray[i])
      generic_addFolderToContextMenu(next,options.items[att.name],trigger,att.name)
    }
  }
  else{ //if attribute has value (leaf)
    options.items[att.name] = {
      name: att.name,
      callback: function(key,option){
        generic_attributeSelected(trigger.attr('id'),att)
      }
    }
  }
}

function generic_generateAttributeButton(id,classes,mode){
  var ret
  if(mode === 'NO_COL'){
    ret = '<div id="' + id + '" class="generic-attributes-menu '+classes+' attribute-button tooltipped" data-html="true" data-position="bottom" data-delay="50" data-tooltip=""><p class="truncate"></p></div>'
  }
  else{
    ret = '<div class="col s5"><div id="' + id + '" class="generic-attributes-menu '+classes+' attribute-button tooltipped" data-html="true" data-position="bottom" data-delay="50" data-tooltip=""><p class="truncate"></p></div></div>'
  }
  return ret
}


function generic_numberSelected(clickedItemID){

	 //var spl = clickedItemID.split('_')
	var id = clickedItemID + '_specValue'
 	var html = '<div id="'+id +'" class="input-field">'+
 							'<input placeholder="Enter Value" id="'+id+'_inputField' +'" type="number" class="input-field generic-attributes-menu-right numbers">'+
 							'</div>'
 	//$('#comparisonButton').after(html)
 	$('#' + clickedItemID).replaceWith(html)
 }


function generic_attributeSelected(clickedItemID, att){

  var repl = ''
  var newID = ''
  if($('#' + clickedItemID).hasClass('input-field')){
    repl = $("#" + clickedItemID).closest("div").prop("id");
    newID = repl

  }
  else{
    repl = clickedItemID
    newID = clickedItemID
  }

  var newButton = generic_generateAttributeButton(newID,'game-attributes numbers','NO_COL')
	$('#' + repl).replaceWith(newButton)

	$('#' + newID).children().text(att.name)
  $('#' + newID).attr('path',att.path)
	updateTooltip(newID,att.path)
}


/*
function generic_generateRandomButton(id){
  var html = '<div id="' + id + '" class="generic-attributes-menu random game-attributes numbers attribute-button tooltipped" max="100" min="0" data-html="true" data-position="bottom" data-delay="50" data-tooltip="Minimum: 0<br>Maximum: 100">Random Number</div>'
  return html
}
*/

/*
 function generic_randomSelected(clickedItemID){
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
 */
