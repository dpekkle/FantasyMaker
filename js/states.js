goog.provide('states')

//little state enum for the current state the UI is in
states = {
	DEFAULT: 0,
	CONNECTING: 1, //i.e. connecting two nodes with an edge
	NEWPAGE: 2, // adding a new page node
	NEWCONTROL: 3, // adding a new control node
};

current_state = states.DEFAULT;

//triggered when a button to interact with the canvas is pressed
function changeState(caller)
{
	$("#sidebar .button").removeClass('activebutton')
	$(caller).addClass('activebutton')
	
	if ($(caller).hasClass('connectionmode') && current_state != states.CONNECTING)
	{
		current_state = states.CONNECTING;	
		source_node = null;
	}
	else if ($(caller).hasClass('pagemode') && current_state != states.NEWPAGE)
	{
		current_state = states.NEWPAGE;
	}
	else if ($(caller).hasClass('controlmode') && current_state != states.NEWCONTROL)
	{
		current_state = states.NEWCONTROL;
	}	
	else if ($(caller).hasClass('deletebutton') && current_state != states.DEFAULT)
	{
		// even though there isn't a "deleting state" deletion should trigger a reversion to default state,
		// things get weird if you delete a node then try to form an edge using it
		removeNode();
		setDefaultState(caller);
	}
	else
	{
		setDefaultState(caller);
	}
}

function setDefaultState(caller)
{
	source_node = null;		
	current_state = states.DEFAULT;	
	$(caller).removeClass('activebutton');
}