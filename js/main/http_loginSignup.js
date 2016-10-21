goog.provide('http_loginSignup')
goog.require('navigation')


function http_signUp(newUser,ret){
	return $.ajax({
		url: '/signUp',
		data: {
			"data" : newUser
		},
		cache: false,
		type: 'POST',
		success: function(data) {
			if(http_handleAuth(data)){
				ret = data
			}
		},
		contenttype: "application/json"
	});
}

function http_login(uname,pwd,ret){
	return $.ajax({
		url: '/login',
		data: {
			"uname" : uname,
			"pwd" : pwd
		},
		cache: false,
		type: 'POST',
		success: function(data) {
			ret.data = data
		},
		contenttype: "application/json"
	});
}

//examines response from server for authentication validation
function http_handleAuth(res){
	if(res === 'EXPIRED' || res === 'NO_TOKEN' || res === 'AUTH_ERROR'){
		if(res === 'EXPIRED'){
			console.log('http_handleAuth(): Token is expired')
		}
		else if(res === 'AUTH_ERROR'){
			console.log('http_handleAuth(): auth error')
		}
		else{
			console.log('http_handleAuth(): No Token')
		}

		users_flushToken() //remove anyexpired tokens
		nav_toLogin()
		return false
	}
	return true
}

function http_validateToken(ret){
	http_addTokenToHeader()
	return $.ajax({
		url: '/validateToken',
		cache: false,
		type: 'GET',
		success: function(data) {
			if(data === 'EXPIRED' || data === 'NO_TOKEN' || data === 'AUTH_ERROR'){
				if(data === 'EXPIRED'){
					console.log('http_handleAuth(): Token is expired')

				}
				else if(data === 'AUTH_ERROR'){
					console.log('http_handleAuth(): auth error')
				}
				else{
					console.log('http_handleAuth(): No Token')
				}
				ret.result = false
				users_flushToken() //remove anyexpired tokens
				if(!window.location.href.includes(host_index())){
					nav_toLogin()
				}


				//
			}
			else{
				//ret = data
				console.log('USER IS ALREADY LOGGED IN')
				//window.location.href = host_create()
				ret.result = true
				if(window.location.href.includes(host_create())){
					$('#profile_button').text(users_getUsername())
					projectSettings_prepThenNavToProjects(project_project)
				}
			}


		},
		contenttype: "application/json"
	});
}

function http_addTokenToHeader(){
	var token = window.localStorage.getItem('token');
	if (token) {
		var tok = JSON.parse(token).token
	  $.ajaxSetup({
	    headers: {
	      'x-access-token': tok
	    }
	  });
	}
}
