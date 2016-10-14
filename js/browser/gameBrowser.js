goog.provide('gameBrowser');
goog.require('browser_httpRequests');

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

var gameBrowser_allProjects; //obj that will hold all users and their project names
gameBrowser_loadUsers(); //load on page load

//Demo
function gameBrowser_loadUsers(){
    //pass by reference in js only works on contents of objs
    var res = {
        "data" : {} //stores the results of the http request temporarily
    };
    +  $.when(browser_httpRequests_getProjectsForBrowser(res,true)).done(function(){
        gameBrowser_allProjects = res.data; //copy http response to gameBrowser_allProjects
        console.log(gameBrowser_allProjects);
      //  gameBrowser_displayAllGames(gameBrowser_allProjects);


        //old way of retrieving projects
         for(var u = 0; u < gameBrowser_allProjects.users.length; u++){
            for (var p = 0; p < gameBrowser_allProjects.users[u].projects.length; p++){
                gameBrowser_displayGame(gameBrowser_allProjects.users[u].projects[p]);
                console.log(gameBrowser_allProjects.users[u].projects[p]);

            }//iterate through user's projects
        } //iterate through users
         
        $('.loading-content').hide();
        $('#main-content').show();

    })

}

 function gameBrowser_displayAllGames(gameObj){
     $('#recommended-games-list').empty();
     var allGamesList = $('#all-games-list');
         allGamesList.empty();


     if(gameBrowser_allProjects != {})
         for(var p = 0; p<gameBrowser_allProjects.length; p++)
             gameBrowser_displayGame(gameBrowser_allProjects[p], p);
     else
         $('#main-content').innerHTML = "<h1>There are no games to show</h1>";


     //Check if there are any user created games
     if(allGamesList.html == "")
         allGamesList.append(
             "<h4 style='color: #fff; margin-left: 10px;'>Be the first to publish a game!</h4> <a class='btn btn-medium waves-effect waves-light grey' href='create.html'>Create a Game</a>"
         )

 }

function gameBrowser_filterByUsername(gameObj, username){

    var resultsList = $('#all-games-list');
    resultsList.empty();

    var gamesFound = false;
    /*if(gameBrowser_allProjects != {})
        for(var u = 0; u < gameBrowser_allProjects.users.length; u++)
            if(gameBrowser_allProjects.users[u].name.includes(username)) {
                gamesFound = true;
                for (var p = 0; p < gameBrowser_allProjects.users[u].projects.length; p++)
                    gameBrowser_displayGame(gameBrowser_allProjects.users[u].projects[p]);
            }
    */
    if(!gamesFound)
        resultsList.append("<h4 style='color: #fff; margin-left: 10px;'>No games found with a username matching <span style='color: #00FEBC'>" +  username + "</span></h4>");

}


function gameBrowser_displayGame(gameObj, projNumber){
    var gameCardHtml = '<div class="col s12 m6 l3">'
        +     '<div class="card medium z-depth-3 darken-2"> <div class="card-image" id="project-' + projNumber + '-image">'
        +                 '<span class="card-title"><p>' + gameObj.title + '</p><p style="font-size: 18px;">Created By: '+ gameObj.author +'</p></span>'
        +             '</div>'
        +             '<div class="card-content white-text"> '
        +                 '<p>'+ gameObj.description +'</p> '
        +             '</div> '
        +             '<div class="card-action">'
        +                 '<a href="'+ gameObj.gameLink +'"><span class="accent-color">Play Game</span></a>'
        +             ' </div> '
        +     '</div> '
        + '</div>';

    //Append to recommended list if we made the game
    if(gameObj.author == "Admin")
        $('#recommended-games-list').append(gameCardHtml);
    else
        $('#all-games-list').append(gameCardHtml);

    var displayImg = $('#project-'+ projNumber +'-image');
    displayImg.css('background-image', 'url(' + gameObj.imageLink + ')');
    displayImg.css('background-size', 'cover');
}


//Run search on text-field update
var timerid;
$("#search-bar").on("input",function(e){
    var value = $(this).val();
    if($(this).data("lastval")!= value){
        $(this).data("lastval",value);
        clearTimeout(timerid);

        timerid = setTimeout(function() {
            var input = $('#search-bar').val();
            $('#all-games-list').empty();
            if(input != "")
                gameBrowser_filterByUsername(gameBrowser_allProjects, input);
            else
                gameBrowser_displayAllGames(gameBrowser_allProjects);

        },250);

    }
});
