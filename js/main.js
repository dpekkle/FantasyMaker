goog.require('initCanvas')
goog.require('canvasEvents')
goog.require('ui')
goog.require('generalOverlay')
goog.require('hotkeys')
goog.require('playGame')

console.log("Enter main.js version 0.5.0")

// Commands to run only once on page load 

$('select').material_select(); //initialises the layout <select> tag for materialize

$('.tooltip').tooltip();