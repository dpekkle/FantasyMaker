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
	this.timerloop;
	this.event_queue = [];
	this.next_event;

	this.loadPageEvents = function(events_list)
	{
		this.event_queue = []; //clear event queue if a player skips through early
		
		for (var i = 0; i < events_list.length; i++)
		{
			console.log(events_list[i].id, events_list[i].eventtype)
			this.event_queue.push(events_list[i]);
		}
		console.log("Page events: ");
		console.log(this.event_queue);

		this.next_event = this.event_queue.shift();
		return events_list.length + 1;
	}

	this.checkEventTriggers = function()
	{
		if(typeof(this.next_event) === "undefined")
		{
			return 0;
		}
		//time trigger
		else if (this.next_event.trigger < this.page_time)
		{
			// run next event
			this.runEvent();
			this.next_event = this.event_queue.shift(); //dequeue
		}
		
		return 1;
	}
	this.runEvent = function()
	{
		var event = this.next_event;
		//audio events
		if (event.eventtype == "audioevent")
		{
			var audio_asset = project_project.audio.getAsset(event.id);
			if (event.action == "Play")
			{
				console.log("Play audio event: ", event.name);
				audio_asset.playAudio();
			}
			//pause?
			else if (event.action == "Volume")
			{
				if (event.setting < 0)
				{
					event.setting = 0
				}
				else if (event.setting > 100)
				{
					event.setting = 100
				}
				console.log("Modify Volume: ", event.setting)
				audio_asset.setVolume(event.setting);
			}	
			//fadeout stop alternative?
			else if (event.action == "Stop")
			{
				console.log("Stop audio event: ", event.name);
				audio_asset.stopAudio();
			}
		}
		else
			console.log("Trying to run an event, but don't know what eventtype it is! ", event.eventtype);
	}

	this.tick = function()
	{
		this.checkEventTriggers();
		this.timerloop = setInterval(function()
		{
			this.page_time++;
			if (this.checkEventTriggers() === 0)
			{
				clearInterval(this.timerloop)
				console.log("Clearing");
			}
		}.bind(this), 1000);
	}

	this.newPage = function(events_list)
	{
		if (this.loadPageEvents(events_list) !== 0) //nothing to run
		{
			this.tick();
		}
		this.page_time = 0;
	}
}
