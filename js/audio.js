goog.require('events')
goog.provide('audio')



function audioAsset(name, id, link, type)
{
	this.name = "Audio " + id + ": " + name;
	this.id = id;
	this.type = type;
	this.link = link;
	this.loadAndPlayAudio = function()
	{
		if (this.type == "youtube")
		{
			var youtubeid_reg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
			var youtubeid = this.link.match(youtubeid_reg)
			audioplayer.loadVideoById(youtubeid[1], 0, "large");

			//$('#Play').append('<iframe width="0" height="0" src="' + this.link 
			//					+ '?autoplay=1" frameborder="0" allowfullscreen></iframe>');
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
	this.addEvent = function()
	{
		//add it to the page container's list of events
		$('#eventspane').append("<div id = '" + this.id + "' class='audioevent eventscontainer'><span class = 'eventname flex-center-vertically'>" + this.name + "</span>"
								+ "<span class = 'eventtype flex-center-vertically'><select><option value='Play'>Play</option><option value='Stop'>Stop</option></select></span>" 
								+ "<span class = 'eventtrigger'><input type='number' min = 0 value = 0></span></div>");

		$('.eventscontainer').last().on('click', '.eventname', function(event) {
			event.preventDefault();

			$('.eventscontainer').removeClass('highlighted');
			$(this).parent().toggleClass('highlighted');
			selected_event = $(this).parent();
			console.log(selected_event)
		});
		$('.eventtype select').material_select();

	}
}

function audioObj()
{
	this.selected_audio = null;
	this.unique_id = 0; //used for unique ids, different to array length
	this.assets = [];

	this.getAssetAsModalList = function(id)
	{
		var htmlstring = "";
		if (id != undefined)
		{
			var entry = this.assets[id];
			htmlstring += "<li id='" + entry.id + "''>Name: " + entry.name + "<br>Link: " + entry.link + "</li>"
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
			if (id >= 0)
			{
				return this.assets.find(x=> x.id === id);
			}
			return false;
		}
		else
			return this.assets;
	}

	this.removeAsset = function()
	{
		if (this.selected_audio != null)
		{
			var ele = this.getAsset(parseInt(this.selected_audio))	
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

function onYouTubePlayerAPIReady() 
{
	$( document ).ready(function(){
		audioplayer = new YT.Player('audioplayer', {
		  origin: 'https://www.youtube.com',
		  height: '100',
		  width: '100',
		  events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange,
			'onError': onPlayerError,
		  }
		});			
	});
}

// autoplay video
function onPlayerReady(event) 
{
	alert("started video")
    //event.target.playVideo();
}

// when video ends
function onPlayerStateChange(event) 
{ 
	if(event.data === -1){alert('youtube video not started');}
	if(event.data === 5){alert('youtube video queued');}       
	if(event.data === 1){alert('now playing');}       
    if(event.data === 0){alert('done');}
}

function onPlayerError(event) 
{
	alert("Youtube audio playback encountered error: ", event.data, ". Embedding of this link may be disabled by the owner.")
	console.log(event.data)
    //event.target.playVideo();
}
