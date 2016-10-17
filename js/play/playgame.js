goog.require('initCanvas') //for cytoscape functions like outgoers
goog.require('generalOverlay') //for escapehtml
goog.require('playConditions')
goog.provide('playGame')
goog.require('project')
goog.require('audio')
goog.require('events')
goog.require('logger')
goog.require('playJump')


function loadingScreen(more_to_load)
{
	if (!more_to_load)
	{
		//all the audio is loaded, allow player to continue
		$('#loader').hide();
		$('.progressbutton').show();

	}
	else
	{
		$('#loader').show();
		$('.progressbutton').hide();
	}

}

function prepareForGame()
{
	loadingScreen(project_project.audio.changed);

	event_manager = new eventManager();
	currentNode = null;
	outgoingEdges = null;

	initJumpNodes();

	//clear page
	$('.playpage').html('');

	//consider case where someone creates pages without opening the page style overlay, in which case no style is assigned
	//will probably be an empty page i.e. no html

	var eles = cy.elements('.page');
	for (var i = 0; i < eles.length; i++)
	{
		updatePageStyle(eles[i]);
	}

	//preload all the audio assets
	if (project_project.audio.changed)
	{
		//clear assets
		$('#playwindow #audioplayerlist').html('');


		var audio_assets = project_project.audio.getAsset();
		for (var i = 0; i < audio_assets.length; i++)
		{
			audio_assets[i].loadAudio();
		}

		project_project.audio.changed = false;
	}
}

function wipeGame()
{
	project_project.audio.loaded = 0;

	//@RUSSEL set all attributes/inventory items to their initial values

	//remove "origins" for all jump nodes
	cy.$('.jump').each(function(i, ele){
		ele.data('origin', null);
	});
	jump_context_stack = [];
	
	//reset all audio
	for (var i = 0; i < project_project.audio.getAsset().length; i++)
	{
		project_project.audio.assets[i].setVolume(100);
		project_project.audio.assets[i].stopAudio();
	}

	//clear page
	$('.playpage').html('');
	$('.playpage').attr('style', '');
	event_manager.clearTimer();
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
		parseControl(currentNode, outgoingEdges);
	}
}

function parsePage(outgoingEdges)
{
	event_manager.newPage(currentNode.data('events'));
	stylePage();
}

function stylePage()
{
	//clear page
	$('.playpage').html('');
	$('.playpage').attr("style", currentNode.data('pagestyle'));
	resizePlayPage();
	//load page data
	var text_cont = currentNode.data('textcontainers');
	var dec_cont = currentNode.data('decisioncontainers');
	var img_cont = currentNode.data('imgcontainers');
	var vid_cont = currentNode.data('vidcontainers');
	var output_cont = currentNode.data('outputcontainer');
	var events_list = currentNode.data('events');

	//create text containers
	for (var i = 0; i < text_cont.length; i++)
	{
		$('.playpage').append(text_cont[i].html);
	}

	for (var i = 0; i < img_cont.length; i++)
	{
		$('.playpage').append(img_cont[i].html);
	}

	for (var i = 0; i < vid_cont.length; i++)
	{
		$('.playpage').append(vid_cont[i].html);
	}

	for (var i = 0; i < dec_cont.length; i++)
	{
		// we will need to check visibility conditions when deciding to add a decision container to a page
		//alert('there are ' + dec_cont.length + 'decisions')
		if(assessEdge(currentNode.outgoers("[name='" + dec_cont[i].name + "']").id())){
			//alert('edge is true, adding decision button')
			$('.playpage').append(dec_cont[i].html);
		}
		else{
			//alert('edge is false, removing decision button')
		}

	}

	$('.playpage').append(output_cont);

	//append output container data based on maker or player mode
	if($('.output-container').hasClass('player')){
		$('.output-container').children().append(logger.playerOutput())
	}
	else if($('.output-container').hasClass('maker')){
		$('.output-container').children().append(logger.makerOutput())
	}
	//logger.flush()


	//give decisions on click behaviour
	$('.playpage').children("div[class^='decision-container']").each(function(index)
	{
		$(this).click(function()
		{
			progressStory(index);
		})
	});

	//make content read-only
	$(".playpage .handlecontainer").hide(); // can't drag without a handle

	$(".playpage").children().removeClass('resize-element');
	$(".playpage").children().removeClass('resize-child'); //for youtube videos
	$(".playpage").children().children().removeClass('resize-element');

	$(".playpage").children().attr('contenteditable','false');
	$(".playpage").children().children().attr('contenteditable','false');
}

function progressStory(i)
{
	if (currentNode === null) //very first page
	{
		if (cy.$('*').length < 1)
		{
			alert("Your graph is empty")
		}
		else
		{
			currentNode = cy.$('.start')[0];
			parseNode();
		}
	}
	else if (currentNode.outgoers().size() > 0)
	{
		currentNode = outgoingEdges.eq(i).target();
		//need to run edge outcomes here
		executeOutcomes(outgoingEdges.eq(i))
		console.log("Now on node ", currentNode.data('id'));

		var jump_node = checkConditionalJumps();
		if (jump_node)
		{
			//save the current node so we can get back to it later
			jump_node.data('origin', currentNode);
			runJumpNode(jump_node);
		}
		else
		{
			parseNode();
		}
	}
	else
	{
		currentNode = null;
		console.log("Reached the end")
		$('.playpage').html('<h1>Fin!</h1>');
		wipeGame();
	}
	logger.flush()
}

function stripDraggable(str)
{
	var newstr = str.replace(/drag-element/g, "");
	return newstr;
}

function resizePlayPage()
{
	$('.playpage').width(project_project.resolution.x);
	$('.playpage').height(project_project.resolution.y);
	var scale;


	var y = $(window).height();		//want total height of the page
	var buffer = $('#tabheadings').outerHeight() + $('.nav-wrapper').outerHeight() + $('.progressbutton').outerHeight();

	$('#playwindow').css('height', y-buffer); //tabs at top are 42;

	var w = $('#playwindow').width();
	var h = $('#playwindow').height();
	var inner_w = $('.playpage').width();
	var inner_h = $('.playpage').outerHeight();

	scale = Math.min(w/inner_w, h/inner_h);

	$('.playpage').css({'transform': 'scale(' + scale + ')'});
	$('.playpage').css({'-ms-transform': 'scale(' + scale + ')'});
	$('.playpage').css({'-webkit-transform': 'scale(' + scale + ')'});

}

$(window).resize(resizePlayPage);
