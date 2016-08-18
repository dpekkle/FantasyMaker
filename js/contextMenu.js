goog.provide('contextMenu')

//Right click context menus

function changeCSSinMenu(key, options, attribute, value)
{
	options.$trigger.parent().siblings('.editdiv').css(attribute, value);
}

$(function(){
	/**************************************************
	 * Text container context menu
	 **************************************************/
	$.contextMenu(
	{
		selector: '.textmenu',
		trigger: 'left',
		items: 
		{
			"sep2": "---------",
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
								changeCSSinMenu(key, options, "font-family", "\"Courier New\", Courier, monospace")}
							},
							"fold2-key2":{"name": "Lucinda Console", "callback": function(key,options){
								changeCSSinMenu(key, options, "font-family", "\"Lucida Console\", Monaco, monospace");
							}},
							"fold2-key3":{"name": "Times New Roman", "callback": function(key,options){
								changeCSSinMenu(key, options, "font-family", "\"Times New Roman\", Times, serif");
							}},
							"fold2-key4":{"name": "Arial", "callback": function(key,options){
								changeCSSinMenu(key, options, "font-family", "\"Arial\", Helvetica, sans-serif");
							}},
							"fold2-key5":{"name": "Tahoma", "callback": function(key,options){
								changeCSSinMenu(key, options, "font-family", "Tahoma, Geneva, sans-serif");
							}},
							"fold2-key6":{"name": "Comic Sans", "callback": function(key,options){
								changeCSSinMenu(key, options, "font-family", "\"Comic Sans MS\", cursive, sans-serif");
							}},
						}
					},
					"font-size":
					{
						"name": "Size",
						"callback": function(key, options){
							var size = prompt("Enter font size", "14");
							changeCSSinMenu(key, options, "font-size", size + "px");						
						}						
					},
					"font-color":
					{
						"name": "Colour", 
						"items": 
						{
							"Red": {"name": "Black", "callback": function(key, options){
								changeCSSinMenu(key, options, "color", "Black");
							}},
							"Gray": {"name": "Gray", "callback": function(key, options){
								changeCSSinMenu(key, options, "color", "Gray");
							}},
							"White": {"name": "White", "callback": function(key, options){
								changeCSSinMenu(key, options, "color", "White");
							}},
							"Custom": {"name": "Custom", "callback": function(key, options){
								var colour = prompt("Enter hex colour", "#FFFFFF");
								changeCSSinMenu(key, options, "background-color", colour);
							}},
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
								changeCSSinMenu(key, options, "background-color", "Red");
							}},
							"Gray": {"name": "Gray", "callback": function(key, options){
								changeCSSinMenu(key, options, "background-color", "Gray");
							}},
							"White": {"name": "White", "callback": function(key, options){
								changeCSSinMenu(key, options, "background-color", "White");
							}},
							"Custom": {"name": "Custom", "callback": function(key, options){
								var colour = prompt("Enter hex colour", "#FFFFFF");
								changeCSSinMenu(key, options, "background-color", colour);
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
			"delete": {"name": "Delete", "icon": "delete", "callback" : function(key, options){
				alert("Are you sure you want to delete this container?");
				//remove from HTML
				options.$trigger.parent().parent().remove();
			}},

		}
	});
});
