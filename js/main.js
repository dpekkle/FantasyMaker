goog.require('initCanvas')
goog.require('canvasEvents')
goog.require('ui')
goog.require('generalOverlay')
goog.require('playGame')

console.log("Enter main.js version 0.5.0")

// Commands to run only once on page load 

$('select').material_select(); //initialises the layout <select> tag for materialize


// Fallback in case <dialog> tag is not supported by browser
//var dialog = document.querySelector('modal1');
//dialogPolyfill.registerDialog(dialog);

