goog.require('initCanvas')
goog.provide('playGame')

currentPage = null;
outgoingEdges;

function parsePage()
{
	console.log("Parse page ", currentPage.data('id'));
	
	outgoingEdges = currentPage.outgoers().edges();
	
	if (currentPage.hasClass('page'))
	{
		//get the page's styleSheets
		//update the HTML to have the right containers to display everything
		
		$('#PageText').html(escapeHtml(currentPage.data('text')));
		console.log(currentPage.data('text')); 
		
		if (outgoingEdges.size() > 0)
		{
			$('#Decision').html(escapeHtml(outgoingEdges.eq(0).data('text'))); //need to display for each decision
			console.log(outgoingEdges.eq(0).data('text'));
			//bind decision clicks to determine where to go next
		}
	}
}

function progressStory()
{
	if (currentPage === null) //very first page
	{
		currentPage = cy.$('.start')[0];
		parsePage();
	}	
	else if (currentPage.outgoers().size() > 0)
	{
		currentPage = outgoingEdges.eq(0).target(); //should pick the correct decision, this only works for one.
		console.log("Now on page ", currentPage.data('id'));
		parsePage();	
	}
}

//We don't want users entering HTML within their text.
//For example, <hello!> would create a html tag rather than display that as a string
function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};
