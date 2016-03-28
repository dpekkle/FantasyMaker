goog.provide('ui')
goog.require('initCanvas')

function newConnection(button) //between two nodes
{
	current_state = states.CONNECTING;

	$('.linkbutton').css("background-color", "green");
	
	console.log("Make a new node")
	source_node = cy.$(':selected');
}


$("#pagetext").on('input', function(event) //fires an event when the ui textarea is updated
{
	var text = this.value;
	
	cy.$(':selected').data('text', text);
	
	console.log("For element ", cy.$(':selected').data('id'), "apply", this.value, " Now holds: ", cy.$(':selected').data('text'));
	
})