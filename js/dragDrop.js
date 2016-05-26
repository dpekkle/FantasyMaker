// target elements with the "draggable" class
interact('.drag-element:not([locked])')
	.draggable({
		// enable inertial throwing
		inertia: true,
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
		  var textEl = event.target.querySelector('p');

		  textEl && (textEl.textContent =
			'moved a distance of '
			+ (Math.sqrt(event.dx * event.dx +
						 event.dy * event.dy)|0) + 'px');
		}
	})
	.allowFrom('.handle')


interact('.resize-element')
	.resizable({
		edges: { left: false, right: true, bottom: true, top: false}
	})
	.on('resizemove', function (event) {
		var tar = event.target;
		// update the element's dimensions
		tar.style.width  = checkBounds(tar.parentNode.getAttribute('data-x'), event.rect.width, $('#pagecontainers').width()) + 'px';
		tar.style.height = checkBounds(tar.parentNode.getAttribute('data-y'), event.rect.height, $('#pagecontainers').height() - $('.handle').height()) + 'px';
	});

function checkBounds(offset, dimension, limit)
{
	offset = (parseFloat(offset) || 0);
	console.log("Check " + offset + " + " + dimension)
	if (offset + dimension > limit)
	{
		console.log ("Greater than " + limit);
		dimension = limit - offset;
	}
	else
	{
		console.log ("Less than " + limit);
	}
	return dimension;
}  
  
function dragMoveListener (event) {
    var target = event.target;
	// keep the dragged position in the data-x/data-y attributes
	var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
	var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
	
    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

window.dragMoveListener = dragMoveListener;

//attempt at only calculating when resize event ENDS

var doit;
window.onresize = function(){
  clearTimeout(doit);
  doit = setTimeout(modalBounds, 300);
};

function modalBounds(){
	if ($('#page-modal').hasClass("open"))
	{
		$('.resize-element').each(function(){
			//recalculate bounds
			var tar = $(this);
			$(this).width(checkBounds(tar.parent().attr('data-x'), tar.width(), $('#pagecontainers').width()));
			$(this).height(checkBounds(tar.parent().attr('data-y'), tar.height(), $('#pagecontainers').height() - $('.handle').height()));
		})
	}
}
