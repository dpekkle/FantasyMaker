goog.provide('gameAttributes')
goog.require('project')

function GameAttribute(parent_path, parent_level, name, attID, is_leaf, value){
    this.name = name;
    this.is_leaf = is_leaf;
    this.value = value;
    if(parent_path != null){
        this.level = parent_level + 1;
        this.path = parent_path + "_" + attID;
    }
    else{
        this.path = attID;
        this.level = 0;
    }
    this.children = [];

}

function gameAttributes_addAttributeValue(parent_path, child_name, value) {
    gameAttributes_addChild(parent_path, child_name, true, value);
}

function gameAttributes_addAttributeClass(parent_path, child_name) {
    gameAttributes_addChild(parent_path, child_name, false);
}

function gameAttributes_addChild(parent_path, child_name, is_leaf, value){
    //find parent to add child to
    var parent = gameAttributes_find(parent_path);
    var newID = generateID();

    parent[newID] = new GameAttribute(parent.path, parent.level, child_name, newID, is_leaf, value);
    var child = parent[newID];

    parent.children.push(newID);
    console.log("New Nested attribute added under: " + parent.path);
    console.log("New Attribute ID: " + newID);

    //no need for inner list if the node is a leaf
    var newAttributeHTML;
    var pathString = "\'" + child.path + "\'";
    if (is_leaf)
        newAttributeHTML = '<li class="' + newID  + ' margin"><a onclick="gameAttributes_display(' + pathString + ')">' + child_name + '</a></li>';
    else
        newAttributeHTML = '<li class="' + newID  + ' margin"><a onclick="gameAttributes_display(' + pathString + ')">' + child_name + '</a><ul id="' + child.path + '-inner_list"></ul></li>';

    $('#' + parent.path + '-inner_list').append(newAttributeHTML);
}

//navigate to attribute from provided path
function gameAttributes_find(s_path){
    path = s_path.split("_");
    var attObj = project_project["gameAttributes"];
    for(var i=0; i<path.length; i++){
        attObj = attObj[path[i]];
    }
    return attObj;
}

function gameAttributes_update(s_path, name, value){

    var attObj = gameAttributes_find(s_path);

    attObj.name = name;
    attObj.value = value;

    console.log(attObj + " Updated");
}

function gameAttributes_delete(s_path){
    path = s_path.split("_");

    var attObj = project_project["gameAttributes"];
    for(var i=0; i<path.length-1; i++){
        attObj = attObj[path[i]];
    }

    console.log(attObj);
    console.log("Deleting - " + path[path.length-1]);
    attObj[path[path.length-1]] = null;
    delete  attObj[path[path.length-1]];
    //TODO - WARN USER CHILDREN WILL BE DELETED

}


//display attribute in side panel
function gameAttributes_display(s_path){
    var attribute = gameAttributes_find(s_path);

    console.log("displaying attribute in panel: " + attribute.name);


    var attributeTitle = $('#attribute-detail-title');
    var classList = $('#attribute-detail-class-list');
    var valueList = $('#attribute-detail-value-list');

    //clear old html
    classList.empty();
    valueList.empty();
    attributeTitle.text(" ");
    attributeTitle.text(attribute.name)

    //TODO - UPDATE ATTRIBUTE NAME
    if (attribute.is_leaf){
        $('#attribute-detail').show();
      //TODO - DISPLAY VALUE HTML w/ FORM TO UPDATE
    }else{
        $('#attribute-detail').show();
        var i;
        var childrenArray = attribute.children;
       for(i=0; i<childrenArray.length; i++){
            if(attribute[childrenArray[i]].is_leaf)
                valueList.append("<li>" + attribute[childrenArray[i]].name + ": " + attribute[childrenArray[i]].value + "</li>"); //TODO - ADD LINK TO ATTRIBUTE OR EDIT BUTTON
            else
                classList.append("<li>" + attribute[childrenArray[i]].name + "</li>"); //TODO - ADD LINK TO ATTRIBUTE
       }
    }
}

//used to generate random unique IDS for attributes
function generateID()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 4; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}



//Auxiliary Methods for Saving/Loading List HTML
function saveListHTML(){
    project_project["attributeHTML"] = $('#attributes-list').html();
}

function loadListHTML(){
    $('#attributes-list').html(project_project["attributeHTML"]);
}