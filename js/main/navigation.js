goog.provide('navigation')
goog.require('users')

var nav_isProject = false

function nav_toLogin(){
  nav_isProject = false
  window.location.href = host_index()
  //nav_hideProjects()
  //nav_hideMain()
  //nav_navBarLoggedOut()
  //nav_showLogin()
}

function nav_toProjects(){
  nav_hideLogin()
  nav_hideMain()
  nav_navBarLoggedIn()
  nav_showProjects()
}

function nav_toMain(){
  nav_hideLogin()
  nav_hideProjects()
  nav_showMain()
}

function nav_hideLogin(){
  $('#requestLogin').hide()
}

function nav_hideProjects(){
  //$('#currentProject').hide()
  $('#projects').hide()
}

function nav_hideMain(){
  $('#mainContent').hide()
}

function nav_showLogin(){
  $('#requestLogin').show()
}

function nav_showProjects(){
    if(nav_isProject === true){
      console.log('isProject')
      if($('#currentProject').hasClass('hide')){
        $('#currentProject').removeClass('hide')
      }
      $('#currentProject').show()
    }
    else{
      console.log('noProject')
    }



  if($('#projects').hasClass('hide')){
    $('#projects').removeClass('hide')
  }
  $('#projects').show()
}

function nav_showMain(){
  if($('#mainContent').hasClass('hide')){
    $('#mainContent').removeClass('hide')
  }
  $('#mainContent').show()
  resizeCanvas()
}

function nav_navBarLoggedIn(){
  //set values
  $('.profile_button').text(users_getUsername())
	//$('#projects_title').text(users_getUsername() + "'s Projects:")

  //show/hide
  $('.login_button').hide()
  $('.signup_button').hide()

  if($('.project_button').hasClass('hide')){
    $('.project_button').removeClass('hide')
  }
  $('.project_button').show()



  if($('.profile_button').hasClass('hide')){
    $('.profile_button').removeClass('hide')
  }
  $('.profile_button').show()

}

function nav_navBarLoggedOut(){
  //set values
  $('.profile_button').text('')

  //show/hide
  $('.project_button').hide()
  $('.profile_button').hide()
  $('.login_button').show()
  $('.signup_button').show()
}
