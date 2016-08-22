goog.provide('contextMenu')
goog.require('generalOverlay')
picked_colour = "#FFF";

//Right click context menus

function changeCSSinMenu(target, key, options, attribute, value)
{
	options.$trigger.parent().siblings(target).css(attribute, value);
	return false; //return this function in a callback to prevent the menu from closing when an option is selected
}

var picked_colour = "rgba(255,255,255,1.0)";
$("#ColourPicker").spectrum({
    color: picked_colour,
	change: function(color) {
	    picked_colour = color.toRgbString(); // #rgb(255,0,0)
	    $('#ColourPicker').css("background-color", picked_colour);
	}
});

// THESE WILL NEED TO BE ATTRIBUTES FOR THE PROJECT

var template_ID = 0;
var text_template_menu_list = {} //shared with control output containers
var decision_template_menu_list = {}
var image_template_menu_list = {}

function generateContextMenu(container_type, template_menu_list)
{
	//choose target element
	if (container_type == "Text" || container_type == "Control")
		var target_element = '.editdiv';
	else if (container_type == "Decision")
		var target_element = '.editdec';
	else if (container_type == "Image")
		var target_element = '.editdiv';

	//generate menu items
	if (container_type == "Text" || container_type == "Decision" || container_type == "Control")
	{
		return {
			"items":
			{
				"font":
				{
					"name": "Text",
					"items":
					{
						"Alignment":
						{
							"name": "Alignment",
							"items":
							{
								"Left":{"name": "Left", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "text-align", "left");
								}},
								"Right":{"name": "Right", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "text-align", "Right");
								}},
								"Center":{"name": "Center", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "text-align", "Center");
								}},
								"Justify":{"name": "Justify", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "text-align", "Justify");
								}},
							}
						},
						"font-family": 
						{
							"name": "Style",
							"items":
							{
								"fold2-key1":{"name": "Courier New", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "font-family", "\"Courier New\", Courier, monospace");
								}},
								"fold2-key2":{"name": "Lucinda Console", "callback": function(key,options){
									return changeCSSinMenu(target_element, key, options, "font-family", "\"Lucida Console\", Monaco, monospace");
								}},
								"fold2-key3":{"name": "Times New Roman", "callback": function(key,options){
									return changeCSSinMenu(target_element, key, options, "font-family", "\"Times New Roman\", Times, serif");
								}},
								"fold2-key4":{"name": "Arial", "callback": function(key,options){
									return changeCSSinMenu(target_element, key, options, "font-family", "\"Arial\", Helvetica, sans-serif");
								}},
								"fold2-key5":{"name": "Tahoma", "callback": function(key,options){
									return changeCSSinMenu(target_element, key, options, "font-family", "Tahoma, Geneva, sans-serif");
								}},
								"fold2-key6":{"name": "Comic Sans", "callback": function(key,options){
									return changeCSSinMenu(target_element, key, options, "font-family", "\"Comic Sans MS\", cursive, sans-serif");
								}},
							}
						},
						"font-size":
						{
							"name": "Size",
							"callback": function(key, options){
								var size = prompt("Enter font size", "14");
								if (size <= 50 && size >= 0)
									return changeCSSinMenu(target_element, key, options, "font-size", size + "px");		
								else
									return false;				
							}						
						},
						"font-color":
						{
							"name": "Colour", 
							"items": 
							{
								"Red": {"name": "Black", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "color", "Black");
								}},
								"Gray": {"name": "Gray", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "color", "Gray");
								}},
								"White": {"name": "White", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "color", "White");
								}},
								"Custom": {"name": "Custom", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "color", picked_colour);
								}},
								
							}
						}
					}
				},
				"background": 
				{
					"name": "Background",
					"items": 
					{
						"Colour":
						{
							"name": "Background Colour", 
							"items": 
							{
								"Gray": {"name": "Gray", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "background-color", "Gray");
								}},
								"White": {"name": "White", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "background-color", "White");
								}},
								"Custom": {"name": "Custom", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "background-color", picked_colour);
								}},
							}
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
				"border":
				{
					"name": "Border",
					"items":
					{
						"Style": 
						{
							"name": "Style", 
							"items": 
							{
								"None": {"name": "None", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "border-style", "none");
								}},
								"Solid": {"name": "Solid", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "border-style", "solid");
								}},
								"Double": {"name": "Double", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "border-style", "double");
								}},
								"Dashed": {"name": "Dashed", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "border-style", "dashed");
								}},
								"Dotted": {"name": "Dotted", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "border-style", "dotted");
								}},
								"Button": {"name": "Button", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "border-style", "outset");
								}},
								"Ridge": {"name": "Ridge", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "border-style", "ridge");
								}},

							}
						},
						"Colour": 
						{
							"name": "Colour", 
							"items": 
							{
								"Red": {"name": "Black", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "border-color", "Black");
								}},
								"Gray": {"name": "Gray", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "border-color", "Gray");
								}},
								"Custom": {"name": "Custom", "callback": function(key, options){
									return changeCSSinMenu(target_element, key, options, "border-color", picked_colour);
								}},
							}

						},
						"Corners": 
						{
							"name": "Rounded Corners", "callback": function(key, options){
								var size = prompt("Enter a number from 0 (square)  to 12 (fully rounded)", "5");
								if (size <= 12 && size >= 0)
									return changeCSSinMenu(target_element, key, options, "border-radius", size + "px");		
								else
									return false;				
							}
						},
						"Thickness": 						
						{
							"name": "Border Width", "callback": function(key, options){
								var size = prompt("Enter a number from 0 up", "2");
								if (size <= 100 && size >= 0)
									return changeCSSinMenu(target_element, key, options, "border-width", size + "px");		
								else
									return false;				
							}
						},


					}
				},
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
						options.$trigger.parent().parent().remove();
					}
				}},
			}
		}
	}
	else if (container_type == "Image")
	{
		return {
			"items":
			{
				"URL":
				{
					"name":"Change URL",
					"callback": function(key, options){
						var imgurl = prompt("Enter new URL for image/video", "http://");
						var html_string = checkImageURL(imgurl, "");

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
			}
		}
	}
}

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
	        return generateContextMenu("Text", text_template_menu_list);
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
	        return generateContextMenu("Decision", decision_template_menu_list);
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
	        return generateContextMenu("Control", text_template_menu_list);
		}
	});
	$.contextMenu(
	{
		selector: '.imgmenu',
		trigger: 'left',
		//regenerate the menu each time it is summoned (to accomodate for changes in stored templates)
        build: function($trigger, e) 
        {
	        return generateContextMenu("Image", image_template_menu_list);
		}
	});
});