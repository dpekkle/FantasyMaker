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

	//consider case where someone creates pages without opening the page style overlay, in which case no style is assigned
	//will probably be an empty page i.e. no html
	
	var eles = cy.elements();
	for (var i = 0; i < eles.length; i++)
	{
		updatePageStyle(eles[i]);
	}
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
	
	//create text containers
	var text_cont = currentNode.data('textcontainers');
	var dec_cont = currentNode.data('decisioncontainers');
	var img_cont = currentNode.data('imgcontainers');
	
	for (var i = 0; i < text_cont.length; i++)
	{
		$('.playpage').append(text_cont[i].html);
	}
	
	for (var i = 0; i < img_cont.length; i++)
	{
		$('.playpage').append(img_cont[i].html);
	}
		
	for (var i = 0; i < dec_cont.length; i++)
	{
		// we will need to check visibility conditions when deciding to add a decision container to a page 
		$('.playpage').append(dec_cont[i].html);
	}

	//give decisions on click behaviour
	$('.playpage').children("div[id^='decision-container']").each(function(index)	
	{
		$(this).click(function()
		{
			progressStory(index);
		})
	});
	
	//make content read-only
	$(".playpage .handle").hide(); // can't drag without a handle
	
	$(".playpage").children().removeClass('resize-element');
	$(".playpage").children().children().removeClass('resize-element');

	$(".playpage").children().attr('contenteditable','false');
	$(".playpage").children().children().attr('contenteditable','false');

}

function parseControl(outgoingEdges)
{
	//handle control stuff
	//Todo - Check Inventory Items & Attributes 
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
		currentNode = outgoingEdges.eq(i).target(); 
		//need to run edge outcomes here
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


