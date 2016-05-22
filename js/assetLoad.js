goog.provide('assetLoad')
goog.require('initCanvas')

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

