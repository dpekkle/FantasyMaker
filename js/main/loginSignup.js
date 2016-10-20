goog.provide('loginSignup')
goog.require('prompts')
goog.require('http_loginSignup')

function project_login(){

		myModal.prompt("Log In", "Log in and continue creating!", [{name: "Username", default: "", type: "text"},{name: "Password", default: "", type: "password"}],
				function(results){
				},
				function(results){

					results[0] = results[0].trim()
					var regex = new RegExp("^[a-zA-Z0-9]+$");
					if(regex.test(results[0]) === false){
						myModal.warning("Usernames can only contain letters and numbers")
						return false
					}

					var res = {
						"data" : {}
					}
					$.when(http_login(results[0],results[1],res)).done(function(){

						if(res.data !== 'INVALID_USERNAME' && res.data !== 'INVALID_PASSWORD' && res.data !== 'SERVER_ERR'){
							project_successfulLogin(res)
							Materialize.toast("Welcome back " + users_getUsername() + "!", 3000, 'rounded')
						}
						else{
							myModal.warning("Login details were invalid. Please try again.");
						}
					})
		});
}

function project_successfulLogin(res){
	users_flushToken()
	window.localStorage.setItem('token', JSON.stringify(res.data))
	$('#prompt-modal').closeModal();
	console.log(users_getUsername() + ' logged in')
	$('#profile_button').text(users_getUsername())
	projectSettings_prepThenNavToProjects(project_project)
}

function project_signUp(){

		myModal.prompt("Sign Up", "Become a game creator with FantasyMaker!", [{name: "Username", default: "", type: "email"},{name: "Password", default: "", type: "password"},{name: "Confirm Password", default: "", type: "password"}],
				function(results){

					},
					function(results){
						results[0] = results[0].trim()
						var regex = new RegExp("^[a-zA-Z0-9]+$");
						if(results[0] === '' || results[1] === '' || results[2] ===''){
							myModal.warning('All fields must be filed out.')
							return false
						}
						else if(results[1] !== results[2]){
							myModal.warning('Your password and confirmation password do not match.')
							return false
						}
						else if(regex.test(results[0]) === false){
							myModal.warning("Usernames can only contain letters and numbers")
							return false
						}
						else{
							var newUser = users_generateNewUser()
							newUser.username = results[0]
							newUser.password = results[1]
							var ret = ''
							$.when(http_signUp(newUser,ret)).done(function(ret){
								if(ret === 'VALID'){
									Materialize.toast("Welcome to FantasyMaker " + results[0] + ".", 3000, 'rounded')
									$('#prompt-modal').closeModal();

									//sign in automatically
									var res = {
										"data" : {}
									}
									$.when(http_login(newUser.username,newUser.password,res)).done(function(){

										if(res.data !== 'INVALID_USERNAME' && res.data !== 'INVALID_PASSWORD' && res.data !== 'SERVER_ERR'){
											project_successfulLogin(res)
										}
										else{
											myModal.warning("Login details were invalid. Please try again.");
										}
									})
								}
								else{
									myModal.warning('That username has already been taken. Please try another username')
								}
							})
						}
				});
}

function project_logOut(){

		myModal.prompt("Log Out", "Are you sure you wish to log out? Any unsaved progress will be lost.",
		[],
		function(results)
		{
			console.log(users_getUsername() + ' logged out')

			nav_toLogin()
			users_flushToken()
			project_project = initEmptyProject('none','none')
			http_redirectHome()
		},
		function(results) //this is the verification function
		{
			//save project locally?
			return true
		});
}
