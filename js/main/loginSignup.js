/*
	Name: loginSignup
	Created By: Darryl
	Purpose: to handle displaying of login/signup modals
*/

goog.provide('loginSignup')
goog.require('prompts')
goog.require('http_loginSignup')
//goog.provide('host')

var loginSignupState = false //not logged in

$(document).ready()
{
	if(!window.location.href.includes(host_create() && !window.location.href.includes(host_location + '/play'))){
		index_autoLogin()
	}
}

function project_login(){
	console.log('sign in')
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
	//users_flushToken()
	window.localStorage.setItem('token', JSON.stringify(res.data))
	$('#prompt-modal').closeModal();
	console.log(users_getUsername() + ' logged in')
	$('#profile_button').text(users_getUsername())
	window.location.href = host_create()
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

function createLinkClicked(){
	//http_validateTokenIndex()
	if(loginSignupState === true){
		//go to create.html
		window.location.href = host_create()
	}
	else if(loginSignupState === false){
		//login modal
		project_login()
	}
}

function index_autoLogin(){
	var ret={}
	$.when(http_validateToken(ret)).done(function(){
		console.log(ret.result)
		loginSignupState = ret.result
		index_loginSignup_setupState(loginSignupState)

	})

}

function index_loginSignup_setupState(state){
	if(state === true){
		//hide login/signUp
		$('.login_button').hide()
		$('.signup_button').hide()
		//show project,profile
		$('.project_button').show()
		$('.profile_button').text(users_getUsername())
		$('.profile_button').show()
	}
	else if(state === false){
		//show login/signUp
		$('.login_button').show()
		$('.signup_button').show()
		//hide project,profile
		$('.project_button').hide()
		$('.profile_button').hide()
	}
}

function project_logOut(){

		myModal.prompt("Log Out", "Are you sure you wish to log out? Any unsaved progress will be lost.",
		[],
		function(results)
		{
			console.log(users_getUsername() + ' logged out')
			loginSignupState = false
			index_loginSignup_setupState(loginSignupState)
			users_flushToken()
			nav_toLogin()


			//project_project = initEmptyProject('none','none')
			//http_redirectHome()
		},
		function(results) //this is the verification function
		{
			//save project locally?
			return true
		});
}
