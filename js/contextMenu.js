goog.provide('contextMenu')
goog.require('generalOverlay')
goog.require('audio')
goog.require('project')
goog.require('prompts')

//Right click context menus

function changeCSSinMenu(target, options, attribute, value)
{
	console.log("Inside change CSS")

	if (target == '#pagecontainers')
		$(target).css(attribute, value);
	else{
		options.$trigger.parent().siblings(target).css(attribute, value);
	}
}

function bringEleToFront(element)
{
	var max = 0;
	$('#pagecontainers').children('div').each(function()
	{
		var z = $(this).css('zIndex');
		if (z > max)
			max = z;
	});
	max++;
	console.log("Set zIndex to ", max);
	element.css("zIndex", max);
};


var primary_colour = "rgba(255,255,255,1.0)";
var secondary_colour = "rgba(255,255,255,1.0)";

$("#ColourPicker1").spectrum({
	color: primary_colour,
	change: function(color) {
		primary_colour = color.toRgbString(); // #rgb(255,0,0)
		$('#ColourPicker1').css("background-color", primary_colour);
	}
});

$("#ColourPicker2").spectrum({
	color: secondary_colour,
	change: function(color) {
		secondary_colour = color.toRgbString(); // #rgb(255,0,0)
		$('#ColourPicker2').css("background-color", secondary_colour);
	}
});

// *********** THESE WILL NEED TO BE ATTRIBUTES FOR THE PROJECT ************************

function templateMenuObj()
{
	this.template_ID = 0;
	this.text_template_menu_list = {} //shared with control output containers
	this.decision_template_menu_list = {}
	this.image_template_menu_list = {}
	this.video_template_menu_list = {}
	this.page_template_menu_list = {}
}

// *******************************************************************************

//custom type of menu item for selecting a colour
$.contextMenu.types.color = function(item, opt, root) {
	// this === item.$node
	$('<span>' + item.customName + '<ul>'
		+ '<li class = "black"></li>'
		+ '<li class = "gray"></li>'
		+ '<li class = "white"></li>'
		+ '<li class = "primary" style="background-color: ' + primary_colour + ';"></li>'
		+ '<li class = "secondary" style="background-color: ' + secondary_colour + ';"></li>'
		)
		.appendTo(this)
		.on('click', 'li', function() {
			//change CSS instantly, target/attribute is passed through className of menu item
			var class_names = item.className.split(" ");
			var css_attribute = class_names[0];
			var target = class_names[1];
			changeCSSinMenu(target, root, item.className.split(" ")[0], $(this).css('background-color'))

			// hide the menu
			root.$menu.trigger('contextmenu:hide');
		});

	this.addClass('color').on('contextmenu:focus', function(e) {
	// setup some awesome stuff
	}).on('contextmenu:blur', function(e) {
	 // tear down whatever you did
	}).on('keydown', function(e) {
	 // some funky key handling, maybe?
	});
};

