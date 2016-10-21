goog.provide('states')

//little state enum for the current state the UI is in
states = {
	DEFAULT: 0,
	CONNECTING: 1, //i.e. connecting two nodes with an edge
	NEWPAGE: 2, // adding a new page node
	NEWCONTROL: 3, // adding a new control node
	NEWJUMP: 4,
	NEWJUMPEND: 5,
	NEWEMPTY: 6,
	NEWFIGHT: 7,
};

current_state = states.DEFAULT;

function defaultState()
{
	exitStates()
	current_state = states.DEFAULT;
}

//function to run when leaving a state
function exitStates()
{
	if (current_state == states.CONNECTING)
	{
		cy.boxSelectionEnabled( true );
		if (source_node !== null)
		{
			source_node.removeClass("source_node"); //remove the style associated with source nodes	
			source_node = null;		
		}
	}	
	$("#sidebar .btn").removeClass('activebutton')	
	$('.pagemode').html("Page Node");
	cy.$(':parent').selectify();

}

//triggered when a button to interact with the canvas is pressed
function changeState(caller)
{
	exitStates();
	$(caller).addClass('activebutton');
	
	if ($(caller).hasClass('connectionmode') && current_state != states.CONNECTING)
	{
		current_state = states.CONNECTING;
		console.log("changestate unselect");
		cy.$(':selected').unselect();
		cy.$(':parent').unselectify();
		cy.boxSelectionEnabled( false ); //dont want to select multiple nodes when connecting	
		source_node = null;
	}
	else if ($(caller).hasClass('pagemode') && current_state != states.NEWPAGE)
	{
		exitStates(); //we only want clicking the list element to actually change the state
	}
	else if ($(caller).hasClass('controlmode') && current_state != states.NEWCONTROL)
	{
		current_state = states.NEWCONTROL;
	}	
	else if ($(caller).hasClass('jumpmode')  && current_state != states.NEWJUMP != states.NEWJUMP)
	{
		current_state = states.NEWJUMP;
	}	
	else if ($(caller).hasClass('jumpmode')  && current_state != states.NEWJUMP && current_state != states.NEWJUMPEND)
	{
		exitStates();
	}	
	else if ($(caller).hasClass('prebuilt')  && current_state != states.NEWFIGHT && current_state != states.NEWSTORE && current_state != states.NEWEMPTY)
	{
		exitStates();
	}	
	else if ($(caller).hasClass('deletebutton'))
	{
		// even though there isn't a "deleting state" deletion should trigger a reversion to default state,
		// things get weird if you delete a node then try to form an edge using it
		removeElement();
		current_state = states.DEFAULT;	
		//delete is not a state, so button doesn't need to stay active
		$(caller).removeClass('activebutton');
	}
	else
	{
		current_state = states.DEFAULT;	
		$(caller).removeClass('activebutton');
	}
}

function choosePrebuilt(prebuilt)
{	
	$('.prebuilt').addClass('activebutton');

	if (prebuilt == "Empty")
	{
		current_state = states.NEWEMPTY;
	}
	else if (prebuilt == "Fight")
	{
		current_state = states.NEWFIGHT;
	}
}

function chooseJump(mode)
{	
	$('.jumpmode').addClass('activebutton');

	if (mode == "Start")
	{
		current_state = states.NEWJUMP;
	}

	else if (mode == "End")
	{
		current_state = states.NEWJUMPEND;
	}
}