goog.provide('pageTemplates')

/**** PAGE TEMPLATES ****/
// needs to be saved
var page_templates = 
{
	"Default": 				
	{ 
		pagestyle: "width:800px; height:600px; 	border: 3px solid #BBBBBB",
		outputcontainer: "",
		imgcontainers: [],
		audio: "none",
		textcontainers: [],
		decisioncontainers: [],
	}
};
var selected_page_template = page_templates["Default"];

function createPageTemplate()
{
	var name = prompt("Enter name for page template");
	if (name === "Default")
	{		
		alert("Can't override Default")
		return;
	}
	var selected = cy.$(':selected')[0];
	var data = selected.data();

	page_templates[name] = data;

	$('#pagetemplates').append("<li><a onclick=\"chooseNodeTemplate('" + name + "');\">" + name + "</a></li>")
}


function chooseNodeTemplate(sel)
{
	selected_page_template = page_templates[sel];
	$('.pagemode').html("Page Node (" + sel + ")")
	console.log("Select template: " + sel)
}
