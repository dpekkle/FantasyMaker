goog.provide('events')

var selected_event = null;

function deleteEvent()
{
	if (selected_event != null)
		$(selected_event).remove();
}

function eventManager()
{
	this.page_time = 0;
	this.playPageEvents = function(events_list){
		for (var i = 0; i < events_list.length; i++)
		{
			console.log(events_list[i].id, events_list[i].eventtype)
		}
	}

	this.tick = setInterval(function(){ this.pageTime++ }, 1000);

	this.newPage = function(){
		this.page_time = 0;
	}
}
