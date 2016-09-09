goog.provide('audio')


function audioAsset(name, id, link, type)
{
	this.name = "Audio " + id + ": " + name;
	this.id = id;
	this.type = type;
	this.link = link;
	this.loadHTML = function()
	{
		if (this.type == "youtube")
		{
			return "HTML string!";
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
}

function audioObj()
{
	this.size = 0;
	this.assets = [];

	this.getAsset = function(id){
		if (id !== undefined)
		{
			if (id >= 0 && id < this.size)
				return this.assets[id];
			else
				return "No such asset";
		}
		else
			return this.assets;
	}
	this.addAsset = function(name, link){
		//parse URL for type
		var type = this.parseType();
		if (type != "error")
		{
			this.assets[this.size] = new audioAsset(name, this.size, link, type);
			this.size++;
		}
	}
	this.parseType = function(link)
	{
		//parse url
		
		//if (not a valid url)
			//alert("Invalid URL");
			//return "error";
		//else if youtube link
			return "youtube";
	}

}

var audio = new audioObj();

function testAudioObjects()
{
	audio.addAsset("Test asset", "http://www.youtube.com/somelink")
	audio.addAsset("Test asset2", "http://www.youtube.com/somelink2")
	console.log(audio.getAsset(0));
	console.log(audio.getAsset(1));
	console.log(audio.getAsset());
	console.log(audio.getAsset("a"));
	console.log(audio.getAsset(-1));
	console.log(audio.getAsset(2));

}