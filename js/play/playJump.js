goog.provide('playJump')
goog.require('playConditions')

function initJumpNodes()
{
	//list of all jump nodes
	conditional_jump_nodes = cy.nodes('.jump[triggerType = "attribute"]');

	//a stack that contains all "activated" jump nodes
	jump_context_stack = [];

}

function checkConditionalJumps()
{
	var jump_node = false;

	conditional_jump_nodes.forEach(function(ele)
	{
		if (evaluateConditionalJump(ele))
		{
			//condition is met
			jump_node = ele;
			return false //breakloop 
		}
	});

	return jump_node;
}

function evaluateConditionalJump(ele)
{
	console.log("Call evaluateConditionalJump for ", ele.data('name'))
	var conditions = ele.json().data.conditions

	if(conditions.length > 0)
	{
		var ret = true
		for(var i = 0; i<conditions.length; i++)
		{ //for all conditions in jump node
			var result = assessJumpCondition(conditions[i])

			if(result === false){
				ret = false
			}
		}
		return ret
	}
	else
	{
		console.log('Jump node' + ele.data('name') + ' has no conditions')
		return true
	}
}

function assessJumpCondition(condition)
{
	console.log("Assess jump node condition")
	var html = $.parseHTML(condition)
	var attButton1_val = getAttributeValue(html[0].childNodes[0].childNodes[1].childNodes[0]);
	var comparison = html[0].childNodes[0].childNodes[2].childNodes[0].data;
	var attButton2_val = getAttributeValue(html[0].childNodes[0].childNodes[3].childNodes[0])

	var ret = assessComparison(attButton1_val,comparison,attButton2_val)

	console.log(attButton1_val,comparison,attButton2_val, "is: ", ret);
	return ret
}

function runJumpNode(element)
{
	jump_context_stack.push(element);
	console.log("The jump node " + element.data('name') + " is now officially jumped to")
}

