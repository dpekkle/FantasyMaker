goog.provide('show')
goog.require('play_httpRequests')


$(document).ready()
{
  console.log($.cookie("FM_playUsername"))
	console.log($.cookie("FM_playProject"))
  $.when(getProject()).done(function(){
    prepareForGame()
    $('#mainContent').show()
    $('#loader').hide()
      $('.progressbutton').show();
  })
}

function getProject(){
  var uname = $.cookie("FM_playUsername")
  var proj = $.cookie("FM_playProject")
  //console.log(uname + ' ' + proj)
  $.when(authenticate()).done(function(){
    $.when(load(uname,proj)).done(function(){
      http_setupCy()
      return
    })
  })
}
