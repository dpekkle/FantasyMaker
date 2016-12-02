/*
	Name: show
	Created By: Darryl
	Purpose: to show the playgae=me interface in play module
*/

goog.provide('show')
goog.require('play_httpRequests')


$(document).ready()
{
  console.log($.cookie("FM_playUsername"))
	console.log($.cookie("FM_playProject"))
  getProject(function(){
    console.log("get project done, showing")
    $('#loader').hide()
    $('.progressbutton').show();
  })

}

function getProject(outer_callback){
  var uname = $.cookie("FM_playUsername")
  var proj = $.cookie("FM_playProject")
  //console.log(uname + ' ' + proj)
  var ret = {}
  authenticate(ret,function(){
    load(uname,proj,function(){
      console.log("before prepare game")
      console.log(project_project)
      prepareForPlayGame()
      outer_callback()
    })
  })

}
