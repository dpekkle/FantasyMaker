goog.provide('tutorial')
goog.require('host')
goog.require('states')


var tutorial_graph = null;


//A message to output, and a function to progress further.
var tutorial_objects = [
	{
		message: "First click Page Node and select 'Default'", 
		css: function(){
		    $('.pagemode').addClass('tutorial-button-highlight');
		},
		condition: function(){
			console.log("First function")
			if (current_state == states.NEWPAGE)
			{
				console.log("First function done")
				return true;
			}
			else
				return false;
		}
	},
	{
		message: "Now tap on the screen on the left to create a page", 
		css: function(){
		    $('.pagemode').removeClass('tutorial-button-highlight');
		    $('#cy').addClass('tutorial-button-highlight');
		},
		condition: function(){
			if (cy.elements().size() !== 0)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	},
	{
		message: "That box you just created is a new page!", 
		css: function(){
		    $('#cy').removeClass('tutorial-button-highlight');
		},
	},
	{
		message: "Try adding some more pages", 
		css: function(){
		},
		condition: function(){
			if (cy.elements().size() > 2)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	},
	{
		message: "The green page marks the starting page.",
	},	
	{
		message: "You can drag and drop these page nodes around, or tap to select them.",
		condition: function(){
			if (tutorial_timer > 8)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	},	
	{
		message: "Now lets try connecting some pages.",
		css: function(){
			$('.connectionmode').addClass('tutorial-button-highlight')
		},

	},	
	{
		message: "Click the edge button.",
		css: function(){
			$('.connectionmode').show();
		},
		condition: function(){
			if (current_state == states.CONNECTING)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	},	
	{
		message: "Now tap one of the pages you added.",
		condition: function(){
			if (source_node !== null)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	},
	{
		message: "The blue border indicates the 'source' of the edge",
	},
	{
		message: "Now tap a different page node.",
		condition: function(){
			if (cy.edges().size() !== 0)
			{
				var edge = cy.edges()[0];
				return true;
			}
			else
			{
				return false;
			}
		}
	},
	{
		message: "Nice! You've now connected two pages",
	},
	{
		message: "Try making another edge",
		condition: function(){
			if (cy.edges().size() > 1)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	},
	{
		message: "The labels on each edge help you keep track of them",
	},
	{
		message: "Leave edge mode by pressing escape or the edge button again",
		condition: function(){
			if (current_state !== states.CONNECTING)
				return true;
			else
				return false;
		}
	},
	{
		message: "Now lets see what that edge looks like in the page",
		css: function(){
			$('.connectionmode').removeClass('tutorial-button-highlight')
		},
	},
	{
		message: "Select a page with an edge leaving it",
		css: function(){
		
		},
		condition: function(){
			if (cy.$(':selected').outgoers().edges().size() > 0)
			{
				return true;
			}
			else
				return false;
		}
	},
	{
		message: "Now press 'Edit Page' to open up the Page Designer",
		css: function(){
			$('.editbutton[data-target="page-modal"').addClass('tutorial-button-highlight')
		},
		condition: function(){
			if($('#page-modal').css('display') !== "none")
				return true;
			else
				return false;
		}
	},
	{
		message: "Here you can design the appearance of the page, you can see the edges that you just created",
		css: function(){
			$('.editbutton[data-target="page-modal"').removeClass('tutorial-button-highlight')
		},
	},
	{
		message: "You can position them however you want by dragging the handle on top of them.",
	},
	{
		
		message: "Try adding a text box, just click the button",
		css: function(){
			$('[onclick="addTextContainer()"]').addClass('tutorial-button-highlight');
		},
		condition: function(){
			if ($('.text-container').size() !== 0)
				return true;
			else
				return false;
		}
	},
	{
		message: "You can edit the contents of a text box by clicking the box and typing",
		css: function(){
			$('[onclick="addTextContainer()"]').removeClass('tutorial-button-highlight');
		},
		condition: function(){
			if (tutorial_timer > 8)
				return true;
			else
				return false;
		}
	},
	{
		message: "To edit the style try click on it's setting icon",
		css: function(){
			$('[onclick="addTextContainer()"]').removeClass('tutorial-button-highlight');
		},
		condition: function(){
			if (tutorial_timer > 8)
				return true;
			else
				return false;
		}
	},
	{
		message: "You can also edit the entire page's style by clicking on the blue settings icon",
		css: function(){
			$('[onclick="addTextContainer()"]').removeClass('tutorial-button-highlight');
		},
	},
	{
		message: "When you're done you can exit by pressing escape or the X icon.",
		css: function(){
			$('.fa-times').addClass('tutorial-button-highlight')
		},
		condition: function(){
			if ($('#page-modal').css('display') == "none")
				return true;
			else
				return false;
		}
	},
	{
		message: "Now lets try running your project, click on the Play button",
		css: function(){
			$('.fa-times').removeClass('tutorial-button-highlight')
			$('.playgamebutton ').addClass('tutorial-button-highlight')
		},
		condition: function(){
			if ($('#Play').css('display') == "none")
				return true;
			else
				return false;
		}
	},
	{
		message: "",
		css: function(){
			$('.playgamebutton').removeClass('tutorial-button-highlight')
		},
		condition: function(){
			if ($('#Play').css('display') == "none")
				return true;
			else
				return false;
		}
	},
	{
		message: "",
		css: function(){
			finishTutorial();
			continueTutorial();
		}
	},



]

function checkInTutorial()
{
	if (project_project.projectName == "RTLtiSnbMQcFRXskpAGv")
	{
		if (window.location.href !== host_playModule())
		{
			console.log(window.location.href)
			myModal.prompt("Welcome!", "Welcome to FantasyMaker. This tutorial will give you a quick understanding of how to use the system to create things like games, stories, and presentations. Confirm to proceed, or cancel to load a demo project.",[],
				function()
				{
					prepareTutorial();
				})

			return true;
		}
		else
			return false;
	}
	else
		return false;
};

function prepareTutorial()
{
	//initialise variables
	progress = false; //used to halt/move forward iterator through tutorial_objects
	toast_id = 0;
	tutorial_timer = 0;

	//clone and remove graph;
	tutorial_graph = cy.elements().clone();
	cy.remove(cy.elements());
	console.log("Cloning tutorial graph ", tutorial_graph);

	//hide elements
	$('#sidebar .btn').hide();
	$('#sidebar hr').hide();
	$('#sidebar .pagemode').show();

	runTutorial();
}

function runTutorial()
{
	//first message
	createToast(tutorial_objects[toast_id].message, toast_id);
	if (tutorial_objects[toast_id].css !== undefined)
		tutorial_objects[toast_id].css();

	//loop
	refreshIntervalId = setInterval(
		function()
		{
			//check we didnt go to the project window
			if ($('#projects').css('display') == "none")
				tutorial_timer += 0.5;
			if ( toast_id > tutorial_objects.length - 1)
			{
				hideToast(toast_id);
				console.log("Clear the interval")
				clearInterval(window.refreshIntervalId);
			}
			else
			{
				if (tutorial_objects[toast_id].condition === undefined)
				{
					if (tutorial_timer > 4)
					{
						console.log("tutorial timer ready: ", tutorial_timer)
						progress = true;
					}
				}
				else if(tutorial_objects[toast_id].condition())
				{
					console.log("tutorial condition met")
					progress = true;
				}
				if (progress)
				{
					tutorial_timer = 0;
					console.log("Lets progress the toast")
					progress = false;
					hideToast(toast_id);
					toast_id++;			
					createToast(tutorial_objects[toast_id].message, toast_id);
					if (tutorial_objects[toast_id].css !== undefined)
						tutorial_objects[toast_id].css();
				}
			}
		}
		, 500);
};

function finishTutorial()
{
	//show all the buttons we hid
	$('#sidebar .btn').show();
	$('#sidebar hr').show();

}

function continueTutorial()
{
	myModal.prompt("Congratulations!", "You are now ready to start exploring more advanced options.",[],
		function(){
			cy.remove(cy.elements());
			cy.add(tutorial_graph);
			createToast("The wiki has just been loaded. Click on the Play Game button to try it.")
			$('.playgamebutton').addClass('tutorial-button-highlight')
		});
}


//helper functions for toasts and waiting
function createToast(message, id)
{
	Materialize.toast(message, 200000, "toast" + id);
}

function hideToast(id)
{
	$('.toast' + id).fadeOut();
}
