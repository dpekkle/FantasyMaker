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

}

function saveJump()
{
	//save trigger type
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
		$('#row_' + i + '_attbutton1_specValue_inputField').val($('#row_' + i + '_attbutton1_specValue_inputField').attr('value'));
		$('#row_' + i + '_attbutton2_specValue_inputField').val($('#row_' + i + '_attbutton2_specValue_inputField').attr('value'));

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
		$('#row_' + i + '_attbutton1_specValue_inputField').attr('value', $('#row_' + i + '_attbutton1_specValue_inputField').val());
		$('#row_' + i + '_attbutton2_specValue_inputField').attr('value', $('#row_' + i + '_attbutton2_specValue_inputField').val());

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

$('#choosejumptrigger').on('change', function(event)
{
	var type = $('#choosejumptrigger :checked').attr('value');
	setJumpNodeType(type);
});