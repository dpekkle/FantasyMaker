goog.provide("prompts")

//  ******************** <API GUIDE> *******************

//  *** instead of this sort of prompt ***

//		var imgurl = prompt("Enter image url", "http://i.imgur.com/V7vuv85.png");
//		codeToHandle(imgurl)

//  *** use this function ***

//		myModal.prompt("Modal Title", "Modal Description", [{name: "Enter image url", default: "http://i.imgur.com/V7vuv85.png", type: "text"}],
//			function(results){
//				var imgurl = results[0];
// 				codeToHandle(imgurl)
//			},
//			function(results){
//				if (results[0] == "Something I Dont want as Input"){return false;}
//        		else { return true;}
//			}
//		);

// *** the third parameter (list of objects) of myModal.prompt can handle multiple fields
// *** the third parameter can be passed false to facilitate a basic confirm for dismiss input 

//  ******************** </API GUIDE> *******************


function myModal()
{
	this.confirm = false;
	this.validated = true;
	this.verifyFunction = null;
	this.callbackFunction = null;

	this.init = function()
	{
		$("body").append( '<div id="prompt-modal" class=" modal">'
							+ '<div class="modal-content">'
							+ '</div>'
							+ '<div class="modal-footer">'
      						  + '<a href="#!" class=" modal-action modal-close waves-effect waves-red btn-flat onclick="myModal.evaluateModal(false)">Cancel</a>'
      						  + '<a href="#!" class=" modal-action waves-effect waves-green btn-flat" onclick="myModal.evaluateModal(true)">Confirm</a>'
    						+ '</div>'
						  + '</div>');

	};

	this.evaluateModal = function(bool)
	{
		console.log("Button pressed");
		this.confirm = bool;
		var results = [];

		if (this.confirm)
		{
			//grab user input
			$('#prompt-modal .modal-content').children('.input-field').each(function(index)
			{
				var tar = $(this).children('input');
				if (tar.attr('type') == "number"){
					console.log("We got a number entry");
					results.push(parseFloat(tar.val()));
				}
				else
					results.push(tar.val());
			});
			//verify user input
			if(this.verifyFunction !== null)
			{
				console.log("Results: ")
				for (var i = 0; i < results.length; i++)
				{
					console.log(results[i]);
				}
				var text = this.verifyFunction(results);
				//we need to check verify
				if(text === true)
				{
					this.callbackFunction(results)
					$('#prompt-modal').closeModal();
				}
				else if (text !== undefined) //asynchronous returns don't work
				{
					this.warning(text);
				}
			}
			//or just trust the data if no verification function defined
			else
			{
				this.callbackFunction(results);
				$('#prompt-modal').closeModal();

			}
		}
		else //cancel or some other click
		{
			$('#prompt-modal').closeModal();
		}
	}

	this.prompt = function(title, description, fields, mycallback, myverify)
	{
		var tar = $('#prompt-modal .modal-content');

		if (myverify !== undefined)
		{
			this.verifyFunction = myverify;
		}
		else
		{
			this.verifyFunction = null;
		}

		this.callbackFunction = mycallback;


		tar.html('');
		var html_string = "";

		html_string += ('<h3 style="text-align:center;">' + title + '</h3>');
		if (Array.isArray(description))
		{
			html_string += ('<p id="promptDesc">' + description[0] + '</p>')
			for (var i = 1; i < description.length; i++)
			{
				html_string += ('<p>' + description[i] + '</p>')
			}
		}
		else
		{
			html_string += ('<p id="promptDesc">' + description + '</p>')
		}
		//if only a confirm is needed
		if(!fields){/* do nothing */}
		else {
		for (var i = 0; i < fields.length; i++)
		{
			if (fields[i].type == "number")
			{
				html_string += ('<div class="input-field">')
				html_string += ('<label for="' + i + '"> '+ fields[i].name + '</label>' 
					+ '<input id= "' + i + '"type="' + fields[i].type + '" value = "' + parseFloat(fields[i].default) + '" min ="' + fields[i].min + '" max ="' + fields[i].max + '">')
				html_string += ('</div>')
			}
			else
			{
				html_string += ('<div class="input-field">')
				html_string += ('<label for="' + i + '"> '+ fields[i].name + '</label>' 
					+ '<input id= "' + i + '"type="' + fields[i].type + '" value = "' + fields[i].default + '">');
				html_string += ('</div>')
			}
		}
		}
		
		tar.append(html_string);


		$('#prompt-modal .modal-content input').eq(0).prop('autofocus', true)	

		$('#prompt-modal').openModal(
		{
			dismissible: false,
			//callback for when overlay is triggered from html
			ready: function()
			{
				Materialize.updateTextFields();
			},
			complete: function()
			{
				this.confirm = false;
				this.validated = true;
				this.verifyFunction = null;
				this.callbackFunction = null;
				tar.html("");
			}
		});
	}

	this.warning = function(text){
		$('#promptDesc').css('color', 'red')
		if (text !== false)
			$('#promptDesc').text(text)
	}

}

var myModal = new myModal();
myModal.init();

$(document).ready(function() 
{
	var ctrl_key_held = false;
	$('html').on('keydown' , function(e)
	{

		if ($('#prompt-modal').hasClass('open'))
		{
			if (e.which == 13)
				myModal.evaluateModal(true)
			else if (e.which == 27)
				myModal.evaluateModal(false);
		}
		else if ($('#define-attribute-modal').hasClass('open'))
		{
			if (e.which == 13)
				defineAttributeModal.evaluateModal(true)
			else if (e.which == 27)
				defineAttributeModal.evaluateModal(false);
			
		}
	});
});