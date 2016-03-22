goog.provide('clickBehaviour')



function collapseFunc(element){
	
	var parent = element.parentNode.parentNode;
	console.log("Parent: ", parent.className)
	
	for (var i = 0; i < parent.childNodes.length; i++)
	{
		var child = parent.childNodes[i];
		if (child.className == "content") //we're looking for the content we want to minimise
		{
			if (child.style.display == "none")
				child.style.display = "block";
			else
				child.style.display = "none";
		}
	}

}

function stop(){
	
}

function dynamicEvent(){
	this.innerHTML = '<span>"test"</span>';
	
}