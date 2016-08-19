goog.provide('contextMenu')
goog.require('generalOverlay')
picked_colour = "#FFF";

//Right click context menus

function changeCSSinMenu(key, options, attribute, value)
{
	options.$trigger.parent().siblings('.editdiv').css(attribute, value);
	return false; //return this function in a callback to prevent the menu from closing when an option is selected
}

$("#ColourPicker").spectrum({
    color: "#f00",
	change: function(color) {
	    picked_colour = color.toHexString(); // #ff0000
	    $('#ColourPicker').css("background-color", picked_colour);
}

});

// THESE WILL NEED TO BE ATTRIBUTES FOR THE PROJECT

var template_ID = 0;
var template_menu_list = {
}


$(function(){
	/**************************************************
	 * Text container context menu
	 **************************************************/
	$.contextMenu(
	{
		selector: '.textmenu',
		trigger: 'left',
        build: function($trigger, e) 
        {
	        return {
				items: 
				{
					"font":
					{
						"name": "Font",
						"items":
						{
							"font-family": 
							{
								"name": "Style",
								"items":
								{
									"fold2-key1":{"name": "Courier New", "callback": function(key, options){
										return changeCSSinMenu(key, options, "font-family", "\"Courier New\", Courier, monospace");
									}},
									"fold2-key2":{"name": "Lucinda Console", "callback": function(key,options){
										return changeCSSinMenu(key, options, "font-family", "\"Lucida Console\", Monaco, monospace");
									}},
									"fold2-key3":{"name": "Times New Roman", "callback": function(key,options){
										return changeCSSinMenu(key, options, "font-family", "\"Times New Roman\", Times, serif");
									}},
									"fold2-key4":{"name": "Arial", "callback": function(key,options){
										return changeCSSinMenu(key, options, "font-family", "\"Arial\", Helvetica, sans-serif");
									}},
									"fold2-key5":{"name": "Tahoma", "callback": function(key,options){
										return changeCSSinMenu(key, options, "font-family", "Tahoma, Geneva, sans-serif");
									}},
									"fold2-key6":{"name": "Comic Sans", "callback": function(key,options){
										return changeCSSinMenu(key, options, "font-family", "\"Comic Sans MS\", cursive, sans-serif");
									}},
								}
							},
							"font-size":
							{
								"name": "Size",
								"callback": function(key, options){
									var size = prompt("Enter font size", "14");
									return changeCSSinMenu(key, options, "font-size", size + "px");						
								}						
							},
							"font-color":
							{
								"name": "Colour", 
								"items": 
								{
									"Red": {"name": "Black", "callback": function(key, options){
										return changeCSSinMenu(key, options, "color", "Black");
									}},
									"Gray": {"name": "Gray", "callback": function(key, options){
										return changeCSSinMenu(key, options, "color", "Gray");
									}},
									"White": {"name": "White", "callback": function(key, options){
										return changeCSSinMenu(key, options, "color", "White");
									}},
									"Custom": {"name": "Custom", "callback": function(key, options){
										return changeCSSinMenu(key, options, "color", picked_colour);
									}},
										//, "callback": function(key, options){
										//return changeCSSinMenu(key, options, "background-color", colour);
									
								}
							}
						}
					},
					"background": 
					{
						"name": "Background",// TODO OPACTIY
						"items": 
						{
							"Colour":
							{
								"name": "Background Colour", 
								"items": 
								{
									"Red": {"name": "Red", "callback": function(key, options){
										return changeCSSinMenu(key, options, "background-color", "Red");
									}},
									"Gray": {"name": "Gray", "callback": function(key, options){
										return changeCSSinMenu(key, options, "background-color", "Gray");
									}},
									"White": {"name": "White", "callback": function(key, options){
										return changeCSSinMenu(key, options, "background-color", "White");
									}},
									"Custom": {"name": "Custom", "callback": function(key, options){
										return changeCSSinMenu(key, options, "background-color", picked_colour);
									}},
								}
							},
							"Opacity":	// TODO
							{
								"name": "Opacity",
								"items": 
								{
								}	
							},
						}
					},
					"border":
					{
						"name": "Border", // TODO
						"items":
						{
							"Visible": {"name": "Visible", "callback": function(key, options){
								//checkmark icon toggle?
							}},
							"Colour": {"name": "Colour", "callback": function(key, options){

							}},
							"Corners": {"name": "Corners", "callback": function(key, options){

							}},
							"Thickness": {"name": "Thickness", "callback": function(key, options){

							}},
							"Style": {"name": "Style", "callback": function(key, options){

							}},
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
										"savedhtml": options.$trigger.parent().parent().children('.editdiv')[0].outerHTML, //goes for the editdiv
										"callback": function(key, options){
											if (options.$selected.parent().siblings('span').html() == "Load")
											{
												//load template
												console.log("Loading: " + key);
												//options.$trigger is the jquery object for the icon that triggers the menu											
												var element = options.$trigger.parent().parent().children('.editdiv');
												var preserve_content = element.html();
												//swap outer tag, including style stuff
												element[0].outerHTML = template_menu_list[key].savedhtml;
												//restore inner content
												options.$trigger.parent().parent().children('.editdiv').html(preserve_content);
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
						alert("Are you sure you want to delete this container?");
						//remove from HTML
						options.$trigger.parent().parent().remove();
					}},
				}
			};
		}
	});
});