function generateContextMenu(container_type, template_menu_list)
{
	//choose target element
	if (container_type == "text" || container_type == "output")
		var target_element = '.editdiv';
	else if (container_type == "decision")
		var target_element = '.editdec';
	else if (container_type == "img" || container_type == "vid")
		var target_element = '.editdiv';
	else if (container_type == "page")
		var target_element = '#pagecontainers';

	//generate menu items
	if (container_type == "text" || container_type == "decision" || container_type == "output")
	{
		return {
			"items":
			{
				"font":
				{
					"name": "Font",
					"items":
					{
						"Alignment":
						{
							"name": "Alignment",
							"type": 'select',
							"options": {left: 'left', right: 'right', Center: 'Center', Justify: "Justify"},
						},
						"fontfamily":
						{
							"name": "Style",
							"type": 'select',
							"options": {
								"\"Courier New\", Courier, monospace"   : "Courier New",
								"\"Lucida Console\", Monaco, monospace" : "Lucinda",
								"\"Times New Roman\", Times, serif"     : "Times New Roman",
								"\"Arial\", Helvetica, sans-serif"      : "Arial",
								"Tahoma, Geneva, sans-serif"            : "Tahoma",
								"\"Comic Sans MS\", cursive, sans-serif": "Comic Sans"
							},
						},
						"font-size":
						{
							"name": "Size",
							"callback": function(key, options)
							{
								var ele = options.$trigger.parent().siblings(target_element);
								myModal.prompt("Set font size", "Between 1 and 40", [{name: "Font-size", default: ele.css('font-size'), min: "1", max: "40", type: "number"}], function(results)
								{
									if(!myModal.confirm)
										return;
									var value = results[0];

									if (value <= 40 && value >= 1)
									{
										ele.css('font-size', value);
									}
									else
										return false;
								});
							}
						},
						"font-color":
						{
							type: "color", customName: "Font Colour", className: "color " + target_element,
						},
					}
				},
				"background":
				{
					"name": "Background",
					"items":
					{

						"Colour":
						{
							type: "color", customName: "Background Colour", className: "background-color " + target_element,
						},
						"Opacity":
						{
							"name": "Opacity",
							"callback": function(key, options)
							{
								var ele = options.$trigger.parent().siblings(target_element);
								var colour_string = ele.css('background-color');
								var alpha;
								if (colour_string.match(/rgba/))
									alpha=colour_string.replace(/^.*,(.+)\)/,'$1')
								else
									alpha = 1;
								myModal.prompt("Set Opacity", "Between 0 and 100", [{name: "Opacity", default: alpha*100, min: "0", max: "100", type: "number"}], function(results)
								{
									if(!myModal.confirm)
										return;
									var opacity = parseFloat(results[0]);
									if (opacity <= 100 && opacity >= 0)
									{
										opacity /= 100;

										var colour = ele.css('background-color');
										if(colour.indexOf('a') == -1)
										{
											//convert RGB to RGBA
											colour = colour.replace(')', ', ' + opacity + ')').replace('rgb', 'rgba');
										}
										else
										{
											//alter A component of RGBA
											colour = colour.substr(0, colour.lastIndexOf(',')).concat(', ' + opacity + ')');
										}
										console.log("Current colour: ", colour);
										ele.css('background-color', colour);
									}
									return false;
								});
							}
						},
					}
				},
				"border": border_menu_entry(target_element),
				"position": zIndex_menu_entry(),
				"sep2": "---------",
				"clone": {"name": "Clone", "callback" : function(key, options){
					//clone
				}},
				"template":
				{
					"name": "Templates",
					"items":
					{
						"save":{"name": "Save As", "callback": function(key, options){
							//ensure we dont have any issues with sharing template keys
							var count = 0;
							while (template_menu_list["template" + project_project.template_menus.template_ID] !== undefined && count < 100)
							{
								project_project.template_menus.template_ID++;
								count++;
								console.log("conflict with template IDs")
							}
							//create a new template menu entry, storing the needed html
							if (count < 100)
							{
								var saved = options.$trigger.parent().parent().children(target_element)[0].outerHTML

								myModal.prompt("Create Container Template", "Saves the styles of a page to be loaded later", [{name: "Template", default: "", type: "text"}], function(results)
								{
									if(!myModal.confirm)
										return;
									var name = results[0];
									template_menu_list["template" + project_project.template_menus.template_ID] =
									{
										"name": name,
										"savedhtml": saved, //goes for the editdiv
										"callback": function(key, options){
											//generate function callbacks for templates in load/delete dropdowns
											if (options.$selected.parent().siblings('span').html() == "Load")
											{
												//load template
												console.log("Loading: " + key);
												//options.$trigger is the jquery object for the icon that triggers the menu
												var element = options.$trigger.parent().parent().children(target_element);

												//save inner content
												var preserve_content = element.html();
												//swap outer tag, including style stuff
												element[0].outerHTML = template_menu_list[key].savedhtml;
												options.$trigger.parent().parent().children(target_element).html(preserve_content);
											}
											else if (options.$selected.parent().siblings('span').html() == "Delete")
											{
												console.log("Delete: " + key);
												delete template_menu_list[key]
											}
										}
									}
									project_project.template_menus.template_ID++;
								});
							}
						}},
						"load":{
							"name": "Load",
							"items": template_menu_list
						},
						"delete":{
							"name": "Delete",
							"items": template_menu_list
						}
					},
				},
				"delete": {"name": "Delete", "icon": "delete", "callback" : function(key, options){
					if (confirm("Are you sure you want to delete this container?"))
					{
						//remove from HTML
						var id = options.$trigger.siblings('.handle').attr('id').split(container_type)[1] //get the cytoscape name from the div ID
						removeContainer(container_type, id);
					}
				}},
			},
			"events": {
				show: function(opt) {
					// this is the trigger element
					var $this = this;
					// import states from data store
					$.contextMenu.setInputValues(opt, $this.data());
				},
				hide: function(opt) {
					// this is the trigger element
					var $this = this;
					// export states to data store
					$.contextMenu.getInputValues(opt, $this.data());
					//change values based on selects
					changeCSSinMenu(target_element, opt, "border-style", $this.data().Style);
					changeCSSinMenu(target_element, opt, "text-align", $this.data().Alignment);
					changeCSSinMenu(target_element, opt, "font-family", $this.data().fontfamily);

				}
			}
		}
	}
	else if (container_type == "img")
	{
		return {
			"items":
			{
				"border": border_menu_entry(target_element),
				"position": zIndex_menu_entry(),
				"sep3": "---------",
				"URL":
				{
					"name":"Change URL",
					"callback": function(key, options)
					{
						var ele = options.$trigger.parent().siblings(target_element);
						myModal.prompt("Change URL", "", [{name: "Enter image url", default: "http://", type: "text"}], function(results){
							if(!myModal.confirm)
								return;
							var imgurl = results[0];
							if(html_string = checkImageURL(imgurl, container_type)) //returns false for failure
							{
								$.ajax(
								{
									url: imgurl, //or your url
									success: function(data)
									{
										//Replace URL
										var parent = ele;
										var copy = parent.parent();

										parent.remove();

										copy.append(html_string);
									},
									error: function(data)
									{
										alert('URL: ' + imgurl + ' does not exist');
									},
								})
							}
						});
					}
				},
				"delete": {"name": "Delete", "icon": "delete", "callback" : function(key, options){
					if (confirm("Are you sure you want to delete this container?"))
					{
						//remove from HTML

						var id = options.$trigger.siblings('.handle').attr('id').split(container_type)[1] //get the cytoscape name from the div ID
						removeContainer(container_type, id);
					}
				}},
			},
			"events": {
				show: function(opt) {
					// this is the trigger element
					var $this = this;
					// import states from data store
					$.contextMenu.setInputValues(opt, $this.data());
				},
				hide: function(opt) {
					// this is the trigger element
					var $this = this;
					// export states to data store
					$.contextMenu.getInputValues(opt, $this.data());

					//change values based on selects
					changeCSSinMenu(target_element, opt, "border-style", $this.data().Style);
				}
			}
		}
	}
	else if (container_type == "vid")
	{
		return {
			"items":
			{
				"border": border_menu_entry(target_element),
				"position": zIndex_menu_entry(),
				"sep3": "---------",
				"URL":
				{
					"name":"Change URL",
					"callback": function(key, options)
					{
						var ele = options.$trigger.parent().siblings(target_element);
						myModal.prompt("Change URL", "", [{name: "Enter image url", default: "http://", type: "text"}], function(results){
							if(!myModal.confirm)
								return;
							var imgurl = results[0];
							if(html_string = checkImageURL(imgurl, container_type)) //returns false for failure
							{
								$.ajax(
								{
									url: imgurl, //or your url
									success: function(data)
									{
										//Replace URL
										var parent = ele;
										var copy = parent.parent();

										parent.remove();

										copy.append(html_string);
									},
									error: function(data)
									{
										alert('URL: ' + imgurl + ' does not exist');
									},
								})
							}
						});
					}
				},
				"delete": {"name": "Delete", "icon": "delete", "callback" : function(key, options){
					if (confirm("Are you sure you want to delete this container?"))
					{
						//remove from HTML

						var id = options.$trigger.siblings('.handle').attr('id').split(container_type)[1] //get the cytoscape name from the div ID
						removeContainer(container_type, id);
					}
				}},
			},
			"events": {
				show: function(opt) {
					// this is the trigger element
					var $this = this;
					// import states from data store
					$.contextMenu.setInputValues(opt, $this.data());
				},
				hide: function(opt) {
					// this is the trigger element
					var $this = this;
					// export states to data store
					$.contextMenu.getInputValues(opt, $this.data());

					//change values based on selects
					changeCSSinMenu(target_element, opt, "border-style", $this.data().Style);
				}
			}
		}
	}
	else if (container_type == "page")
	{
		return {
			"items":
			{
				"border": border_menu_entry(target_element),
				"background":
				{
					type: "color", customName: "Background Colour", className: "background-color " + target_element,
				},
				"resolution":
				{
					"name": 'Resolution',
					"type": 'select',
					"options": {a320pxa480px: 'Mobile 320x480', a800pxa600px: 'Small 800x600', a1024pxa768px: 'Medium 1024x768', a1280pxa1024px: "Large 1280x1024"},
				}
			},
			"events": {
				show: function(opt) {
					// this is the trigger element
					var $this = this;
					// import states from data store
					$.contextMenu.setInputValues(opt, $this.data());
					// this basically fills the input commands from an object
					// like {name: "foo", yesno: true, radio: "3", &hellip;}
				},
				hide: function(opt) {
					// this is the trigger element
					var $this = this;
					// export states to data store
					$.contextMenu.getInputValues(opt, $this.data());
					$(target_element).css("border-style", $this.data().Style);
					if ($this.data().resolution != null)
					{
						$(target_element).css("width", $this.data().resolution.split('a')[1]);
						$(target_element).css("flex", "0 0 " + $this.data().resolution.split('a')[1]); //needed for pageoverlay flexbox behaviour
						$(target_element).css("height", $this.data().resolution.split('a')[2]);
					}
					// $('#edit-page-toolbar').css("height", $this.data().resolution.split('a')[2]);

				}
			}
		}
	}
}

