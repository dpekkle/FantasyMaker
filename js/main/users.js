/*
	Name: users
	Created By: Darryl
	Purpose: defines general actions with user tokens
*/

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

function users_setToken(data){
  $.when(window.localStorage.setItem('token', JSON.stringify(data))).done()
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
