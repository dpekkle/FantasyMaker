goog.provide('saveload')



window.nodeArray = new Array();
window.saveArray = new Array();

function addToSave(element)
{
	nodeArray.push(element);
	console.log("Size of save data: ", nodeArray.length);
}

function viewSavedNodes()
{
	for (var i = 0; i < nodeArray.length; i++)
	{
		console.log(nodeArray[i].outerHTML)
	}	
}

//ISSUES: nodeArray will only store newly added arrays, meaning old save data is overwritten
// so when we load a save it needs to add those nodes to saveArray (or some other solution)

function storeSave()
{	
	for (var i = 0; i < nodeArray.length; i++)
	{
		saveArray.push(nodeArray[i].outerHTML);
	}
	
	localStorage["elements"] = JSON.stringify(saveArray);
}

function clearSave()
{
	localStorage["elements"] = "";
}

function loadSave()
{	
	var tempsave = JSON.parse(localStorage["elements"]);
	
	for (var i = 0; i < tempsave.length; i++)
	{
		console.log("Saved ", i, " ", tempsave[i]);
		
		var element = document.createElement('div');
		document.getElementById('form-container').appendChild(element); 
		element.outerHTML = tempsave[i];
	}
}

