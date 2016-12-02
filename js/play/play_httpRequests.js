/*
	Name: play http requests
	Created By: Darryl
	Purpose: defines http requests for play module
*/

goog.provide('play_httpRequests')

function load(username,projName,cb){
  addTokenToHeader()
	//get graph data from server
	return $.ajax({
		url: '/getProject',
		data: {
			"projectOwner" : username,
			"projectName" : projName,
      "source" : "play"
		},
		cache: false,
		type: 'GET',
		success: function(data) {
			//console.log(JSON.stringify(data));
      if(data === 'INVALID'){
        console.log('No project found called "' + projName + '" made by "' + username + '"')
        $('#data').text('No project found called "' + projName + '" made by "' + username + '"')
      }
      else if(data === 'EXPIRED'){
        console.log('token expired')
        $('#data').text('token expired')
      }
      else if(data === "NOT_PUBLISHED"){

      }
      else{
        delete data[0]._id; //remove mongos _id attribute
  			console.log(data)
        project_project = data[0]

        //database does not store methods, so we need to create new audioobj initialising it with the stored values - Danni
				project_project.audio = loadAudioObject(project_project.audio)
				loadTemplateMenuObj();
				$.each(project_project.button_list, function(index, val) {
					this.callback = generateJumpButtonCallback();
				});


				$('#UI_projName').text('Project: ' + project_project.title)

				//add nodes first
				for(var i = 0; i<data[0].graph.length; i++){
					//check if element is an edge
					if(data[0].graph[i].group !== "edges"){
						cy.add(data[0].graph[i]);
					}
				}
				//now add the edges
				for(var i = 0; i<data[0].graph.length; i++){
					//check if element is an edge
					if(data[0].graph[i].group == "edges"){
						var newEdge = cy.add(data[0].graph[i]);
						//add event listener to edge
						newEdge.on('tap', function(event){this.select();});
					}
				}

				Materialize.toast("Project '" + project_project.title + "' Loaded", 3000, 'rounded')
				resizeCanvas();
				defaultState();
				checkInTutorial();

        console.log("CY LOADED")
        console.log(cy.elements().jsons())

        cb()
				//add nodes first
        /*
				for(var i = 0; i<data[0].graph.length; i++){
					//check if element is an edge
					if(data[0].graph[i].group !== "edges"){
						cy.add(data[0].graph[i]);
					}
				}
				//now add the edges
				for(var i = 0; i<data[0].graph.length; i++){
					//check if element is an edge
					if(data[0].graph[i].group == "edges"){
						var newEdge = cy.add(data[0].graph[i]);
						//add event listener to edge
						newEdge.on('tap', function(event){this.select();});
					}
				}
        */


      }
		},
		contenttype: "application/json"
	});
}


function authenticate(ret,cb){
  window.localStorage.setItem('play-token','')
  return $.ajax({
		url: '/playAuth',
		data: {
			"uname" : "guest",
		},
		cache: false,
		type: 'POST',
		success: function(data) {
			console.log('LOGIN RES:')
			console.log(data)
			window.localStorage.setItem('play-token', JSON.stringify(data))
      cb()
		},
		contenttype: "application/json"
	});
}

function addTokenToHeader(){
	var token = window.localStorage.getItem('play-token');
  //console.log(token)
	if (token) {
		var tok = JSON.parse(token).token
	  $.ajaxSetup({
	    headers: {
	      'x-access-token': tok
	    }
	  });
	}
}
