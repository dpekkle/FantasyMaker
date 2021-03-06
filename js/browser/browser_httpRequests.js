/*
	Name: Browser_httpRequests.js
	Created By: Darryl
	Purpose: To handle http requests for the browser module
*/

goog.provide('browser_httpRequests')
goog.require('users')
goog.require('host')
goog.require('play_httpRequests') //reusing authenticate for guest

function browser_httpRequests_getProjectsForBrowser(ret,pub){
	browser_httpRequests_addTokenToHeader()
	return $.ajax({
		url: '/getAllUsersProjects',
		data: {
			'published' : pub,
		},
		cache: false,
		type: 'GET',
		success: function(data) {
		//	if(browser_httpRequests_handleAuth(data)){
				ret.data = data
		//	}
			//console.log('getAllUsersProjects loaded')
		},
		contenttype: "application/json"
	});
}

function browser_httpRequests_addTokenToHeader(){
	var token = window.localStorage.getItem('play-token');
	if (token) {
		var tok = JSON.parse(token).token
	  $.ajaxSetup({
	    headers: {
	      'x-access-token': tok
	    }
	  });
	}
}

//examines response from server for authentication validation
function browser_httpRequests_handleAuth(res){
	console.log('server returned' + res)
	if(res === 'EXPIRED' || res === 'NO_TOKEN'){
		if(res === 'EXPIRED'){
			console.log('browser_http_handleAuth(): Token is expired')
		}
		else{
			console.log('browser_http_handleAuth(): No Token')
			$.when(authenticate()).done(function(){
				return
			})
		}

		users_flushToken() //remove anyexpired tokens
		browser_httpRequests_redirectHome()
		return false
	}
	return true
}

function browser_httpRequests_redirectHome(){
	window.location = host_create()
}
