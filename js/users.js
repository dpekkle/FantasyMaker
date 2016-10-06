goog.provide('users')

function users_generateNewUser(){
  var obj = {
    "username" : "none",
    "password" : "none"
  }
  return obj
}

function users_getUsername(){
  var token = window.localStorage.getItem('token');
  if(token){
    return JSON.parse(window.localStorage.getItem('token')).user
  }
  return 'INVALID'
}

function users_flushToken(){
  window.localStorage.setItem('token','')
}

function users_getToken(){
  var token = window.localStorage.getItem('token');
  if(token){
    return JSON.parse(window.localStorage.getItem('token'))
  }
  return 'INVALID'
}