function zIndex_menu_entry()
{
		return {
			"name": "Position",
			"items":
			{
					"Front": { "name": "Bring to Front", "callback": function(key, options)
					{
						var max = 0;
						$('#pagecontainers').children('div').each(function()
						{
							var z = $(this).css('zIndex');
							if (z > max)
								max = z;
						});
						max++;
						console.log("Set zIndex to ", max);
						options.$trigger.parent().parent().css("zIndex", max);
					}},
					"Back": { "name": "Send to Back", "callback": function(key, options)
					{
						var min = 10000;
						$('#pagecontainers').children('div').each(function()
						{
							var z = $(this).css('zIndex');
							if (z < min)
								min = z;
						});
						min--;
						if (min < 0)
							min = 0;
						console.log("Set zIndex to ", min);
						options.$trigger.parent().parent().css("zIndex", min); //".text-container" level

					}},
			}
		}
};

function border_menu_entry(target_element)
{
	return {
		"name": "Border",
		"items":
		{
			"Style":
			{
				"name": "Style",
				"type": 'select',
				"options": {none: 'None', solid: 'Solid', double: 'Double', dashed: "Dashed", dotted: "Dotted", outset: "Outset", ridge: "Ridge"},
			},
			"Colour":
			{
				type: "color", customName: "Colour", className: "border-color " + target_element,
			},
			"Corners":
			{
				"name": "Rounded Corners", "callback": function(key, options){

					var ele = options.$trigger.parent().siblings(target_element);
					myModal.prompt("Corner rounding", "Square is 0, the higher the rounder. Results may vary.", [{name: "Rounding pixels", default: parseInt(ele.css("border-radius")), min: "0", max: "1000", type: "number"}], function(results)
					{
						if(!myModal.confirm)
							return;
						var size = results[0];
						if (size <= 1000 && size >= 0)
							return ele.css("border-radius", size + "px");
						else
							return false;
					});
				}
			},
			"Thickness":
			{
				"name": "Border Width", "callback": function(key, options){
					var ele = options.$trigger.parent().siblings(target_element);
					myModal.prompt("Border Width", "Any value between 1 and 40. To hide set border style to 'none'", [{name: "Thickness pixels", default: parseInt(ele.css("border-width")), min: "1", max: "40", type: "number"}], function(results)
					{
						if(!myModal.confirm)
							return;
						var size = results[0];
						if (size <= 40 && size >= 1)
							return ele.css("border-width", size + "px");
						else
							return false;
					});
				}
			},
		}
	}
};

