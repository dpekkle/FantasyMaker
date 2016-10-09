goog.provide('projectSettings')
goog.require('httpRequests')
goog.require("prompts")
goog.require('users')

var projectSettings_activePage = 1
var projectSettings_amtPages = 1
var projectSettings_userProjectsNames = {
  "names" : []
}


function projectSettings_populateProjectsList(username,pageNumber){
  console.log('populateProjectsList called')
  $('#projectsList1').empty()
  $('#projectsList2').empty()
  projectSettings_populateProjectPage(projectSettings_userProjectsNames,pageNumber)
}

function projectSettings_populateProjectPage(obj,pageNumber){
  if(obj.names.length === 0){
    console.log('projectSettings_populateProjectPage() error: projNames[] is null')
  }

  //empty paginations
  $('.pp').remove()

  //define amount of pages users projects take up
  projectSettings_amtPages = Math.ceil(obj.names.length / 4)
  //console.log("Amt pages: " + projectSettings_amtPages + ' ' + obj.names.length / 4)

  //add pagination pages to ui
  var pages = ''
  for(var i = 1; i<=projectSettings_amtPages; i++){
    var id = 'pp_' + i
    if($('#'+id).length === 0){
      if(i === pageNumber){
        pages += '<li id="' + id + '" class="active pp"><a onclick=projectSettings_switchPage('+i+')>'+i+'</a></li>'
      }
      else{
        pages += '<li id="' + id + '" class="waves-effect pp"><a onclick=projectSettings_switchPage('+i+')>'+i+'</a></li>'
      }
    }

  }
  $('#projectsPaginationLeft').after(pages)

  if(projectSettings_activePage === 1 && projectSettings_amtPages > projectSettings_activePage){
    //console.log('page one')
    projectSettings_disableLeftPagination()
    projectSettings_enableRightPagination()
  }
  else if(projectSettings_activePage === 1 && projectSettings_amtPages === projectSettings_activePage){
    projectSettings_disableLeftPagination()
    projectSettings_disableRightPagination()
  }
  else if(projectSettings_activePage === projectSettings_amtPages){
    //console.log('last page')
    projectSettings_disableRightPagination()
    projectSettings_enableLeftPagination()
  }
  else{
    //console.log('middle page')
    projectSettings_enableLeftPagination()
    projectSettings_enableRightPagination()
  }

  //find start index based on page number
  var start
  var end
  if(pageNumber === 1){
    end = 4
  }
  else{
    end = pageNumber * 4
  }
  start = end - 4
  //find end based on start index
  //var end = start + 4
  if(end > obj.names.length){
    end = obj.names.length
  }

  //console.log(start + ' ' + end)
  //add project cards to UI
  for(var i = start; i<end; i++){
    //console.log("adding: " + i + ' ' + obj.names[i].name)

      if($('#projectsList1 li').length < 2){
          //console.log(obj.names[i].name + " to list 1")
        $('#projectsList1').append(projectSettings_generateProjectCard(obj.names[i].name))
      }
      else{
        //console.log(obj.names[i].name + " to list 2")
        $('#projectsList2').append(projectSettings_generateProjectCard(obj.names[i].name))
      }
  }
}



