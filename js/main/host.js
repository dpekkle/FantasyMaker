goog.provide('host')

var host_location = 'http://localhost:3000/'
//var host_location = 'http://fantasymakergame.com/'

function host_create(){
  return host_location + 'create.html'
}

function host_browse(){
  return host_location + 'browse.html'
}

function host_play(){
  return host_location + 'play/'
}
