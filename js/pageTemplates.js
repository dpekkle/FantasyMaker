goog.require('project')
goog.provide('pageTemplates')

/**** PAGE TEMPLATES ****/
// needs to be saved

console.log('enter pageTemplates.js')

var selected_page_template = project_project.project_templates.Default;;

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

	project_project.project_templates[name] = data;

	$('#pagetemplates').append("<li><a onclick=\"chooseNodeTemplate('" + name + "');\">" + name + "</a></li>")
}


function chooseNodeTemplate(sel)
{
	selected_page_template = project_project.project_templates[sel];
	$('.pagemode').html("Page Node (" + sel + ")")
	console.log("Select template: " + sel)
}
