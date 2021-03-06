/*
	Name: playGame
	Created By: Danielle
	Purpose: to enable playthrough of a game
*/

goog.provide('playGame')
goog.require('initCanvas') //for cytoscape functions like outgoers
goog.require('generalOverlay') //for escapehtml
goog.require('playConditions')
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

function prepareForPlayGame()
{
	console.log("prepare for game called")
	loadingScreen(project_project.audio.changed);

	initJumpNodes();

	//clear page
	$('.playpage').html('');

	//consider case where someone creates pages without opening the page style overlay, in which case no style is assigned
	//will probably be an empty page i.e. no html

	//preload all the audio assets
	//clear assets
	$('#playwindow #audioplayerlist').html('');


	var audio_assets = project_project.audio.getAsset();
	for (var i = 0; i < audio_assets.length; i++)
	{
		audio_assets[i].loadAudio();
	}

	event_manager = new eventManager();
	currentNode = null;
	outgoingEdges = null;

}

function prepareForGame()
{
	console.log("prepare for game called")
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

	$.each( project_project['gameAttributes'], function( key, value ) {
		gameAttributes_recursiveResetAllAttributes(value.id);
	});

	$.each( project_project['gameInventory'], function( key, item ) {
		item.playCount = item.initCount;
	});



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
	console.log("Parse node ", currentNode.data('name'));

	outgoingEdges = currentNode.outgoers().edges();

	if (currentNode.hasClass('page'))
	{
		parsePage(outgoingEdges);
	}
	else if (currentNode.hasClass('control'))
	{
		parseControl(currentNode, outgoingEdges);
	}
	else if (currentNode.hasClass('jumpend'))
	{
		console.log("Parse a jump end node")
		currentNode = runJumpEnd(currentNode);
		parseNode();
	}
}

