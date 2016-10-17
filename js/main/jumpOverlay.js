goog.provide('jumpOverlay')


function populateJumpOverlay(element)
{
	chooseJumpNodeType(element);
}

function saveJump()
{

}

function chooseJumpNodeType(element)
{
	var jump_node_type = element.data('trigger')
	if (jump_node_type == "none")
	{
		$('#check, #button').hide();
	}
	else if (jump_node_type == "check")
	{
		$('#button').hide();
		$('#check').show();
	}
	else if (jump_node_type == "button")
	{
		$('#button').show();
		$('#check').hide();
	}
}