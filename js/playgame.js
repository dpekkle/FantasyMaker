goog.require('initCanvas') //for cytoscape functions like outgoers
goog.require('pageOverlay') //for escapehtml
goog.provide('playGame')


currentNode = null;
outgoingEdges = null;

function parseNode()
{
	console.log("Parse node ", currentNode.data('id'));
	
	outgoingEdges = currentNode.outgoers().edges();
	
	if (currentNode.hasClass('page'))
	{
		parsePage(outgoingEdges);
	}
	else if (currentNode.hasClass('control'))
	{
		parseControl(outgoingEdges);
	}
}

function parsePage(outgoingEdges)
{	
	stylePage();
}

function stylePage()
{
	//update the HTML to have the right containers to display everything
	var styleHTML = currentNode.data('styleHTML');
	$('.playpage').html(styleHTML);
	
	//fill the containers with appropriate data
	if (styleHTML.includes('pagetext')) //do this for each potential type of element
	{
		$('.playpage #pagetext').html(escapeHtml(currentNode.data('text')));	
		console.log(currentNode.data('text')); 	
	}
	if (styleHTML.includes('decisionbutton'))
	{
		console.log("Let's bind buttons")
		$('.playpage').children('button').each(function(index)
		{
			console.log("Bound button, i = ", index);
			//bind decision button to a particular page
			$(this).click(function()
			{
				progressStory(index);
				//no need to update the decision button's text, as that's passed with currentNode.data('styleHTML');
			})
		});
		console.log("Decisions total: ", i);
	}
}

function parseControl(outgoingEdges)
{
	//handle control stuff
}

function progressStory(i)
{
	if (currentNode === null) //very first page
	{
		currentNode = cy.$('.start')[0];
		parseNode();
	}	
	else if (currentNode.outgoers().size() > 0)
	{
		currentNode = outgoingEdges.eq(i).target(); //should pick the correct decision, this only works for one.
		console.log("Now on node ", currentNode.data('id'));
		parseNode();	
	}
	else 
	{
		currentNode = null;
		$('.playpage').html("");
	}
}


