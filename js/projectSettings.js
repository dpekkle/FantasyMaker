goog.provide('projectSettings')
goog.require('httpRequests')


//on input event for create project button, enables done button on input
$('#projName').on('input',function(){
  if( $('#projName').val() ){
      $('#projNameAcceptButton').removeClass('disabled')
  }
  else{
    if( !$('#projNameAcceptButton').hasClass('disabled') ){
      $('#projNameAcceptButton').addClass('disabled')
    }
  }
})

function projectSettings_populateProjectsList(username){
  console.log('Looking up projects made by ' + username)
  $('#projectsList').empty()
  //obj to pass by reference with
  var obj = {
    "names" : [] //will hold names of users projects
  }
  $.when(http_getUsersProjects(username,obj)).done(function(){
    console.log(obj.names)
    for(var i = 0; i<obj.names.length; i++){
      if(obj.names[i].name !== 'system.indexes'){
        $('#projectsList').append(projectSettings_generateProjectCard(obj.names[i].name))
      }
    }
  });
}

function projectSettings_generateProjectCard(name){
    var html =   '<li><div class="row">'+
                    '<div class="col s1"><p></p></div>'+
                '<div class="card small hoverable col s4" style="height: 80%;">' +
                  //  '<div class="card-image waves-effect waves-block waves-light">'+
                    //  '<img class="activator" src="http://www.planetware.com/photos-large/CH/switzerland-matterhorn.jpg">'+
                    //'</div>'+
                    '<div class="card-content">'+
                      '<span class="card-title activator grey-text text-darken-4">'+name+'<i class="material-icons right">more_vert</i></span>'+
                      '<p><a href="#" class="btn" onclick=http_load('+ "'" +name + "'" + '),showMainContent()>Load</a></p>'+
                    '</div>'+
                    '<div class="card-reveal" >'+
                      '<span class="card-title grey-text text-darken-4">'+name+'<i class="material-icons right">close</i></span>'+
                      '<p>Date Created: </p>'+
                      '<p>Last Modified: </p>'+
                      '<a class="btn-floating btn-small waves-effect waves-light red" onclick=projectSettings_deleteProject('+ "'"+'Admin'+"','"+ name + "'" + ')><i class="small material-icons">delete</i></a>'+
                    '</div>'+
                  '</div></div></li>'
    return html
}

function projectSettings_generateProjectCard2(name){
  var html = '<div class="col s2">'+
              '<h2 class="header">'+name+'</h2>'+
              '<div class="card horizontal">'+
                '<div class="card-image">'+
                  '<img src="http://www.planetware.com/photos-large/CH/switzerland-matterhorn.jpg">'+
                '</div>'+
                '<div class="card-stacked">'+
                  '<div class="card-content">'+
                    '<p>I am a very simple card. I am good at containing small bits of information.</p>'+
                  '</div>'+
                  '<div class="card-action">'+
                    '<a href="#">load</a>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'
  return html
}

function showProjectSettings(){
  if($('#mainContent').hasClass('hide')){
    $('#projectMain').addClass('hide')
    $('#mainContent').removeClass('hide')
  }
  else{
    $('#projectMain_title').text("Admin's Projects")
    projectSettings_populateProjectsList("Admin")
    $('#mainContent').addClass('hide')
    $('#projectMain').removeClass('hide')
  }
}

function showMainContent(){
  $('#projectMain').addClass('hide')
  $('#mainContent').removeClass('hide')

}

function projectSettings_closeOverlay(){
  $('#projName').val("")
  $.when($('#newProject-modal').closeModal()).done(showMainContent())
}

function projectSettings_deleteProject(username,projName){
  $.when(http_deleteProject(username,projName)).done(projectSettings_populateProjectsList(username))
  Materialize.toast("Project '" + projName + "' Deleted", 3000, 'rounded')
}
