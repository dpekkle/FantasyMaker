goog.provide('http_loginSignup')

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
