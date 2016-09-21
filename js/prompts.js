goog.provide("prompts")

//  ******************** <API GUIDE> *******************

//  *** instead of this sort of prompt ***

//		var imgurl = prompt("Enter image url", "http://i.imgur.com/V7vuv85.png");
//		codeToHandle(imgurl)

//  *** use this function ***

//		myModal.prompt("Modal Title", [{name: "Enter image url", default: "http://i.imgur.com/V7vuv85.png", type: "text"}], function(results){
//			if(!myModal.confirm)
//				return;
//			var imgurl = results[0];
// 			codeToHandle(imgurl)
//		});

// *** the second variable of myModal.prompt can handle multiple fields

//  ******************** </API GUIDE> *******************


function myModal()
{
	this.confirm = false;
	this.init = function()
	{
		$("body").append( '<div id="prompt-modal" class=" modal">'
							+ '<div class="modal-content">'
							+ '</div>'
							+ '<div class="modal-footer">'
      						  + '<a href="#!" class=" modal-action modal-close waves-effect waves-red btn-flat onclick="myModal.setconfirm(true)">Cancel</a>'
      						  + '<a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat" onclick="myModal.setconfirm(true)">Confirm</a>'
    						+ '</div>'
						  + '</div>');

	};
	this.setconfirm = function(bool)
	{
		console.log("Button pressed");
		this.confirm = bool;
	}

	this.prompt = function(title, description, fields, mycallback)
	{
		var tar = $('#prompt-modal .modal-content');
		var results = [];

		$('#prompt-modal').openModal(
		{
			dismissible: false,
			//callback for when overlay is triggered from html
			ready: function() 
			{
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
			},
			complete: function()
			{
				tar.children('input').each(function(index) 
				{
					if ($(this).attr('type') == "number"){
						console.log("We got a number entry");
						results.push(parseInt($(this).val()));
					}
					else
						results.push($(this).val());
				});
				mycallback(results);
			}
		});		
	}

}

var myModal = new myModal();
myModal.init();

