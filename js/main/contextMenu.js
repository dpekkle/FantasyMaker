/*
	Name: contextMenu.js
	Created By: Danielle
	Purpose: To generate context menus in the page designer overlay
*/

goog.provide('contextMenu')
goog.require('pageContainerHelpers')
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

function generateTemplateCallback(target_element, template_menu_list)
{
	return function(key, options)
	{
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

function loadTemplateMenuObj()
{
	$.each(project_project.template_menus.text_template_menu_list, function(){
		this.callback = generateTemplateCallback(".editdiv", project_project.template_menus.text_template_menu_list);
	});
	$.each(project_project.template_menus.decision_template_menu_list, function(){
		this.callback = generateTemplateCallback(".editdiv", project_project.template_menus.decision_template_menu_list);
	});
	$.each(project_project.template_menus.image_template_menu_list, function(){
		this.callback = generateTemplateCallback(".editdiv", project_project.template_menus.image_template_menu_list);
	});
	$.each(project_project.template_menus.video_template_menu_list, function(){
		this.callback = generateTemplateCallback(".editdiv", project_project.template_menus.video_template_menu_list);
	});
	$.each(project_project.template_menus.page_template_menu_list, function(){
		this.callback = generateTemplateCallback(".editdiv", project_project.template_menus.page_template_menu_list);
	});
}

function templateMenuObj()
{
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
	if (container_type == "text" || container_type == "output" || container_type == "debug" || container_type == "img" || container_type == "vid")
		var target_element = '.editdiv';
	else if (container_type == "decision" || container_type == "jump" || container_type == "jumpback" || container_type == "inventory" || container_type == "character")
		var target_element = '.editdec';
	else if (container_type == "page")
		var target_element = '#pagecontainers';

	//generate menu items
	if (container_type == "text" || container_type == "decision" || container_type == "output" || container_type == "debug" || container_type == "jump" || container_type == "jumpback" || container_type == "inventory" || container_type == "character")
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
									var value = results[0];
									ele.css('font-size', value);
								},
								function(results)
								{
									if (results[0] <= 40 && results[0] >= 1)
									{
										return true;
									}
									else
										return "Ensure number is between 1 and 40";
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
								},
								function(results)
								{
									if (results[0] <= 100 && results[0] >= 0)
									{
										return true;
									}
									else
										return "Ensure number is between 0 and 100";

								});
							}
						},
					}
				},
				"border": border_menu_entry(target_element),
				"position": zIndex_menu_entry(),
				"sep2": "---------",
				"template":
				{
					"name": "Templates",
					"items":
					{
						"save":{"name": "Save As", "callback": function(key, options){
							//ensure we dont have any issues with sharing template keys
							// var count = 0;
							// while (template_menu_list["template" + project_project.template_menus.template_ID] !== undefined && count < 100)
							// {
							// 	project_project.template_menus.template_ID++;
							// 	count++;
							// 	console.log("conflict with template IDs")
							// }

							//create a new template menu entry, storing the needed html
							var saved = options.$trigger.parent().parent().children(target_element)[0].outerHTML

							myModal.prompt("Create Container Template", "Saves the style of this container (e.g. background colour), allowing you to load them into other containers", [{name: "Template", default: "", type: "text"}], function(results)
							{
								var name = results[0];
								template_menu_list[name] =
								{
									"name": name,
									"savedhtml": saved,
									"callback": generateTemplateCallback(target_element, template_menu_list)
								}
							},
							function(results){
								if (results[0] == "")
								{
									return "Can't be an empty name";
								}
									else if (results[0] == "Default")
								{
									return "Can't override Default";
								}
								else if (template_menu_list[results[0]] !== undefined)
								{
									return "A template with that name already exists"
								}
								else
								{
									return true;
								}
							});
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
						console.log("Remove: #", container_type, id);
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
						myModal.prompt("Change URL", "", [{name: "Enter image url", default: "http://", type: "text"}], function(results)
						{
							if (html_string = checkImageURL(results[0], container_type))
							{
								//change this
								var imgurl = results[0];
								//Replace URL
								var parent = ele;
								var copy = parent.parent();

								parent.remove();

								copy.append(html_string);
							}
						},
						function(results)
						{
							return true;
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
					if (target_element == "#pagecontainers")
						ele = $(target_element);
						myModal.prompt("Corner rounding", "Square is 0, the higher the rounder. Results may vary.", [{name: "Rounding pixels", default: parseInt(ele.css("border-radius")), min: "0", max: "1000", type: "number"}], function(results)
						{
							var size = results[0];
							ele.css("border-radius", size + "px");
						},
						function(results)
						{
							var size = results[0];
							if (size <= 1000 && size >= 0)
								return true;
							else
								return "Ensure border radius greater than 0 and less than 1000"
						});
				}
			},
			"Thickness":
			{
				"name": "Border Width", "callback": function(key, options){
					var ele = options.$trigger.parent().siblings(target_element);
					if (target_element == "#pagecontainers")
						ele = $(target_element);
						myModal.prompt("Border Width", "Any value between 1 and 40. To hide set border style to 'none'", [{name: "Thickness pixels", default: parseInt(ele.css("border-width")), min: "1", max: "40", type: "number"}], function(results)
						{
							var size = results[0];
							ele.css("border-width", size + "px");
						},
						function(results)
						{
							var size = results[0];
							if (size <= 40 && size >= 0)
								return true;
							else
								return "Ensure border width greater than 1 and less than 40"
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

	//handles for special buttons
	$.contextMenu(
	{
		selector: '.jumpmenu',
		trigger: 'left',
		//regenerate the menu each time it is summoned (to accomodate for changes in stored templates)
		build: function($trigger, e)
		{
			return generateContextMenu("jump", project_project.template_menus.decision_template_menu_list);
		}
	});
	$.contextMenu(
	{
		selector: '.jumpbackmenu',
		trigger: 'left',
		//regenerate the menu each time it is summoned (to accomodate for changes in stored templates)
		build: function($trigger, e)
		{
			return generateContextMenu("jumpback", project_project.template_menus.decision_template_menu_list);
		}
	});
	$.contextMenu(
	{
		selector: '.inventorymenu',
		trigger: 'left',
		//regenerate the menu each time it is summoned (to accomodate for changes in stored templates)
		build: function($trigger, e)
		{
			return generateContextMenu("inventory", project_project.template_menus.decision_template_menu_list);
		}
	});
	$.contextMenu(
	{
		selector: '.charactermenu',
		trigger: 'left',
		//regenerate the menu each time it is summoned (to accomodate for changes in stored templates)
		build: function($trigger, e)
		{
			return generateContextMenu("character", project_project.template_menus.decision_template_menu_list);
		}
	});

	$.contextMenu(
	{
		selector: '.special-buttons',
		trigger: 'left',
		//regenerate the menu each time it is summoned (to accomodate for changes in stored templates)
		build: function($trigger, e)
		{
			var jump_buttons = project_project.button_list;
			return {
			"items":
				{
					"Jump":
					{
						"name": "Jump Buttons",
						"items": jump_buttons,
					},
					"Jump Back":
					{
						"name": "Jump Back",
						"callback": function(key, options)
						{
							//create a jump back button
							//create the container and append it to the page
							var position = genPageCenterHTML(300, 220);
							var html_string  =  "<div class='button-container drag-element' style='position:absolute; " + position + "'>"
							html_string		+=		"<div class='jumpback editdec resize-element' contenteditable=true handle='jumpback'></div>"
							html_string 	+= 	"</div>"

							var size = $(".button-container").length;
							var new_container = htmlToElements(html_string);

							$("#pagecontainers").append(new_container);

							$("#pagecontainers div.button-container:last").prepend(genHandleHTML("jumpback", size + 1));

							bringContainerToFront($("#pagecontainers div.button-container:last"));
							$("#pagecontainers div.button-container:last .editdec").trigger('focus');
							if (!show_handles)
								$('.handlecontainer').hide();
							bindHandleSelection();
						}
					},
					"Attributes":
					{
						"name": "Show Character Panel",
						"callback": function(key, options)
						{
							console.log("Create a Character panel button");
							//create the container and append it to the page
							var position = genPageCenterHTML(300, 220);
							var html_string  =  "<div class='button-container drag-element' style='position:absolute; " + position + "'>"
							html_string		+=		"<div class='character editdec resize-element' contenteditable=true handle='character'></div>"
							html_string 	+= 	"</div>"

							var size = $(".button-container").length;
							var new_container = htmlToElements(html_string);

							$("#pagecontainers").append(new_container);

							$("#pagecontainers div.button-container:last").prepend(genHandleHTML("character", size + 1));

							bringContainerToFront($("#pagecontainers div.button-container:last"));
							$("#pagecontainers div.button-container:last .editdec").trigger('focus');
							if (!show_handles)
								$('.handlecontainer').hide();
							bindHandleSelection();
						}
					},
					"Inventory":
					{
						"name": "Show Inventory",
						"callback": function(key, options)
						{
							console.log("Create an inventory button");
							//create the container and append it to the page
							var position = genPageCenterHTML(300, 220);
							var html_string  =  "<div class='button-container drag-element' style='position:absolute; " + position + "'>"
							html_string		+=		"<div class='inventory editdec resize-element' contenteditable=true handle='inventory'></div>"
							html_string 	+= 	"</div>"

							var size = $(".button-container").length;
							var new_container = htmlToElements(html_string);

							$("#pagecontainers").append(new_container);

							$("#pagecontainers div.button-container:last").prepend(genHandleHTML("inventory", size + 1));

							bringContainerToFront($("#pagecontainers div.button-container:last"));
							$("#pagecontainers div.button-container:last .editdec").trigger('focus');
							if (!show_handles)
								$('.handlecontainer').hide();
							bindHandleSelection();

						}
					},
				}
			}
		}
	});
});
