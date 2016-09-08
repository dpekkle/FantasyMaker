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
    console.log("New Child: " + child_name);
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
    var valueList = $('#values-chips-container');
    var addClassInput = $('#add-class-name');
    var addValueNameInput = $('#add-value-name');
    var addValueDataInput = $('#add-value-data');

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

        //Bind current attribute path to the input fields
        addClassInput.attr('data-path', attribute.path);
        addValueDataInput.attr('data-path', attribute.path);
        addValueNameInput.attr('data-path', attribute.path);

        var i;
        var childrenArray = attribute.children;
       for(i=0; i<childrenArray.length; i++){
            if(attribute[childrenArray[i]].is_leaf)
                valueList.append('<div class="chip" onclick="gameAttributes_display('+ '\'' + attribute[childrenArray[i]].path + '\'' +')">' + attribute[childrenArray[i]].name + ': ' + attribute[childrenArray[i]].value + '</div>'); //TODO - ADD LINK TO ATTRIBUTE OR EDIT BUTTON
            else
                classList.append('<div class="chip" onclick="gameAttributes_display('+ '\'' + attribute[childrenArray[i]].path + '\'' +')">' + attribute[childrenArray[i]].name + '</div>');
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


function showAddValueInput(){
    $('#new-value-button').parent().hide();
    $('#new-value-container').show();
}

function showAddClassInput(){
    $('#new-class-button').parent().hide();
    $('#new-class-container').show();
}


$("#add-class-name").keypress(function(event) {
    if (event.which == 13) {

        console.log("enter clicked");
        var class_name_input =$('#add-class-name');
        //--

        gameAttributes_addAttributeClass(class_name_input.attr('data-path'), class_name_input.val());

        //Clear Fields
        class_name_input.val("");

        //update display panel
        gameAttributes_display(class_name_input.attr('data-path'));

        $('#new-class-button').parent().show();
        $('#new-class-container').hide();
    }
});

$(".add-value").keypress(function(event) {
    if (event.which == 13) {
        var value_name_input =$('#add-value-name');
        var value_data_input = $('#add-value-data');
        gameAttributes_addAttributeValue(value_name_input.attr('data-path'), value_name_input.val(), value_data_input.val());

        //Clear Fields
        value_data_input.val("");
        value_name_input.val("");

        //update display panel
        gameAttributes_display(value_name_input.attr('data-path'));

        $('#new-value-button').parent().show();
        $('#new-value-container').hide();

    }
});