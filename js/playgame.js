goog.require('initCanvas') //for cytoscape functions like outgoers
goog.require('pageOverlay') //for escapehtml
goog.provide('playGame')


currentNode = null;
outgoingEdges = null;

function prepareForGame()
{
	currentNode = null;
	outgoingEdges = null;
	
	//clear page
	$('.playpage').html('');

	/*
	var eles = cy.elements();
	for (var i = 0; i < eles.length; i++)
	{
		showPageOverlay(eles[i]);
		closeOverlay(eles[i]);
	}*/
}


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
	//clear page
	$('.playpage').html('');
	
	//fill the text containers with appropriate data
	var text_cont = currentNode.data('textcontainers');
	
	for (var i = 0; i < text_cont.length; i++)
	{
		console.log("Add text container with contents: ", escapeHtml(text_cont[i].contents))
		$('.playpage').append(text_cont[i].html);
		$(".playpage #text-area"+i).val(escapeHtml(text_cont[i].contents));		
		
		//make the text areas read only
		$(".playpage #text-area"+i).prop("disabled", "true")
		$(".playpage #text-area"+i).css("resize", "none")
		
	}
	
	//make the text containers non draggable
	$('.playpage').children("div[id^='text-container']").each(function(index)
	{
		this.setAttribute('locked', '');
	});

	/*
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
	}*/
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

function stripDraggable(str)
{
	var newstr = str.replace(/drag-element/g, "");
	return newstr;
}


