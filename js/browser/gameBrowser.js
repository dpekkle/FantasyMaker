goog.provide('gameBrowser')
goog.require('browser_httpRequests')

/*
  gameBrowser_allProjects is an obj that looks like this:

  gameBrowser_allProjects = {
    'users' : [
      {
        'name' : <a users name>,
        'projects' : [
          'authur' : <author of project>, NOTE: same as name by default, but will let user set this in project settings
          'description' : <description of project>,
          'gameLink' : <link to play module>,
          'imageLink': <link to image for project card>,
          'projName' : <unique id of project in db>,
          'title' : <title of project> NOTE: same as projName by default, but will let user set this in project settings
        ]
      }
    ]
  }

*/

var gameBrowser_allProjects //obj that will hold all users and their project names
gameBrowser_loadUsers()//calling on load just for demo purposes, not sure if thats what you want.

function gameBrowser_loadUsers(){
  //pass by reference in js only works on contents of objs
  var res = {
    "data" : {} //stores the results of the http request temporarily
  }
  $.when(browser_httpRequests_getProjectsForBrowser(res,true)).done(function(){
    gameBrowser_allProjects = res.data //copy http response to gameBrowser_allProjects
    console.log(gameBrowser_allProjects)
  })

}

function gameBrowser_addGame(gameObj){

    var gameTitle;
    var gameAuthor;
    var gameDescription;
    var gameImage;
    var gameLink;

var gameCardHtml = '<div class="col s12 m4 l3"> '
                   +     '<div class="card medium"> <div class="card-image">'
                   +             ' <img src="http://materializecss.com/images/sample-1.jpg">'
                   +                 '<span class="card-title">Game Title Goes Here <br/><span style="font-size: 18px;"> Author: Jon Doe</span></span>'
                   +             '</div>'
                   +             '<div class="card-content"> '
                   +                 '<p>Game Description Will Go Here</p> '
                   +             '</div> '
                   +             '<div class="card-action">'
                   +                 ' <a href="#">Play Game</a>'
                   +             ' </div> '
                   +     '</div> '
                   + '</div>';

    $('#games-list').append(gameCardHtml);
}