function parsePage(outgoingEdges)
{
	event_manager.clearTimer();
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
	var button_cont = currentNode.data('specialbuttons');
	var output_cont = currentNode.data('outputcontainer');
	var events_list = currentNode.data('events');
	var debug_cont = currentNode.data('debugcontainer');

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

	for (var i = 0; i < button_cont.length; i++)
	{
		$('.playpage').append(button_cont[i].html);
	}

	for (var i = 0; i < dec_cont.length; i++)
	{
		// we will need to check visibility conditions when deciding to add a decision container to a page
		if(assessEdge(currentNode.outgoers("[name='" + dec_cont[i].name + "']").id()))
		{
			var button = $('.playpage').append(dec_cont[i].html);

		}
		else{
		}
	}

	//don't show debug output in published games
	$('.playpage').append(output_cont);
	if (window.location.href !== host_create())
		$('.playpage').append(debug_cont);

	//append output container data based on maker or player mode
	$('.player').children().append(logger.playerOutput())
	$('.maker').children().append(logger.makerOutput())

	$('.playpage').find("div[class^='decision-container']").each(function(index)
	{
		$(this).click(function()
		{
			name = $(this).attr('edgename');

			edge_id = outgoingEdges.filter("[name=\""+ name + "\"]").data('id');
			console.log("Button name is: ", name);
			console.log("Edge is: ", edge_id);
			var index = getIndexFromOutgoingEdges(edge_id, outgoingEdges)
			console.log("Index is: ", index);
			progressStory(index);
		})
	});



	var playerInventory = new PlayerInventory();
	playerInventory.init();
	function PlayerInventory(){

		this.init = function(){
			$("body").append('<div id="player-inventory-modal" class="modal" style="height: 90%"> <div style="height: 90%" class="modal-content"> <h4>Your Inventory</h4> <div class="row max-height scroll-y" id="item-list-container" > <ul id="player-items-list" class="collapsible"  data-collapsible="expandable"></ul> </div></div></div>');
		};



		this.appendItems = function() {

			var itemCount = 0;
			for(var itemId in project_project['gameInventory']){
				var itemObj = project_project['gameInventory'][itemId];

				$('#player-items-list').empty();
				if(itemObj.playCount > 0){
					itemCount++;
					$('#player-items-list').append(''
						+ '<li>'
						+ '<div class="collapsible-header"><span class="' + itemId + '-name">' + itemObj.name + '</span></div>'
						+ '<div class="collapsible-body">'
						+ '<div class="row pos-relative ">'
						+ '<div class="col m6"><h6><i class="material-icons small">subject</i>Description: </h6><hr/><p class="' + itemId + '-description">' + itemObj.description + '</p></div>'
						+ '<div class="col m6"><h6><i class="material-icons small">stars</i>Modifiers: </h6><hr/> <div class="' + itemId + '-modifiers-list"></div> </div> </div><hr/>'
						+ '<div class="row" style="margin-bottom: 5px">'
						+ '<div class="col m4"> Item Count: <span style="font-weight: bold">'+itemObj.playCount+'</span></div>'
						+ '</div>'
						+ '</div>'
						+ '</li>'
					);
					var displayModifiers = $('.' + itemId + '-modifiers-list');
					var modifierObj = {};
					for (var modID in project_project.gameInventory[itemId].modifiers) {
						modifierObj = project_project.gameInventory[itemId].modifiers[modID];

						displayModifiers.append('<div class="chip">' + gameAttributes_find(modifierObj.attributePath).name + '+' + modifierObj.modifierValue + '</div>');
					}

				}


			}

			if(itemCount == 0)
			{	console.log("no items in inventory");
				$('#item-list-container').append('<h5> You Have No Items Yet</h5>');
			}

			$('#player-items-list').collapsible({
				accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
			});

		};

		this.openInventory = function(){

			$('#player-inventory-modal').openModal({
				dismissible: true,
				ready: function(){
				},
				complete: function(){
					$('#player-items-list').empty();
				}
			});
		}

	}







	//give inventory on click behaviour
	$('.playpage').find("div[class^='inventory']").each(function(index)
	{
		$(this).click(function()
		{
			console.log("Open inventory");
			playerInventory.appendItems();
			playerInventory.openInventory();


		})
	});

	var playerSheet = new PlayerSheet();
	playerSheet.init();
	function PlayerSheet() {

		this.init = function () {
			$("body").append('<div id="player-sheet-modal" class="modal" style="height: 90%"> <div style="height: 90%" class="modal-content"> <h4>Your Attributes</h4> <div class="row max-height scroll-y" id="atttributes-list-container" > <ul id="player-attributes-list" class="collapsible"  data-collapsible="expandable"></ul> </div></div></div>');

			$('#player-attributes-list').collapsible({
				accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
			});


		};


		this.recursiveAppendAttributes = function(attributeObj){

			if(attributeObj.is_leaf) {
				$('#player-attributes-list').append(''
					+ '<li>'
					+ '<div class="collapsible-header" style="position: relative"><span>' + attributeObj.name + ' : </span>  <span style="font-weight: bold; font-size:18px; position: absolute; right: 15px;">'+attributeObj.value+'</span></div>'
					+ '<div class="collapsible-body">'
					+ '<div class="row pos-relative ">'
					+ '<div class="col m6 offset-m3"><h6><i class="material-icons small">subject</i>Description: </h6><hr/><p class="' + attributeObj.description + '-description">' + attributeObj.description + '</p></div>'
					+ '</div>'
					+ '</li>'

				);

			}else {

				for (var attID in attributeObj.childrenArray) {
					var next = gameAttributes_find(attributeObj.path + '_' + attributeObj.childrenArray[attID]);
					this.recursiveAppendAttributes(next);
				}
			}

		};


		this.appendItems = function () {

			var attObj = gameAttributes_find('PLAYER');

			for(var attID in attObj.childrenArray)
				this.recursiveAppendAttributes(gameAttributes_find(attObj.path + '_' +attObj.childrenArray[attID]))

		};


		this.openPlayerSheet = function(){
			$('#player-attributes-list').empty();
			this.appendItems();

			$('#player-sheet-modal').openModal({
				dismissible: true,
				ready: function(){
				},
				complete: function(){
					$('#player-attributes-list').empty();
				}
			});

		}

	}
	//give character on click behaviour
	$('.playpage').find("div[class^='character']").each(function(index)
	{
		$(this).click(function()
		{
			console.log("Open Character Sheet");
			playerSheet.openPlayerSheet();


		})
	});
	//give jump buttons on click behaviour
	$('.playpage').find("div[class^='jump']").each(function(index)
	{
		$(this).click(function()
		{
			button_name = $(this).attr('jumpnode');
			console.log("Button name is: ", button_name);
			//find jump nodes that have this button
			jump_node = cy.$('.jump[button ="' + button_name + '"]')[0];

			console.log("Jump node is: ", jump_node);
			if (jump_node === undefined)
			{
				console.log("Jump_node is undefined?")
			}
			else
			{
				//save the current node so we can get back to it later
				jump_node.data('origin', currentNode);
				//returns the target (e.g. a page) of the jump node
				currentNode = runJumpNode(jump_node);
				console.log("We jumped!");
				parseNode();
			}
		})
	});
	//give jump back buttons on click behaviour
	$('.playpage').find("div[class^='jumpback']").each(function(index)
	{
		$(this).click(function()
		{
			console.log("Go back from jump node");
			currentNode = runJumpEnd(currentNode);
			parseNode();
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

function progressStoryViaButton(target)
{

}

function progressStory(i)
{
	if (currentNode === null) //very first page
	{
		if (cy.$('*').length < 1)
		{
			alert("The project is empty")
		}
		else
		{
			$('.progressbutton').hide();
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
			//returns the target (e.g. a page) of the jump node
			currentNode = runJumpNode(jump_node);
			console.log("We jumped!");
		}

		parseNode();
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
	var buffer = $('.nav-wrapper').outerHeight() + $('.progressbutton:visible').outerHeight() + $('.gobackbutton:visible').outerHeight() + 15;

	$('#playwindow').css('height', y-buffer);

	var w = $('#playwindow').width();
	var h = $('#playwindow').height();
	var inner_w = $('.playpage').width();
	var inner_h = $('.playpage').outerHeight();

	scale = Math.min(w/inner_w, h/inner_h);

	$('.playpage').css({'transform': 'scale(' + scale + ')'});
	$('.playpage').css({'-ms-transform': 'scale(' + scale + ')'});
	$('.playpage').css({'-webkit-transform': 'scale(' + scale + ')'});

	//now figure out how to center via translation since we scaled it

	//getBoundClientRect gets actual dimensions of scaled .playpage
	var translate_x = ($('#playwindow').width() - $('.playpage')[0].getBoundingClientRect().width) / 2;
	var translate_y = ($('#playwindow').height() - $('.playpage')[0].getBoundingClientRect().height) / 2;

	$('.playpage').css({'transform': 'translate(' + translate_x + 'px,' + translate_y + 'px) scale(' + scale + ')'});
	$('.playpage').css({'-ms-transform': 'translate(' + translate_x + 'px,' + translate_y + 'px) scale(' + scale + ')'});
	$('.playpage').css({'-webkit-transform': 'translate(' + translate_x + 'px,' + translate_y + 'px) scale(' + scale + ')'});
}

$(window).resize(resizePlayPage);
