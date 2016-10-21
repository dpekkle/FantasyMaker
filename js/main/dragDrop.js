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
			onstart: function(event){
				console.log("Started dragging");
			},
			// call this function on every dragmove event
			onmove: dragMoveListener,
			// call this function on every dragend event
			onend: function (event) {
			  console.log(event);
			}
		})
		.allowFrom('.handle')

	interact('.resize-element')
		.resizable({
			snap: snap_options,
			edges: { left: false, right: true, bottom: true, top: false},
			onmove: resizeMoveListener
		});
	interact('.resize-child')
		.resizable({
			snap: snap_options,
			edges: { left: false, right: true, bottom: true, top: false},
			onmove: resizeChildMoveListener
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
	//get scale of drop container
	//see http://stackoverflow.com/questions/5603615/get-the-scale-value-of-an-element
	var container = $('#pagecontainers')[0];
	var scaleX = container.getBoundingClientRect().width / container.offsetWidth;
	var scaleY = container.getBoundingClientRect().height / container.offsetHeight;

	//apply transform
	var target = event.target;
	var x = event.rect.width/scaleX;
	var y = event.rect.height/scaleY;

	//get data-x offsets of container
	offset_left = target.parentNode.getAttribute('data-x');
	offset_top  = target.parentNode.getAttribute('data-y');

	x = checkBounds(offset_left, x, $('#pagecontainers').width())
	y = checkBounds(offset_top, y, $('#pagecontainers').height())

	target.style.width  = x + 'px';
	target.style.height = y + 'px';
}

function resizeChildMoveListener(event) //for youtube iframe resizing
{
	//get scale of drop container
	//see http://stackoverflow.com/questions/5603615/get-the-scale-value-of-an-element
	var container = $('#pagecontainers')[0];
	var scaleX = container.getBoundingClientRect().width / container.offsetWidth;
	var scaleY = container.getBoundingClientRect().height / container.offsetHeight;

	//apply transform
	var target = event.target;
	var x = event.rect.width/scaleX;
	var y = event.rect.height/scaleY;

	//get data-x offsets of container
	offset_left = target.parentNode.getAttribute('data-x');
	offset_top  = target.parentNode.getAttribute('data-y');

	x = checkBounds(offset_left, x, $('#pagecontainers').width())
	y = checkBounds(offset_top, y, $('#pagecontainers').height())

	target.style.width  = x + 'px';
	target.style.height = y + 'px';
	target.firstChild.width  = x - 0 - 2 * parseFloat(getComputedStyle(target).getPropertyValue('border-left-width'));
	target.firstChild.height = y - 0 - 2 * parseFloat(getComputedStyle(target).getPropertyValue('border-top-width'));
}

function checkBounds(offset, dimension, limit)
{
	offset = (parseFloat(offset) || 0);
	if (offset + dimension > limit)
	{
		//larger than container
		dimension = limit - offset
	}
	return dimension;
}
  
function dragMoveListener (event) 
{
	var container = $('#pagecontainers')[0];
	var scaleX = container.getBoundingClientRect().width / container.offsetWidth;
	var scaleY = container.getBoundingClientRect().height / container.offsetHeight;

	var target = event.target;
	// keep the dragged position in the data-x/data-y attributes
	var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx / scaleX;
	var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy / scaleY;

	// translate the element
	target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

	// update the position attributes
	target.setAttribute('data-x', x);
	target.setAttribute('data-y', y);
}

window.dragMoveListener = dragMoveListener;