$(function(){
	/**************************************************
	 * Text container context menu
	 **************************************************/
	$.contextMenu(
	{
		selector: '.textmenu',
		trigger: 'left',
		//regenerate the menu each time it is summoned (to accomodate for changes in stored templates)
		build: function($trigger, e)
		{
			console.log("Triggered text menu context menu")
			return generateContextMenu("text", project_project.template_menus.text_template_menu_list);
		}
	});
	/**************************************************
	 * Decision container context menu
	 **************************************************/
	$.contextMenu(
	{
		selector: '.decmenu',
		trigger: 'left',
		//regenerate the menu each time it is summoned (to accomodate for changes in stored templates)
		build: function($trigger, e)
		{
			return generateContextMenu("decision", project_project.template_menus.decision_template_menu_list);
		}
	});
	/**************************************************
	 * Control container context menu
	 **************************************************/
	$.contextMenu(
	{
		selector: '.controlmenu',
		trigger: 'left',
		//regenerate the menu each time it is summoned (to accomodate for changes in stored templates)
		build: function($trigger, e)
		{
			return generateContextMenu("output", project_project.template_menus.text_template_menu_list);
		}
	});
	$.contextMenu(
	{
		selector: '.imgmenu',
		trigger: 'left',
		//regenerate the menu each time it is summoned (to accomodate for changes in stored templates)
		build: function($trigger, e)
		{
			return generateContextMenu("img", project_project.template_menus.image_template_menu_list);
		}
	});
	$.contextMenu(
	{
		selector: '.vidmenu',
		trigger: 'left',
		//regenerate the menu each time it is summoned (to accomodate for changes in stored templates)
		build: function($trigger, e)
		{
			return generateContextMenu("vid", project_project.template_menus.video_template_menu_list);
		}
	});
	$.contextMenu(
	{
		selector: '.pagemenu',
		trigger: 'left',
		//regenerate the menu each time it is summoned (to accomodate for changes in stored templates)
		build: function($trigger, e)
		{
			return generateContextMenu("page");
			//return generateContextMenu("page", page_template_menu_list);
		}
	});
	$.contextMenu(
	{
		selector: '#addevent',
		trigger: 'left',
		//regenerate the menu each time it is summoned (to accomodate for changes in stored templates)
		build: function($trigger, e)
		{
			var audiolist = project_project.audio.getAssetAsMenu();
			return {
			"items":
				{
					"Audio":
					{
						"name": "Audio",
						"items": audiolist
					},
				}
			}
		}
	});


});




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
			 options.items['sep'] = {
				 name: '----------------------------------------------',
				 disabled: true
			 }
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
			 console.log(project_project)
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
	 //}
	 /*
	 else {
		 options.items.bar = {name: "bar"};
	 }
	 */

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
 			}
     } else {

     }

     return options;
   }
 });

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

 function generateOutcome(id){
	 var html = '<li id=' + id + '>'+
								'<div class="row">'+
									generateSettingsButton(id) +
									generateAttributeButton(id + '_attButton_1', 'game-attributes') +
									generateComparisonButon(id + '_compMenu', 'mods', '+') +
									generateAttributeButton(id + '_attButton_2', 'game-attributes numbers') +
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
