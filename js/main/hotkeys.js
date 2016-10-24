/*
	Name: hotKeys.js
	Created By: Danielle
	Purpose: To map quick acccess keys
*/

goog.provide('hotkeys')
// goog.require('initCanvas')
// goog.require('states')
// goog.require('generalOverlay')
// goog.require('prompts')

var nodes_to_clone;

$(document).ready(function()
{
	var ctrl_key_held = false;
	$('html').on('keyup' , function(e)
	{
		if (e.which == 17 || e.which == 91) //ctrl/cmd
		{
			ctrl_key_held = false;
		}
	}).on('keydown' , function(e)
	{
		if (e.which == 17 || e.which == 91) //ctrl/cmd
		{
			ctrl_key_held = true;
		}
		if ($('#Play').css('display') == 'none' && !$('.modal').hasClass('open') ) //only want to work in cytoscape view
		{
			console.log(e.which);
			if (ctrl_key_held && e.which == 67) // c key
			{
				//copy
				if (cy.$(':selected').length != 0)
				{
					if (cy.$(':selected:parent').length == 0)
					{
						console.log("Copy");
						nodes_to_clone = cy.$(':selected').nodes().jsons();
						console.log(nodes_to_clone);
					}
				}
			}
			else if (ctrl_key_held && e.which == 86) // v key
			{
				console.log(nodes_to_clone)
				//paste
				if (nodes_to_clone !== null)
				{
					console.log("Paste");
					cy.$(':selected').unselect();
					for (var i = 0; i < nodes_to_clone.length; i++)
					{
						var pos = { x: nodes_to_clone[i].position.x + 10, y: nodes_to_clone[i].position.y += 10};
						nodes_to_clone[i].data.name = parseInt(cy.nodes().size() + 1);
						nodes_to_clone[i].classes = nodes_to_clone[i].classes.replace('start', '');
						delete nodes_to_clone[i].data.id;

						cy.add({"data": nodes_to_clone[i].data, "classes": nodes_to_clone[i].classes, "group": nodes_to_clone[i].group, "position": pos}).select();

					}
					nodes_to_clone = cy.$(':selected').nodes().jsons();

				}
			}
			else if (e.which == 27) //escape
			{
				console.log("Press escape!");
				defaultState();
				cy.$(':selected').unselect();
			}
			else if (e.which >= 49 && e.which <= 58) //top number keys 1-0
			{
				if ($('.dropdown-content.active').length == 0)
				{
					if (e.which == 49) //1
					{
						$('.pagemode').trigger('click');
					}
					else if (e.which == 50) //2
					{
						$('.controlmode').trigger('click');
					}
					else if (e.which == 51) //3
					{
						$('.jumpmode').trigger('click');
					}
					else if (e.which == 52) //4
					{
						$('.connectionmode').trigger('click');
					}
					else if (e.which == 53) //5
					{
						$('.prebuilt').trigger('click');
					}
				}
				else //choose a template for adding page node
				{
					$('.dropdown-content.active li a').eq(e.which-49).trigger('click');
				}
			}

			else if (cy.$(':selected').length != 0)
			{
				if(e.which == 8 || e.which == 46)  //backspace / delete
				{
					console.log("Press delete")
					$('.deletebutton')[0].click();
				}
				else if(e.which == 13 || e.which == 32) //enter / space
				{
					event.preventDefault();
					console.log("TRIGGER OPENING MODAL")
					$('.openoverlay').each(function(index)
					{
						if ($(this).css('display') != "none")
						{
							console.log("Enter press on ", $(this))
							if (!$('.modal').hasClass('open'))
								$(this).trigger('click');
						}
					});
				}

			}
		}
		else if ($('#prompt-modal').hasClass('open'))
		{
			if (e.which == 13)
			{
				console.log("TRIGGER ENTER SELECT")

				myModal.evaluateModal(true)
			}
			else if (e.which == 27)
				myModal.evaluateModal(false);
		}
		else if ($('#define-attribute-modal').hasClass('open'))
		{
			if (e.which == 13)
				defineAttributeModal.evaluateModal(true)
			else if (e.which == 27)
				defineAttributeModal.evaluateModal(false);
		}
	});
});
