goog.provide('playJump')
goog.require('playConditions')

function initJumpNodes()
{
	//list of all -attribute- jump nodes
	conditional_jump_nodes = cy.nodes('.jump[triggerType = "attribute"]');

	//a stack that contains all "activated" jump nodes
	jump_context_stack = [];

}

function checkConditionalJumps()
{
	var jump_node = false;
	
	jump_context_collection = cy.collection(jump_context_stack)
	//don't consider nodes already on stack
	conditional_jump_nodes.difference(jump_context_collection).forEach(function(ele)
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
	//console.log("Call evaluateConditionalJump for ", ele.data('name'))
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
	var html = $.parseHTML(condition)
	var attButton1_val = getAttributeValue(html[0].childNodes[0].childNodes[0].childNodes[0]);
	var comparison = html[0].childNodes[0].childNodes[1].childNodes[0].data;
	var attButton2_val = getAttributeValue(html[0].childNodes[0].childNodes[2].childNodes[0])

	var ret = assessComparison(attButton1_val,comparison,attButton2_val)

	console.log(attButton1_val,comparison,attButton2_val, "is: ", ret);
	return ret
}

function runJumpNode(element)
{
	jump_context_stack.push(element);
	console.log("The jump node " + element.data('name') + " is now officially jumped to")

	//return the next 'current_node'
	var target = element.outgoers()[0].target();

	console.log("Target node is", target);
	return target;
}

function runJumpEnd()
{
	//return the origin node of the last jump-start we encountered
	//i.e. where we last were before exitting the graph and entering a jump section

	var jump_start = jump_context_stack.pop();
	var origin = (jump_start.data('origin'));
	if (jump_start.data('repeat') == 'once')
	{
		jump_context_stack.unshift(jump_start);
	}
	console.log("Reached jump end. Now Jump back to", origin.data('name'));
	return origin;
}

