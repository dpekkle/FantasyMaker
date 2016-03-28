goog.provide('ui')
goog.require('initCanvas')

//little state enum for the current state the UI is in
states = {
	DEFAULT: 0,
	CONNECTING: 1, //i.e. connecting two nodes with an edge
	NEWPAGE: 2, // adding a new page node
	NEWDECISION: 3, // adding a new decision node
};

current_state = states.DEFAULT;

/*
//this function shows us which button is currently active
$("#sidebar .button").click( function(event){
	$('.button').removeClass('activebutton')
	$(event.target).addClass('activebutton')
})*/

function changeState(caller)
{
	$("#sidebar .button").removeClass('activebutton')
	$(caller).addClass('activebutton')
	
	if ($(caller).hasClass('connectionmode') && current_state != states.CONNECTING)
	{
		current_state = states.CONNECTING;	
		source_node = cy.$(':selected');
	}
	else if ($(caller).hasClass('pagemode') && current_state != states.NEWPAGE)
	{
		current_state = states.NEWPAGE;
	}
	else if ($(caller).hasClass('decisionmode') && current_state != states.NEWDECISION)
	{
		current_state = states.NEWDECISION;
	}	
	else
	{
		console.log("Deselect button");
		current_state = states.DEFAULT;
		$(caller).removeClass('activebutton');
	}
}

$("#pagetext").on('input', function(event) //fires an event when the ui textarea is updated
{
	var text = this.value;
	cy.$(':selected').data('text', text);
	
	console.log("For element ", cy.$(':selected').data('id'), "apply", this.value, " Now holds: ", cy.$(':selected').data('text'));
	
})