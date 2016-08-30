goog.provide('dragDrop')

grid_snapping_mode = false;

//create a grid pattern
var grid_targets = interact.createSnapGrid({
  x: 10, //grid spacing between x points
  y: 10, 
  range: 10, //range from grid point from which to snap
  offset: {x:-2, y:2}
});

function initSnapOptions()
{
	if (grid_snapping_mode)
	{
		return {
			targets: [grid_targets],
			relativePoints: [{x:1, y:1}], //upper left corner binds to grid
			endOnly: false	
		};
	}
	else
		return {
			targets: [],
			relativePoints: [{x:1, y:1}], //upper left corner binds to grid
			endOnly: false	
		};
}

//load grid into options
var snap_options = initSnapOptions();

function setInteractions()
{
	// target elements with the "draggable" class
	interact('.drag-element:not([locked])')
		.draggable({
			snap: snap_options,
			// disable inertial throwing
			inertia: false,
			// keep the element within the area of it's parent
			restrict: {
			  restriction: "parent",
			  endOnly: false,
			  elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
			},
			// enable autoScroll
			autoScroll: true,

			// call this function on every dragmove event
			onmove: dragMoveListener,
			// call this function on every dragend event
			onend: function (event) {
			  console.log(event);
			}
		})
		.allowFrom('.handle');


	interact('.resize-element')
		.resizable({
			snap: snap_options,
			edges: { left: true, right: true, bottom: true, top: false},
			onmove: resizeMoveListener
		});
}

setInteractions();

function toggleGridMode()
{
	grid_snapping_mode = !grid_snapping_mode;
	if (grid_snapping_mode)
		$('.gridmode').html("Grid: Enabled");
	else
		$('.gridmode').html("Grid: Disabled");
	
	$('.gridmode').toggleClass('activebutton');
	snap_options = initSnapOptions();
	setInteractions();	
}

function resizeMoveListener(event)
{
	var tar = event.target;
	// update the element's dimensions
	tar.style.width  = checkBounds(tar.parentNode.getAttribute('data-x'), event.rect.width, $('#pagecontainers').width()) + 'px';
	tar.style.height = checkBounds(tar.parentNode.getAttribute('data-y'), event.rect.height, $('#pagecontainers').height()) + 'px';
}

function checkBounds(offset, dimension, limit)
{
	offset = (parseFloat(offset) || 0);
	console.log("Check " + offset + " + " + dimension)
	if (offset + dimension > limit)
	{
		dimension  = limit - offset
	}
	return dimension;
}  
  
function dragMoveListener (event) 
{
	var target = event.target;
	// keep the dragged position in the data-x/data-y attributes
	var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
	var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

	// translate the element
	target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

	// update the position attributes
	target.setAttribute('data-x', x);
	target.setAttribute('data-y', y);
}

window.dragMoveListener = dragMoveListener;

//When we resize the browser window it can sometimes make elements out of bounds, so we need to resize or translate them to stay in the "play screen" div
function modalBounds()
{
	if ($('#page-modal').hasClass("open"))
	{
		$('.drag-element').each(function()
		{
			//recalculate bounds
			var tar = $(this);
			//update width and height, could also update position

			//tar.width(checkBounds(tar.parent().attr('data-x'), tar.width(), $('#pagecontainers').width()));
			//tar.height(checkBounds(tar.parent().attr('data-y'), tar.height(), $('#pagecontainers').height()));



			//these numbers are all wrong, but the calls are right i believe
			// var x1 = checkBounds(tar.parent().attr('data-x'), tar.width(), $('#pagecontainers').width());
			// var y1 = checkBounds(tar.parent().attr('data-y'), tar.height(), $('#pagecontainers').height());

		 //    tar.css("webkitTransform", 'translate(' + x1 + 'px, ' + y1 + 'px)');
		 //    tar.css("transform", 'translate(' + x1 + 'px, ' + y1 + 'px)');

		 //    // update the position attributes
		 //    tar.attr('data-x', x1);
		 //    tar.attr('data-y', y1);
		})
	}
}

//listener for resizing the window
var doit;
window.onresize = function()
{
  clearTimeout(doit);
  doit = setTimeout(modalBounds, 300);
};


