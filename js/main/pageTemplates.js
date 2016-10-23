goog.require('project')
goog.provide('pageTemplates')

/**** PAGE TEMPLATES ****/
// needs to be saved

console.log('enter pageTemplates.js')

var selected_page_template = project_project.project_templates.Default;

function fillPageTemplatesSelect()
{
	//load pageTemplates every time you click it
	$('#pagetemplates').html('');
	$.each(project_project.project_templates, function(key, value) 
	{
		$('#pagetemplates').append(project_project.project_templates[key].html);
	});
}

function createPageTemplate()
{
	myModal.prompt("Create Page Template", "Add a new template when you create a new page node, which contains an exact copy of the contents of this page (other than decisions)", [{name: "Enter name", default: "", type: "text"}],
		function(results){
			var name = results[0];
			var selected = cy.$(':selected')[0];
			var data = selected.data();
			project_project.project_templates[name] = {};
			project_project.project_templates[name].name = name;
			project_project.project_templates[name].html = "<li><a onclick=\"chooseNodeTemplate('" + name + "');\">" + name + "</a></li>"
			project_project.project_templates[name].data = data;

			$('#pagetemplates').append(project_project.project_templates[name].html);
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
	//$('.pagemode').html("Add A Page");
	Materialize.toast("Select template: " + sel, 5000);
	console.log("Select template: " + sel)
}
