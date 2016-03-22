goog.provide('clickBehaviour')



function collapse(element)
{
	for (var i = 0; i < element.childNodes.length; i++)
	{
		var child = element.childNodes[i];
		if (child.className == "content") //we're looking for the content we want to minimise
		{
			if (child.style.display == "none")
				child.style.display = "block";
			else
				child.style.display = "none";
		}
	}
}

function collapseFromChild(element){
	
	var parent = element.parentNode.parentNode;
	console.log("Parent: ", parent.className)
	
	collapse(parent);

}

function stop(){
	
}

function dynamicEvent(){
	this.innerHTML = '<span>"test"</span>';
	
}