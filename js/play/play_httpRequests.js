goog.provide('play_httpRequests')

function load(username,projName){
  addTokenToHeader()
	//get graph data from server
	return $.ajax({
		url: '/getProject',
		data: {
			"projectOwner" : username,
			"projectName" : projName,
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
      else{
        delete data[0]._id; //remove mongos _id attribute
  			console.log(data)
        project_project = data[0]
      }
		},
		contenttype: "application/json"
	});
}


function authenticate(ret){
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
