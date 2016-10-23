goog.provide('tutorial')
goog.require('host')
goog.require('states')


var tutorial_graph = null;


//A message to output, and a function to progress further.
var tutorial_objects = [
	{
		message: "Let's start off by creating a page",
	},
	{
		message: "To do this you'll have to use the Tool Bar",
		css: function(){
		    $('#sidebar').addClass('tutorial-button-highlight');
		},

	},
	{
		message: "First open up the 'Pages' panel",
		css: function(){
		    $('#sidebar').removeClass('tutorial-button-highlight');
		    $('#Pagecollapse').addClass('tutorial-button-highlight');
		},
		condition: function(){
			if ($("#Pagecollapse").hasClass('active'))
			{
				return true;
			}
			else
				return false;
		}
	},
	{
		message: "Now click Page Node and select 'Default'",
		css: function(){
		    $('#Pagecollapse').removeClass('tutorial-button-highlight');
		    $('.pagemode').addClass('tutorial-button-highlight');
		},
		condition: function(){
			if (current_state == states.NEWPAGE)
			{
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
		    //$('#cy').addClass('tutorial-button-highlight');
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
		message: "You just made your first page!",
		css: function(){
		   // $('#cy').removeClass('tutorial-button-highlight');
		},
	},
	{
		message: "Try adding some more Pages",
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
		message: "The green page indicates the first page.",
	},
	{
		message: "You can drag and drop these Pages around, or tap to select them.",
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
		message: "Now lets try connecting some Pages.",
		css: function(){
		},

	},
	{
		message: "Open up the 'Paths' button.",
		css: function(){
			$('#Pathcollapse').addClass('tutorial-button-highlight')
		},
		condition: function(){
			if ($('#Pathcollapse').hasClass('active'))
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
		message: "Click the Path button.",
		css: function(){
			$('#Pathcollapse').removeClass('tutorial-button-highlight')
			$('.connectionmode').addClass('tutorial-button-highlight')
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
		message: "Now tap one of the Pages you added.",
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
		message: "The blue border indicates the 'Source' node",
	},
	{
		message: "Now tap a different Page node.",
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
		message: "Nice! You've now connected two Pages",
	},
	{
		message: "Try making another Path",
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
		message: "The labels on each Path help you keep track of them",
	},
	{
		message: "Leave Path mode by pressing escape or the Path button again",
		condition: function(){
			if (current_state !== states.CONNECTING)
				return true;
			else
				return false;
		}
	},
	{
		message: "Now lets see how a player sees a Path",
		css: function(){
			$('.connectionmode').removeClass('tutorial-button-highlight')
		},
	},
	{
		message: "Select a 'Source' Page (one with a Path leaving it).",
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
		message: "Here you can design the appearance of the Page",
		css: function(){
			$('.editbutton[data-target="page-modal"').removeClass('tutorial-button-highlight')
		},
	},
	{
		message: "On the left is the Page that your player will see. On the right is your Tool Bar",
	},
	{
		message: "You should be able to see the Path that you just created",
	},
	{
		message: "Position it whereever you want by dragging the handle on top of it.",
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
			if (tutorial_timer > 7)
				return true;
			else
				return false;
		}
	},
	{
		message: "If the text box covers up your path button make sure to move it",
		css: function(){
		},
		condition: function(){
			if (tutorial_timer > 7)
				return true;
			else
				return false;
		}
	},
	{
		message: "To edit the style of a text box or button click on it's setting icon",
		css: function(){
			$('[onclick="addTextContainer()"]').removeClass('tutorial-button-highlight');
		},
		condition: function(){
			if (tutorial_timer > 7)
				return true;
			else
				return false;
		}
	},
	{
		message: "You can also edit the entire Page's style by clicking on the blue settings icon",
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
		message: "Now lets try running your project.",
		css: function(){
			$('.fa-times').removeClass('tutorial-button-highlight')
			$('.playgamebutton ').addClass('tutorial-button-highlight')
		},
	},
	{
		message: "Click on the Play button",
		css: function(){
		},
		condition: function(){
			if ($('#Play').css('display') !== "none")
				return true;
			else
				return false;
		}
	},
	{
		message: "Press Start to continue",
		css: function(){
			$('.playgamebutton').removeClass('tutorial-button-highlight')
		},
		condition: function(){
			if (currentNode !== null)
				return true;
			else
				return false;
		}
	},
	{
		message: "You are now playing the game. Notice how the 'handles' have disappeared.",
		css: function(){
		},
	},
	{
		message: "You can return to your project at any time by clicking 'Finish'",
		condition: function(){
			if ($('#Play').css('display') == "none")
				return true;
			else
				return false;
		}
	},
	{
		message: "Done Tutorial.",
		css: function(){
			finishTutorial();
			continueTutorial();
		}
	},
]

function checkInTutorial()
{
	finishTutorial();

	if (project_project.projectName == "yoqpzHbHLaxCX__PcdHp" || project_project.title == "FantasyMaker Tutorial")
	{
		console.log("IN TUTORIAL PROJECT")
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
	{
		console.log("NOT IN TUTORIAL")
		return false;
	}
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
			if ( tutorial_objects[toast_id] === undefined)
			{
				hideToast(toast_id - 1);
				console.log("Clear the interval")
				clearInterval(window.refreshIntervalId);
			}
			else
			{
				if (tutorial_objects[toast_id].condition === undefined)
				{
					if (tutorial_timer > 5)
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
	$('.tutorial_toast').fadeOut();
	toast_id = 10000;
	$('.tutorial-button-highlight').removeClass('tutorial-button-highlight')
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
	Materialize.toast(message, 200000, "toast" + id + " tutorial_toast");
}

function hideToast(id)
{
	$('.toast' + id).fadeOut();
}
