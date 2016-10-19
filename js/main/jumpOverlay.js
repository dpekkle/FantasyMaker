goog.provide('jumpOverlay')
goog.require('genericComparisonRow')


function populateJumpOverlay(element)
{
	var type = element.data('triggerType');
	if (type == "attribute")
	{
		loadJumpConditions();
	}
	else if (type == "button")
	{
		loadJumpButton();	
	}
	setJumpNodeType(type);

	$('#choosejumprepeat input[value="'+ cy.$(':selected')[0].data('repeat') +'"]').prop("checked", true);		
	$('#choosejumptrigger :checked').prop('checked', '');

}

function saveJump()
{
	//save trigger type
	cy.$(':selected')[0].data('repeat', $('#choosejumprepeat :checked').attr('value'));
	cy.$(':selected')[0].data('triggerType', $('#choosejumptrigger :checked').attr('value'));
	//save trigger contents
	saveJumpConditions();
	saveJumpButton();

	//hide sections and uncheck radio buttons
	setJumpNodeType(null);

	//clear list contents
	$('#jumpConditionList').html('');
	$('#jumpButtonList').html('');

}

function setJumpNodeType(jump_node_type)
{
	if (jump_node_type === null)
	{
		$('#choosejumptrigger :checked').prop('checked', '');
		$('.attribute, .button').hide();
	}
	else if (jump_node_type == "attribute")
	{
		$('#choosejumptrigger input[value="attribute"]').prop("checked", true);
		$('.button').hide();
		$('.attribute').show();
	}
	else if (jump_node_type == "button")
	{
		$('#choosejumptrigger input[value="button"]').prop("checked", true);
		$('.button').show();
		$('.attribute').hide();
	}
}

function loadJumpConditions()
{

	var conditions = cy.$(':selected')[0].data('conditions');
	for (var i = 0; i < conditions.length; i++)
	{
		$('#jumpConditionList').append(conditions[i]);

		//load the value of specific values
		$('#row_' + i + '_attbutton1_specValue_inputField').val($('#row_' + i + '_attbutton1_specValue').attr('value'));
		$('#row_' + i + '_attbutton2_specValue_inputField').val($('#row_' + i + '_attbutton2_specValue').attr('value'));

		//reinitialise the tooltips
		$('#row_' + i + '_attButton1').tooltip({delay: 50});
		$('#row_' + i + '_attButton2').tooltip({delay: 50});
	}
}

function saveJumpConditions()
{
	var new_condition_array = [];

	var html_list = $('#jumpConditionList li');

	for (var i = 0; i < html_list.size(); i++)
	{
		//store values of specific value's in data member "value"
		$('#row_' + i + '_attbutton1_specValue').attr('value', $('#row_' + i + '_attbutton1_specValue_inputField').val());
		$('#row_' + i + '_attbutton2_specValue').attr('value', $('#row_' + i + '_attbutton2_specValue_inputField').val());

		new_condition_array.push(html_list[i].outerHTML);
	}

	//store in jump node
	cy.$(':selected')[0].data('conditions', new_condition_array)
}

function addJumpCondition()
{
	var x = parseInt($('#jumpConditionList li').size());
	generic_addRow('row_' + x + '_','jump-settings-menu','jumpConditionList')
}

function loadJumpButton()
{
	var button = cy.$(':selected')[0].data('button');


}

function saveJumpButton()
{

}

function createNewJumpButton()
{
	//give the button a name
		//myModal.prompt
	//add the button to a stored list of buttons
		
}

function chooseJumpButton()
{
	//cy.$(':selected')[0].data('button', )
	selected_page_template = project_project.project_templates[sel];
	$('.pagemode').html("Page Node (" + sel + ")")
}

$('#choosejumptrigger').on('change', function(event)
{
	var type = $('#choosejumptrigger :checked').attr('value');
	setJumpNodeType(type);
});

$.contextMenu({
	selector: ".jump-settings-menu",
 	trigger: 'left',
	build: function($trigger) {
		return {
			"items":
			{
				"Remove Condition":
				{
					"name": "Remove Condition", "callback": function(key, options)
					{
						console.log("Element is ~~~~~~~~~~~", options.$trigger.closest("li"));
						options.$trigger.closest("li").remove();
					}
				},
			}
		}
	}
});

