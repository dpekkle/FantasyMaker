goog.require('project')
goog.provide('pageTemplates')

/**** PAGE TEMPLATES ****/
// needs to be saved

console.log('enter pageTemplates.js')

var selected_page_template = project_project.project_templates.Default;

function createPageTemplate()
{
	myModal.prompt("Create Page Template", "Add a new template when you create a new page node, which contains an exact copy of the contents of this page (other than decisions)", [{name: "Enter name", default: "", type: "text"}],
		function(results){
			var name = results[0];
			var selected = cy.$(':selected')[0];
			var data = selected.data();

			project_project.project_templates[name] = data;

			$('#pagetemplates').append("<li><a onclick=\"chooseNodeTemplate('" + name + "');\">" + name + "</a></li>")
		},
		function(results){
			if (results[0] == "")
			{
				return "Can't be an empty name";
			}
				else if (results[0] == "Default")
			{
				return "Can't override Default";
			}
			else if (project_project.project_templates[results[0]] !== undefined)
			{
				return "A template with that name already exists"
			}
			else 
			{ 
				return true;
			}
		}
	);
}


function chooseNodeTemplate(sel)
{
	$('.pagemode').addClass('activebutton');
	current_state = states.NEWPAGE;

	selected_page_template = project_project.project_templates[sel];
	$('.pagemode').html("Page Node (" + sel + ")")
	console.log("Select template: " + sel)
}
