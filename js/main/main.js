goog.require('initCanvas')
goog.require('canvasEvents')
goog.require('ui')
goog.require('generalOverlay')
goog.require('hotkeys')
goog.require('playGame')
goog.require('audio')
goog.require('projectSettings')
goog.require('httpRequests')


console.log("Enter main.js version 0.5.0")

// Commands to run only once on page load

$(document).ready()
{
	$('select').material_select(); //initialises the layout <select> tag for materialize
}