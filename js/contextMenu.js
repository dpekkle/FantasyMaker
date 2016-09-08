goog.provide('contextMenu')
goog.require('generalOverlay')

//Right click context menus

function changeCSSinMenu(target, options, attribute, value)
{
	console.log("Inside change CSS")
	console.log(options)


	if (target == '#pagecontainers')
		$(target).css(attribute, value);
	else
		options.$trigger.parent().siblings(target).css(attribute, value);
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

var template_ID = 0;
var text_template_menu_list = {} //shared with control output containers
var decision_template_menu_list = {}
var image_template_menu_list = {}
var page_template_menu_list = {}

// *******************************************************************************

//custom type of menu item for selecting a colour
$.contextMenu.types.color = function(item, opt, root) {
	// this === item.$node
	console.log(item)
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
	else if (container_type == "img")
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
							"callback": function(key, options){
								var size = prompt("Enter font size", "14");
								if (size <= 50 && size >= 0)
									return changeCSSinMenu(target_element, options, "font-size", size + "px");		
								else
									return false;				
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
								var opacity = prompt("Enter an opacity from 0-100", "100");

								if (opacity <= 100 && opacity >= 0)
								{
									opacity /= 100;

									var colour = options.$trigger.parent().siblings(target_element).css('background-color');
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
									options.$trigger.parent().siblings(target_element).css('background-color', colour);
								}
								return false;
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
							while (template_menu_list["template" + template_ID] !== undefined && count < 100)
							{
								template_ID++;
								count++;
								console.log("conflict with template IDs")
							}
							//create a new template menu entry, storing the needed html
							if (count < 100)
							{
								var name = prompt("Enter name for template"); 
								template_menu_list["template" + template_ID] = 
								{
									"name": name,
									"savedhtml": options.$trigger.parent().parent().children(target_element)[0].outerHTML, //goes for the editdiv
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
											delete template_menu_list[key]
										}
									}
								}
								template_ID++;
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

						var id = options.$trigger.parent().attr('id').split(container_type)[1] //get the cytoscape name from the div ID
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
					"callback": function(key, options){
						var imgurl = prompt("Enter new URL for image/video", "http://");
						if(html_string = checkImageURL(imgurl, "")) //returns false for failure
						{
							$.ajax(
							{
								url: imgurl, //or your url
								success: function(data)
								{
									//Replace URL
									var parent = $(target_element).parent();	
									$(target_element).remove();
									parent.append(html_string);
								},
								error: function(data)
								{
									alert('URL: ' + imgurl + ' does not exist');
								},
							})
						}

					}
				},
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
					// this basically dumps the input commands' values to an object
					// like {name: "foo", yesno: true, radio: "3", &hellip;}
					console.log($this.data())

					//change values based on selects
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
					var size = prompt("Enter a number from 0 (square)  to 12 (fully rounded)", "5");
					if (size <= 12 && size >= 0)
						return changeCSSinMenu(target_element, options, "border-radius", size + "px");		
					else
						return false;				
				}
			},
			"Thickness": 						
			{
				"name": "Border Width", "callback": function(key, options){
					var size = prompt("Enter a number from 0 up", "2");
					if (size <= 100 && size >= 0)
						return changeCSSinMenu(target_element, options, "border-width", size + "px");		
					else
						return false;				
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
			return generateContextMenu("text", text_template_menu_list);
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
			return generateContextMenu("decision", decision_template_menu_list);
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
			return generateContextMenu("output", text_template_menu_list);
		}
	});
	$.contextMenu(
	{
		selector: '.imgmenu',
		trigger: 'left',
		//regenerate the menu each time it is summoned (to accomodate for changes in stored templates)
		build: function($trigger, e) 
		{
			return generateContextMenu("img", image_template_menu_list);
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
});


