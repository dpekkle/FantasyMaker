
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
