/*
	Name: projectSettings
	Created By: Darryl
	Purpose: to handle the display of project settings
*/

goog.provide('projectSettings')
goog.require('httpRequests')
goog.require("prompts")
goog.require('users')
goog.require('navigation')

var projectSettings_activePage = 1
var projectSettings_amtPages = 1
var projectSettings_userProjects = {
  "projects" : []
}

function projectSettings_prepThenNavToProjects(project_project){

  $('#currentProject_header').text(project_project.title)
  $('#currentProject_title').text(project_project.title)
  $('#currentProject_author').text(project_project.author)
  $('#currentProject_desc').text(project_project.description)
  $('#currentProject_dateCreated').text(project_project.dateCreated)
  $('#currentProject_lastModified').text(project_project.lastModified)
  $('#currentProject_published').text(project_project.published)
  $('#currentProject_imageLink').text(project_project.imageLink)
  $('#currentProject_backgroundImageLink').text(project_project.backgroundLink)
  $('#currentProject_resolution').text('Width: ' + project_project.resolution.x + 'px Height: ' +project_project.resolution.y + 'px')

  if(project_project.published === true){
    $('#currentProject_gameLink').attr('href',project_project.gameLink)
    $('#currentProject_gameLink').text(project_project.gameLink)
    $('#currentProject_noGameLink').hide()
    $('#currentProject_gameLink').show()
    $('#publishButton').removeClass('disabled')
    $( "#pubSwitch" ).prop('checked',true)
  }
  else{
    $('#currentProject_gameLink').hide()
    $('#currentProject_noGameLink').show()
    $('#publishButton').addClass('disabled')
    $( "#pubSwitch" ).prop('checked',false)


  }

  if(project_project.projectName !== 'none'){
    nav_isProject = true
  }


  $.when(projectSettings_prepareProjectsPage()).done(nav_toProjects())
}

function projectSettings_prepThenNavToMain(projName){
  console.log("projectSettings_prepThenNavToMain scope")
  console.log (project_project.project_templates);
  //Make Project List Smaller Now that project setting is there
  $('#project-list-container').removeClass('l12');
  $('#project-list-container').addClass('l8');
  $.when(http_load(projName)).done(function(){
    console.log("$when scope")
    console.log (project_project.project_templates);

    nav_isProject = true
    defaultState();
    nav_toMain()
    projectSettings_activePage = 1;
    resizeCanvas()
 })
}

function projectSettings_prepareProjectsPage(){
  projectSettings_activePage = 1
  projectSettings_userProjects = {
    "projects" : []
  }
  console.log('showing ' + users_getUsername() + 'projects')
  $.when(http_getUsersProjects(users_getUsername(),projectSettings_userProjects)).done(function(){
    console.log(projectSettings_userProjects)
    //set up existing projects
    projectSettings_populateProjectsList(users_getUsername(),1)
  })
}

function projectSettings_populateProjectsList(username,pageNumber){
  console.log('populateProjectsList called')
  $('#projectsList1').empty()
  $('#projectsList2').empty()

  projectSettings_populateProjectPage(projectSettings_userProjects,pageNumber)
}

function projectSettings_populateProjectPage(obj,pageNumber){
  console.log('all projects: ')
  console.log(obj)
  if(obj.projects.length === 0){
    console.log('projectSettings_populateProjectPage() error: projNames[] is null')
  }

  //empty paginations
  $('.pp').remove()

  //define amount of pages users projects take up
  projectSettings_amtPages = Math.ceil(obj.projects.length / 4)
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
  if(end > obj.projects.length){
    end = obj.projects.length
  }

  console.log('range: ' + start + ' ' + end)
  //add project cards to UI
  for(var i = start; i<end; i++){
  //  console.log("adding: " + i + ' ' + obj.projects[i].projName)
  //  if(obj.projects[i].projName !== currProjName){
      if($('#projectsList1 li').length < 2){
          //console.log(obj.projects[i].projName + " to list 1")
        $('#projectsList1').append(projectSettings_generateProjectCard(obj.projects[i]))
      }
      else{
        //console.log(obj.projects[i].projName + " to list 2")
        $('#projectsList2').append(projectSettings_generateProjectCard(obj.projects[i]))
      }
  //  }

  }
  $('.pubTT').tooltip({delay: 50});
  //console.log(projectSettings_userProjects)
}

