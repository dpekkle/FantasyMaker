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

function changeAudio()
{
	$('#audio')[0].pause();
	
	if (cy.$(':selected').data('audio') == "none")
		console.log("no audio link");
	else
		$('#audio').attr("src", cy.$(':selected').data('audio')); //change the source of the audio	

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

function changeImage()
{
	
	if (cy.$(':selected').data('img') == "none")
	{
		resizeImage(0,0);
		console.log("no image link found");
	}
	else
	{
		$('#pageimg').attr("src", 	cy.$(':selected').data('img'));	
		resizeImage(100,100);
	}
}

function resizeImage(width, height)
{
	$('#pageimg').attr("width", width);	
	$('#pageimg').attr("height", height);	
	resizeCanvas();	
}