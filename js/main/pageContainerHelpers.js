goog.provide('pageContainerHelpers')
goog.require('project')

function genHandleHTML(containertype, id)
{
	var html_string = "";
	html_string += "<div class = 'handlecontainer'>";

	if (containertype == "img")
	{
		html_string += ('<a class="btn-floating waves-effect waves-light green lefticon">'
					+ 	 	'<i class="fa fa-picture-o"></i>'
					+   '</a>');
		html_string += "<div id = 'img" + id + "'" + "class = 'handle img-handle'>Image";
		html_string += '</div>';
		html_string += ('<a class="imgmenu btn-floating waves-effect waves-light red righticon">'
					+ 	 	'<i class="material-icons">settings</i>'
					+   '</a>');
	}

	else if (containertype == "vid")
	{
		html_string += ('<a class="btn-floating waves-effect waves-light blue-grey darken-4 lefticon">'
					+ 	 	'<i class="fa fa-film"></i>'
					+   '</a>');
		html_string += "<div id = 'vid" + id + "'" + "class = 'handle vid-handle'>Video";
		html_string += '</div>';
		html_string += ('<a class="vidmenu btn-floating waves-effect waves-light red righticon">'
					+ 	 	'<i class="material-icons">settings</i>'
					+   '</a>');
	}

	else if (containertype == "text")
	{
		html_string += ('<a class="btn-floating waves-effect waves-light grey lefticon">'
					+ 	 	'<i class="material-icons">comment</i>'
					+   '</a>');
		html_string += "<div id = 'text" + id + "'" + "class = 'handle text-handle'>Text";
		html_string += '</div>';

		html_string += ('<a class="textmenu btn-floating waves-effect waves-light red righticon">'
					+ 	 	'<i class="material-icons">settings</i>'
					+   '</a>');
	}
	else if (containertype == "decision")
	{
		html_string += ('<a class="btn-floating waves-effect waves-light blue lighten-3 lefticon">'
					+ 	 	id
					+   '</a>');
		html_string += "<div id = 'decision" + id + "'" + "class = 'handle link-handle'>Decision";
		html_string += '</div>';
		html_string += ('<a class="decmenu btn-floating waves-effect waves-light red righticon">'
					+ 	 	'<i class="material-icons">settings</i>'
					+   '</a>');
	}
	else if (containertype == "output")
	{
		html_string += ('<a class="btn-floating waves-effect waves-light indigo lighten-1 lefticon swap-controlmenu">'
					+ 	 	'<i class="fa fa-terminal"></i>'
					+   '</a>');
		html_string += "<div id = 'output" + id + "'" + "class = 'handle control-handle'>Output";
		html_string += '</div>';
		html_string += ('<a class="controlmenu btn-floating waves-effect waves-light red righticon">'
					+ 	 	'<i class="material-icons">settings</i>'
					+   '</a>');
	}
	else if (containertype == "inventory")
	{
		html_string += ('<a class="btn-floating waves-effect waves-light purple lighten-2 lefticon">'
					+ 	 	'<i class="fa fa-briefcase"></i>'
					+   '</a>');
		html_string += "<div id = 'inventory' class = 'handle control-handle'>Inventory";
		html_string += '</div>';
		html_string += ('<a class="inventorymenu btn-floating waves-effect waves-light red righticon">'
					+ 	 	'<i class="material-icons">settings</i>'
					+   '</a>');		
	}
	else if (containertype == "character")
	{
		html_string += ('<a class="btn-floating waves-effect waves-light gray lighten-1 lefticon">'
					+ 	 	'<i class="fa fa-female"></i>'
					+   '</a>');
		html_string += "<div id = 'character' class = 'handle control-handle'>Character";
		html_string += '</div>';
		html_string += ('<a class="charactermenu btn-floating waves-effect waves-light red righticon">'
					+ 	 	'<i class="material-icons">settings</i>'
					+   '</a>');		
	}
	else if (containertype == "jump")
	{
		html_string += ('<a class="btn-floating waves-effect waves-light orange lighten-1 lefticon">'
					+ 	 	'<i class="fa fa-caret-up"></i>'
					+   '</a>');
		html_string += "<div id = 'jump' class = 'handle control-handle'>" + id;
		html_string += '</div>';
		html_string += ('<a class="jumpmenu btn-floating waves-effect waves-light red righticon">'
					+ 	 	'<i class="material-icons">settings</i>'
					+   '</a>');		
	}
	else if (containertype == "jumpback")
	{
		html_string += ('<a class="btn-floating waves-effect waves-light orange lighten-1 lefticon">'
					+ 	 	'<i class="fa fa-caret-down"></i>'
					+   '</a>');
		html_string += "<div id = 'jumpback' class = 'handle control-handle'>Jump Back";
		html_string += '</div>';
		html_string += ('<a class="jumpbackmenu btn-floating waves-effect waves-light red righticon">'
					+ 	 	'<i class="material-icons">settings</i>'
					+   '</a>');		
	}
	else
	{
		console.log("Unknown container type when generating handle for HTML");
		return null;
	}

	html_string += '</div>'; //handle container end tag
	return html_string;
}

function genPageCenterHTML(elew, eleh, iter)
{
	var x = (parseFloat(project_project.resolution.x)-elew)/2;
	var y = (parseFloat(project_project.resolution.y)-eleh)/2;

	if (iter >= 0)
		y += 30*iter;
	if (y > project_project.resolution.y)
		y = project_project.resolution.y;

	return "transform: translate(" + x + "px, " + y + "px);' data-x='" + x + "' data-y='" + y;
}
