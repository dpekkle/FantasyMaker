goog.require('events')
goog.provide('audio')



function audioAsset(name, id, link, type)
{
	this.name = name;
	this.id = id;
	this.type = type;
	this.link = link;
	this.player = null;

	this.loadAudio = function()
	{
		if (this.type == "youtube")
		{
			var youtubeid_reg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
			var youtubeid = this.link.match(youtubeid_reg)
			this.createYoutubePlayer(youtubeid[1]);
			console.log("youtube audio loaded with ID: ", youtubeid[1])
		}
		else if (this.type == "mp3")
		{
			return "Some other HTML string!"
		}
		else
		{
			alert("You shouldn't be here...")
		}
	}

	this.playAudio = function()
	{
		if (this.type == "youtube")
		{
		    this.player.playVideo();
		}
	}

	this.setVolume = function(value)
	{
		if (this.type == "youtube")
		{
			this.player.setVolume(value)
		}
	}
	this.stopAudio = function()
	{
		if (this.type == "youtube")
		{
		    this.player.stopVideo();
		}
	}

	this.createYoutubePlayer = function(videoId)
	{
		$('#playwindow #audioplayerlist').append("<div id = '" + "youtube" + this.id + "'></div>");

		this.player = new YT.Player('youtube' + this.id, {
		  origin: 'https://www.youtube.com',
		  height: '0',
		  width: '0',
		  // playerVars: { 'autoplay': 1, 'controls': 0 }, //not needed with playVideo call
		  videoId: videoId,
		  events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange,
			'onError': onPlayerError,
		  }
		});			
		// video
		function onPlayerReady(event) 
		{
			console.log("Player ready", project_project.audio.loaded++);
			if (project_project.audio.loaded == project_project.audio.assets.length)
			{
				loadingScreen(false);
			}
		}

		// when video ends
		function onPlayerStateChange(event) 
		{ 
			if(event.data === -1)
			{
				console.log('youtube video not started');
			}
			if(event.data === 5)
			{
				console.log('youtube video queued');
			}       
			if(event.data === 1)
			{
				console.log('now playing');
			}       
		    if(event.data === 0) //video ended
		    {
		    	console.log("Video ended")
		    }
		}

		function onPlayerError(event) 
		{
			alert("Youtube audio playback encountered error: ", event.data, ". Embedding of this link: " + videoId + " may be disabled by the owner.")
			this.player.destroy(); 
	    	console.log("Destroying player");
		}
	}

	this.addEvent = function()
	{
		//add it to the page container's list of events
		$('#eventspane').append("<div id = '" + this.id + "' class='audioevent eventscontainer'><span class = 'eventname flex-center-vertically'>" + this.name + "</span>"
								+ "<span class = 'eventtype flex-center-vertically'><select>"
								+ "<option value='Play'>Play</option><option value='Stop'>Stop</option><option value='Volume'>Volume</option></select><input class='setting' type='number' min = 0 max = 100 value = 100></span>" 
								+ "<span class = 'eventtrigger'><input type='number' min = 0 value = 0></span></div>");
			
		this.eventListBehaviour();
		$('.eventscontainer').last().find('select').material_select();	
	}

	this.eventListBehaviour = function()
	{
		var added_event = $('.eventscontainer').last();

		//dynamic events
		added_event.find('.eventtype').on('change', 'select', function(event){
			if ($(this).val() == "Volume")
			{
				$(this).parent().siblings('.setting').show();
			}
			else
			{
				$(this).parent().siblings('.setting').hide();
			}
		});

		added_event.on('click', '.eventname', function(event) {
			event.preventDefault();

			$('.eventscontainer').removeClass('highlighted');
			$(this).parent().toggleClass('highlighted');
			selected_event = $(this).parent();
			console.log(selected_event)
		});
	}
}

function audioObj()
{
	this.selected_audio = null;
	this.unique_id = 0; //used for unique ids, different to array length
	this.assets = [];
	this.loaded = 0;
	this.changed = true;

	this.getAssetAsModalList = function(id)
	{
		var htmlstring = "";
		if (id != undefined)
		{
			var entry = this.assets[id];
			htmlstring += "<li id='" + entry.id + "''>" + entry.name + "<br>" + entry.link + "</li>"
			return htmlstring
		}
		else
		{
			for (var i = 0; i < this.assets.length; i++)
			{
				var entry = this.assets[i];
				htmlstring += "<li id='" + entry.id + "''>Name: " + entry.name + "<br>Link: " + entry.link + "</li>"
			}		
		}
		return htmlstring;
	}

	this.getAssetAsMenu = function()
	{
		assetlist = {}
		console.log("Generate audio menu of length: ", this.assets.length)

		for (var i = 0; i < this.assets.length; i++)
		{
			assetlist[i] = {
				"name": this.assets[i].name,
				"id": this.assets[i].id,
				"callback": function(key, options){
					project_project.audio.assets[key].addEvent();
				}
			}
		}
		return assetlist;
	}
	this.getAsset = function(id)
	{
		//get an asset by the value of it's id (not necessarily the same as it's index)
		if (id !== undefined) 
		{
			var id_int = parseInt(id);
			if (id_int >= 0)
			{
				return this.assets.find(x=> x.id === id_int);
			}
			return false;
		}
		else
			return this.assets;
	}

	this.removeAsset = function()
	{
		this.changed = true;
		if (this.selected_audio != null)
		{
			var ele = this.getAsset(this.selected_audio)	
			this.assets.splice(this.assets.indexOf(ele), 1);
			$('#audiolist').find('#' + this.selected_audio).remove();
		}
	}

	this.addAssetButton = function()
	{
		var link = prompt("Enter youtube link");
		if (link == null){
			console.log("Link cannot be empty")
			return;
		}
		var name = prompt("Give audio a name");
		if (name == null){
			console.log("Name cannot be empty")
			return;
		}
		this.addAsset(name, link);
		$('#audiolist li').on('click', function(event) {
			event.preventDefault();
			$('#audiolist li').removeClass('highlighted');
			$(this).toggleClass('highlighted');
			project_project.audio.selected_audio = $(this).attr('id');
		});

	}

	this.addAsset = function(name, link)
	{
		//parse URL for type
		var type = this.parseType(link);
		if (type != "error")
		{
			this.changed = true;
			this.assets[this.assets.length] = new audioAsset(name, this.unique_id, link, type);
			//add to dropdown list
			$('#audiolist').html('');
			$('#audiolist').append(this.getAssetAsModalList());
			this.unique_id++;

		}
		else
		{
			console.log("Failed to add asset")
		}
	}
	this.parseType = function(link)
	{
		//parse url
		var youtube_url = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
		if ((link.match(youtube_url)) ? RegExp.$1 : false)
		{
			return "youtube";
		}
		else 
			return "error";
	}
	this.addAudioEvent = function(id)
	{
		this.assets[id].addEvent();
	}
}

function loadAudioObject(loadobj)
{
	var object = new audioObj();

	object.selected_audio = loadobj.selected_audio;
	object.unique_id = 0; //used for unique ids, different to array length
	object.loaded = loadobj.loaded;
	object.changed = loadobj.changed;

	for (var i = 0; i < loadobj.assets.length; i++)
	{
		object.addAsset(loadobj.assets[i].name, loadobj.assets[i].link);
	}
	return object;
}