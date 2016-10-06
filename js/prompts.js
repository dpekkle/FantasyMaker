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

// *** the second variable of myModal.prompt can handle multiple fields

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
			$('#prompt-modal .modal-content').children('input').each(function(index) 
			{
				if ($(this).attr('type') == "number"){
					console.log("We got a number entry");
					results.push(parseInt($(this).val()));
				}
				else
					results.push($(this).val());
			});
			//verify user input
			if(this.verifyFunction !== null)
			{
				//we need to check verify
				if(this.verifyFunction(results))
				{
					this.callbackFunction(results)
					$('#prompt-modal').closeModal();
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
		tar.append('<h3 style="text-align:center;">' + title + '</h3>');
		tar.append('<p>' + description + '<p>')
		for (var i = 0; i < fields.length; i++)
		{
			tar.append('<label for="' + i + '"> '+ fields[i].name + '</label>')
			if (fields[i].type == "number")
				tar.append('<input id= "' + i + '"type="' + fields[i].type + '" value = "' + parseInt(fields[i].default) + '" min ="' + fields[i].min + '" max ="' + fields[i].max + '">');
			else
				tar.append('<input id= "' + i + '"type="' + fields[i].type + '" value = "' + fields[i].default + '">');
		}

		$('#prompt-modal').openModal(
		{
			dismissible: false,
			//callback for when overlay is triggered from html
			ready: function() 
			{
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

}

var myModal = new myModal();
myModal.init();