function projectSettings_generateProjectCard(name){
    //cannot pass whitespace names into onclick functions, replace whitespace w/ '_'
    var proj = name.split(' ').join('_')
    var html =   '<li>'+
                    //'<div class="row">'+
                      '<div class="col s1"><p></p></div>'+
                      '<div class="card hoverable col s4" style="height: 200px;">' +
                        //  '<div class="card-image waves-effect waves-block waves-light">'+
                          //  '<img class="activator" src="http://www.planetware.com/photos-large/CH/switzerland-matterhorn.jpg">'+
                          //'</div>'+
                          '<div class="card-content">'+
                            '<span class="card-title activator grey-text text-darken-4" style="position: relative;">'+name+'<i class="material-icons right">more_vert</i></span>'+
                            '<div class="row"><p>filler1</p></div>'+
                            '<div class="row"><p>filler2</p></div>'+
                            '<div class="row" >' +
                              '<a href="#" class="btn col s8 offset-s2" onclick=http_load('+ "'" +proj + "'" + '),project_showMainContent()>Load</a>'+
                            '</div>'+
                          '</div>'+
                          '<div class="card-reveal" >'+
                            '<span class="card-title grey-text text-darken-4">'+name+'<i class="material-icons right">close</i></span>'+
                            '<p>Date Created: </p>'+
                            '<p>Last Modified: </p>'+
                            '<a class="btn-floating btn-small waves-effect waves-light red" onclick=projectSettings_deleteProject('+ "'"+users_getUsername()+"','"+ proj + "'" + ')><i class="small material-icons">delete</i></a>'+
                          '</div>'+
                        '</div>'+
                      //'</div>'+
                  '</li>'
    return html
}

function showProjectSettings(){
  projectSettings_activePage = 1
  $.when(http_getUsersProjects(users_getUsername(),projectSettings_userProjectsNames)).done(function(){
    console.log(projectSettings_userProjectsNames)
    projectSettings_populateProjectsList(users_getUsername(),1)
  })

  if(!$('#mainContent').hasClass('hide')){
    $('#mainContent').addClass('hide')
  }

  if($('#projectMain').hasClass('hide')){
    $('#projectMain').removeClass('hide')
  }
}

function showMainContent(){
  projectSettings_activePage = 1

  if($('#mainContent').hasClass('hide')){
    $('#mainContent').removeClass('hide')
  }

  if(!$('#projectMain').hasClass('hide')){
    $('#projectMain').addClass('hide')
  }
  resizeCanvas()
}

function projectSettings_switchPage(page,elem){

  //check is there is a page left or right
  if(page < 0 || $(elem).hasClass('disabled')){
    console.log('button disabled')
    return
  }

  $('#pp_' + projectSettings_activePage).removeClass('active')
  $('#pp_' + projectSettings_activePage).addClass('waves-effect')
  $('#pp_' + page).removeClass('waves-effect')
  $('#pp_' + page).addClass('active')
  projectSettings_activePage = page

  //console.log(projectSettings_activePage + ' ' + projectSettings_amtPages)

  projectSettings_populateProjectsList(users_getUsername(),page)
}

function projectSettings_enableLeftPagination(){
  if( $('#projectsPaginationLeft').hasClass('disabled') ){
    $('#projectsPaginationLeft').addClass('waves-effect')
    $('#projectsPaginationLeft').removeClass('disabled')
  }
}

function projectSettings_disableLeftPagination(){
  if( !$('#projectsPaginationLeft').hasClass('disabled') ){
    $('#projectsPaginationLeft').addClass('disabled')
    $('#projectsPaginationLeft').removeClass('waves-effect')
  }
}

function projectSettings_enableRightPagination(){
  if( $('#projectsPaginationRight').hasClass('disabled') ){
    $('#projectsPaginationRight').addClass('waves-effect')
    $('#projectsPaginationRight').removeClass('disabled')
  }
}

function projectSettings_disableRightPagination(){
  if( !$('#projectsPaginationRight').hasClass('disabled') ){
    $('#projectsPaginationRight').addClass('disabled')
    $('#projectsPaginationRight').removeClass('waves-effect')
  }
}

function projectSettings_openOverlay(){
    

}

function projectSettings_deleteProject(username,projName){
  projectSettings_activePage = 1

  $.when(http_deleteProject(username,projName)).done(function(){
    $.when(http_getUsersProjects(username,projectSettings_userProjectsNames)).done(function(){
      projectSettings_populateProjectsList(username,1)
      Materialize.toast("Project '" + projName + "' Deleted", 3000, 'rounded')
    })
  })
}
