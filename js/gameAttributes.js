goog.provide('gameAttributes')
goog.require('project')

function GameAttribute(parent_path, parent_level, name, attID, is_leaf, value, minValue, maxValue){
    this.name = name;
    this.is_leaf = is_leaf;
    this.value = value;
    this.maxValue = maxValue;
    this.minValue = minValue;
    this.parentPath = parent_path;
    this.id = attID;
    if(parent_path != null){
        this.level = parent_level + 1;
        this.path = parent_path + "_" + attID;
    }
    else{
        this.path = attID;
        this.level = 0;
    }
    this.childrenArray = [];

}

function gameAttributes_addAttribute(parent_path, child_name, value, minValue, maxValue) {
    gameAttributes_addChild(parent_path, child_name, true, value, minValue, maxValue);
}

function gameAttributes_addAttributeFolder(parent_path, child_name) {
    gameAttributes_addChild(parent_path, child_name, false);
}

function gameAttributes_addChild(parent_path, child_name, is_leaf, value, minValue, maxValue){
    console.log("New Child: " + child_name);
    //find parent to add child to
    var parent = gameAttributes_find(parent_path);
    var newID = generateID();

    parent[newID] = new GameAttribute(parent.path, parent.level, child_name, newID, is_leaf, value, minValue, maxValue);
    var child = parent[newID];

    parent.childrenArray.push(newID);
    console.log("New Nested attribute added under: " + parent.path);
    console.log("New Attribute ID: " + newID);

    //no need for inner list if the node is a leaf
    var newAttributeHTML;
    var pathString = "\'" + child.path + "\'";
    if (is_leaf)
        newAttributeHTML = '<li class="' + child.path  + '-list-element margin"><a class="' + child.path + '-name" onclick="gameAttributes_display(' + pathString + ')">' + child_name + '</a></li>';
    else
        newAttributeHTML = '<li class="' + child.path  + '-list-element margin pointer"><a class="' + child.path + '-name" onclick="gameAttributes_display(' + pathString + ')">' + child_name + '</a><ul id="' + child.path + '-inner_list"></ul></li>';

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


//used to update attribute from html
function gameAttribute_edit(s_path){
    var name = $('#' + s_path + '-name-input');
    var value = $('#' + s_path + '-value-input');
    var minValue = $('#' + s_path + '-min-value-input');
    var maxValue = $('#' + s_path + '-max-value-input');


    //Todo - make sure values are valid

    var editObj = gameAttributes_update(s_path, name.val(), value.val(), minValue.val(), maxValue.val());

    gameAttributes_display(editObj.parentPath);
}


//this method is used to update the attribute's value from anywhere
function gameAttributes_update(s_path, name, value, minVal, maxVal){

    var attObj = gameAttributes_find(s_path);

    if(name!=null&&name!='')
    {attObj.name = name; $('.' + attObj.path +'-name').text(name);}

    if(value!=null&&name!='')
        attObj.value = value;

    if(minVal!=null&&name!='')
        attObj.minValue = minVal;

    if(maxVal!=null&&name!='')
        attObj.maxValue = maxVal;

    console.log(attObj + " Updated");



    return attObj;
}

function gameAttributes_delete(s_path){

    path = s_path.split("_");

    var attObj = project_project["gameAttributes"];
    //stop at parent of attribute to be deleted
    for(var i=0; i<path.length-1; i++){
        attObj = attObj[path[i]];
    }

    console.log(attObj);
    console.log("Deleting - " + attObj[path[path.length-1]].path);

    $('.' + attObj[path[path.length-1]].path + '-list-element').remove();

    attObj.childrenArray.splice($.inArray(attObj[path[path.length-1]].id, attObj.childrenArray), 1);

    attObj[path[path.length-1]] = null;
    delete  attObj[path[path.length-1]];


    //TODO - WARN USER CHILDRENArray WILL BE DELETED, REMOVE FROM CHILDRENArray ARRAY

}


//display attribute in side panel
function gameAttributes_display(s_path){
    var attribute = gameAttributes_find(s_path);

    console.log("displaying attribute in panel: " + attribute.name);


    //var attributeTitle = $('#attribute-detail-title');
    //var classList = $('#attribute-detail-class-list');
    var valueList = $('#values-list');
    var folderList = $('#folders-list');
    var attributeTitle = $('.current-attribute-name');

    console.log(s_path);
    $('.new-attribute-input').attr('data-path', s_path);
    $('.new-folder-input').attr('data-path', s_path);
    $('#add_attribute_input_container_show_button').show();
    $('#add_folder_input_container_show_button').show();


    //TODO - UPDATE ATTRIBUTE NAME
    if (attribute.is_leaf){
        //TODO Prompt to update?
    }else{
        //clear html of old attribute
        valueList.empty();
        folderList.empty();

        attributeTitle.text(attribute.name);

        var i;
        var childObj;
       for(i=0; i<attribute.childrenArray.length; i++){
           childObj = attribute[attribute.childrenArray[i]];
            if(childObj.is_leaf){

                var attributeRowString = ''
                    + '<li class="'+ childObj.path +'-list-element">'
                    + '<div class="collapsible-header"><span class="' + childObj.path + '-name">' + childObj.name + '</span>&nbsp;&nbsp;Init Value:<span id="'+ childObj.path +'-value">' + childObj.value + '</span>&nbsp;&nbsp;Min:<span id="' + childObj.path+ '-max-value">' + childObj.minValue + '</span>&nbsp;&nbsp;Max:<span id="' + childObj.path+ '-max-value">' + childObj.maxValue + '</span></div>'
                    +  '<div class="collapsible-body">'
                    +      '<div class="row pos-relative" >'
                    +          '<div class="input-field col m3" >'
                    +              '<input id="' + childObj.path + '-name-input" type="text" class="update-attribute-input validate" data-path="' + childObj.path + '">'
                    +              '<label for="' + childObj.path + '-name-input">Name</label>'
                    +          '</div>'
                    +          '<div class="input-field col m2">'
                    +              '<input id="' + childObj.path + '-value-input" type="number" class="update-attribute-input validate" data-path="' + childObj.path + '">'
                    +              '<label for="' + childObj.path + '-value-input"> Value</label>'
                    +          '</div>'
                    +          '<div class="input-field col m2">'
                    +              '<input id="' + childObj.path + '-min-value-input" type="number" class="update-attribute-input validate" data-path="' + childObj.path + '">'
                    +              '<label for="' + childObj.path + '-min-value-input">Min Value</label>'
                    +          '</div>'
                    +          '<div class="input-field col m2">'
                    +              '<input id="' + childObj.path + '-max-value-input" type="number" class="update-attribute-input validate" data-path="' + childObj.path + '">'
                    +              '<label for="' + childObj.path + '-min-value-input">Max Value</label>'
                    +          '</div>'
                    +          '<div class="col m3 float-bottom float-right offset-m9">'
                    +             '<a class="btn-floating btn-small waves-effect waves-light green update-button" id="'+ childObj.path+'-update-button" data-path="'+ childObj.path+'" onclick="gameAttribute_edit(' + '\'' + childObj.path+ '\'' +')" ><i class="small material-icons">done</i></a>'
                    +              '&nbsp;'
                    +              '<a class="btn-floating btn-small waves-effect waves-light red delete-button" id="'+ childObj.path+'-delete-button" data-path="'+ childObj.path+'" onclick="gameAttributes_delete(' + '\'' + childObj.path+ '\'' +')"><i class="small material-icons">delete</i></a>'
                    +          '</div>'
                    +      '</div>'
                    +  '</div>'
                    +    '</li>';

                valueList.append(attributeRowString);
            }
              else
                folderList.append('<a class="collection-item pointer" onclick="gameAttributes_display('+ '\'' + childObj.path + '\'' + ')">' + childObj.name +'</a>');
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
function gameAttributes_saveAttributes(){
    project_project["attributeHTML"] = $('#attributes-list').html();
}

function gameAttributes_loadAttributes(){
    $('#attributes-list').html(project_project["attributeHTML"]);
}


//TODO - COLLATE INTO ONE METHOD
function showAddTopLevelInput(){
    $('#new-top-level-button').hide();
    $('#new-top-level-container').show();
}

function showAddValueInput(){
    $('#new-value-button').parent().hide();
    $('#new-value-container').show();
}

function showAddFolderInput(){
    $('#new-class-button').parent().hide();
    $('#new-class-container').show();
}


$("#add-class-name").keypress(function(event) {
    if (event.which == 13) {

        var class_name_input =$('#add-class-name');
        //--

        gameAttributes_addAttributeFolder(class_name_input.attr('data-path'), class_name_input.val());

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
        gameAttributes_addAttribute(value_name_input.attr('data-path'), value_name_input.val(), value_data_input.val());

        //Clear Fields
        value_data_input.val("");
        value_name_input.val("");

        //update display panel
        gameAttributes_display(value_name_input.attr('data-path'));

        $('#new-value-button').parent().show();
        $('#new-value-container').hide();

    }
});

$("#add-top-level-name").keypress(function(event) {
    if (event.which == 13) {
        var class_name_input =$('#add-top-level-name');
        //--

       project_addTopGameAttributeFolder(class_name_input.val());

        //Clear Fields
        class_name_input.val("");

        $('#new-top-level-button').show();
        $('#new-top-level-container').hide();
    }
});


/* Click Events and Methods for adding attributes/values */
$('#add-attribute-confirm').click(function () {

    gameAttributes_addAttributeFromHtml();

});

$('.new-attribute-input').keypress(function (event) {
    if(event.which == 13) {
        gameAttributes_addAttributeFromHtml();
    }

});


function gameAttributes_addAttributeFromHtml(){
    var nameInput = $('#new_attribute_name_input');
    var valueInput = $('#new_attribute_value_input');
    var minValueInput = $('#new_attribute_min_input');
    var maxValueInput = $('#new_attribute_max_input');

    //TODO - MAKE SURE THERE ARE NO NULL VALUES

    gameAttributes_addAttribute(nameInput.attr('data-path'), nameInput.val(), valueInput.val(), minValueInput.val(), maxValueInput.val());
    $('#add_attribute_input_container').hide();
    $('#add_attribute_input_container_show_button').show();
    nameInput.val('');
    valueInput.val('');
    minValueInput.val('');
    maxValueInput.val('');

    gameAttributes_display(nameInput.attr('data-path'));

}


/* Click Events and Methods for adding attribute folders */

$('#add-folder-confirm').click(function () {

    gameAttributes_addFolderFromHtml();

});

$('.new-folder-input').keypress(function (event) {
    if (event.which == 13){
        gameAttributes_addFolderFromHtml();
    }
});

function gameAttributes_addFolderFromHtml(){
    var nameInput = $('#new_folder_name_input');

    //TODO - VALIDATE THAT INPUT IS NOT NULL

    gameAttributes_addAttributeFolder(nameInput.attr('data-path'), nameInput.val());
    $('#add_folder_input_container').hide();
    $('#add_folder_input_container_show_button').show();
    nameInput.val('');

    gameAttributes_display(nameInput.attr('data-path'));
}

//temporary function for dealing with button click
//TODO - Clean up
function temp_add_top_level() {
    var class_name_input =$('#add-top-level-name');
    //--

    project_addTopGameAttributeFolder(class_name_input.val());

    //Clear Fields
    class_name_input.val("");

    $('#new-top-level-button').show();
    $('#new-top-level-container').hide();
}

function gameAttributes_showInput(inputContainer){
    $('#' + inputContainer).show();
    $('#' + inputContainer + '_show_button').hide();
}