function projectSettings_generateProjectCard(project){
    //cannot pass whitespace names into onclick functions, replace whitespace w/ '_'
    //var proj = project.projName.split('_').join(' ')
    var pubHTML
    if(project.published === true){
      //var pubExpl = 'The world can view your project!'
      pubHTML =   '<div id="'+project.projName+ '_pub' +'">'
                  + '<p style="color: green;">Published</p>'
                  +   '<p>Link to play game:'
                  +   '<span><a href="'+project.gameLink+'" target="_blank">'+project.gameLink+'</a></span>'
                  + '</p>'
                  +'</div>'

    }
    else{
      var pubExpl = 'Load your project and view the settings tab to publish your project for the world to see!'
      pubHTML = '<p id="'+project.projName+ '_pub' +'" class="pubTT tooltipped" data-position="bottom" data-delay="50" data-tooltip="'+pubExpl+'" style="color: red;">Project is not published</p>'
    }
    var html =   '<li>'+
                    //'<div class="row">'+
                      '<div class="col s1"><p></p></div>'+
                      '<div class="card hoverable col s12 m4" style="height: 250px;">' +
                          '<div class="card-content" style="position: relative; height: 250px;">'+
                            '<span class="card-title activator grey-text text-darken-4 truncate ' + project.projName + '-title" style="position: relative; width: 72%; display:inline-block">'+project.title+'</span><i class="card-title activator material-icons right">more_vert</i>'+
                            // '<div class="row"><p class="truncate">Title: ' +project.title+ '</p></div>'+
                            '<div class="row"><p class="truncate">Author: '+project.author+'</p></div>'+
                            '<div class="row">' +
                              '<a href="#" class="btn col s8 offset-s2" style="position: absolute; bottom: 100px;" onclick=projectSettings_prepThenNavToMain('+ "'" + project.projName + "'" + ')>Load</a>'+
                            '</div>'+
                          '</div>'+
                          '<div class="card-reveal" >'+
                            '<span class="card-title grey-text text-darken-4 truncate ' + project.projName + '-title" style="width: 72%; display: inline-block;">'+project.title+'</span>'+ '<i class="card-title material-icons right">close</i>' +
                            '<p>Date Created: ' + project.dateCreated + '</p>'+
                            '<p>Last Modified: ' + project.lastModified + '</p>'+
                            pubHTML+
                            '<a class="btn-floating btn-small waves-effect waves-light red" onclick=projectSettings_deleteProject('+ "'"+users_getUsername()+"','"+ project.projName + "','"+ project_project.projectName + "'" + ')><i class="small material-icons">delete</i></a>'+
                          '</div>'+
                        '</div>'+
                      //'</div>'+
                  '</li>'
    return html
}





function projectSettings_switchPage(page,elem){

  //check is there is a page left or right
  if(page < 0 || $(elem).hasClass('disabled')){
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


function projectSettings_deleteProject(username,projToDelete,currProj,display){

  //var display = projName.split('_').join(' ')
  myModal.prompt("Delete Project", "Are you sure you wish to delete this project? This cannot be undone.", [],
      function(results){
        projectSettings_activePage = 1 //reset pagination of projects
        //case someone deletes current project
        if(projToDelete === currProj){
          $('#currentProject').hide()
          //Make Project List Bigger Now that project setting isn't there
          $('#project-list-container').removeClass('l9');
          $('#project-list-container').addClass('l12');
        }
        $.when(http_deleteProject(username,projToDelete)).done(function(){
          projectSettings_userProjects = {
            "projects" : []
          }
          $.when(http_getUsersProjects(username,projectSettings_userProjects)).done(function(){
            projectSettings_populateProjectsList(username,1)
            Materialize.toast("Project Deleted", 3000, 'rounded')
          })
        })
      },
      function(results){
        return true
      }
  );



}
