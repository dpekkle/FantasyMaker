goog.provide('assetLoad')
goog.require('initCanvas')

function addTextContainer()
{
	//Create a new draggable div to hold the text container
	//These text containers dont bind to the Node data yet, and are just html elements
	
	var size = cy.$(':selected').data('textcontainers').length;
	
	//create the container and append it to the pageX
	{
		var mDiv = document.createElement('div');
		mDiv.className = "drag-element";
		mDiv.id = "text-container" + size;
		//mDiv.setAttribute("width", "40");
		mDiv.setAttribute("height", "40");
		mDiv.setAttribute("width", "25%");
		
		var mTextContainer = document.createElement('textarea');
		mTextContainer.setAttribute("id", "text-area" + size);
		mTextContainer.setAttribute("rows", "4");
		mTextContainer.setAttribute("cols", "30");
		mTextContainer.setAttribute("class", "text-area");
		
		mDiv.appendChild(mTextContainer);
		$("#pagecontainers").append(mDiv);	
	}
	
	var container_array = cy.$(':selected').data('textcontainers');
	var newcontainer = {
		'id' : 'test', 
		'contents' : 'none', 
		'html': $("#text-container"+size)[0].outerHTML
		};
	container_array.push(newcontainer);
	cy.$(':selected').data('textcontainers', container_array);
	
	$("#text-area"+size).on('input', function(event) //fires an event when the container's textarea has a value entered
	{
		var text = this.value;
		console.log("Text: ", text);
		cy.$(':selected').data('textcontainers')[size].contents = text;	
	})
}

function loadAudio()
{
	var audiolink = prompt("Enter audio url", cy.$(':selected').data('audio'));
	if (audiolink != null)
	{
		cy.$(':selected').data('audio', audiolink); //store audio in cy node
		$('#audio').attr("src", cy.$(':selected').data('audio')); //change the source of the audio
	}
}

function toggleAudio()
{
	if ($('#audio')[0].paused == false)
		$('#audio')[0].pause();
	else
		$('#audio')[0].play();
}

function changeAudio(element)
{
	var selected = element;
	if (element === null)
		selected = cy.$(':selected')
	$('#audio')[0].pause();
	
	if (selected.data('audio') == "none")
		console.log("no audio link");
	else
		$('#audio').attr("src", selected.data('audio')); //change the source of the audio	

}

function loadImage()
{
	console.log("Image: ", cy.$(':selected').data('id'));
	console.log(cy.$(':selected').data('img'));
	
	var imglink = prompt("Enter image url", cy.$(':selected').data('img'));
	if (imglink != null)
	{
		cy.$(':selected').data('img', imglink); //store image url in cy node
		
		$('#pageimg').attr("src", 	cy.$(':selected').data('img')); //change the source of the image
		resizeImage(100,100);
	}
}

function changeImage(element)
{
	var selected = element;
	if (element === null)
		selected = cy.$(':selected')
	
	if (selected.data('img') == "none")
	{
		resizeImage(0,0);
		console.log("no image link found");
	}
	else
	{
		$('#pageimg').attr("src", selected.data('img'));	
		resizeImage(100,100);
	}
}

function resizeImage(width, height)
{
	$('#pageimg').attr("width", width);	
	$('#pageimg').attr("height", height);	
	resizeCanvas();	
}

