goog.provide('gameAttributes');
goog.require('project');

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
    var newID = generateID();
    var newAttributeHTML;
    console.log(parent_path);
    if(parent_path!="TOP_LEVEL") {
        console.log("New Child: " + child_name);
        //find parent to add child to
        var parent = gameAttributes_find(parent_path);
        console.log(parent);
        parent[newID] = new GameAttribute(parent.path, parent.level, child_name, newID, is_leaf, value, minValue, maxValue);
        var child = parent[newID];
        parent.childrenArray.push(newID);
        console.log("New Nested attribute added under: " + parent.path);
        console.log("New Attribute ID: " + newID);
        //no need for inner list if the node is a leaf
        var pathString = "\'" + child.path + "\'";
        if (is_leaf){
            newAttributeHTML = '<li class="' + child.path + '-list-element margin"><a class="' + child.path + '-name" onclick="gameAttributes_display(' + pathString + ')">' + child_name + '</a></li>';
            $('#' + parent.path + '-inner_list').append(newAttributeHTML);
        }
        else {
            newAttributeHTML = '<li id="'+ child.id +'-list-element" class="' + child.path + '-list-element margin pointer"><a class="' + child.path + '-name" onclick="gameAttributes_display(' + pathString + ')">' + child_name + '</a><ul id="' + child.path + '-inner_list"></ul></li>';
            $('#' + parent.path + '-inner_list').append(newAttributeHTML);
            //CollapsibleLists.applyTo(document.getElementById(child.id + '-list-element'));
        }
        gameAttributes_display(parent.path);
    }
    else
    {
        project_project["gameAttributes"][newID] = new GameAttribute(null, null, child_name, newID, false);
        newAttributeHTML = '<li class="' + newID  + '-list-element margin pointer"><a onclick="gameAttributes_display('+ '\'' + newID + '\'' + ')">' + child_name + '</a><ul id="' + newID + '-inner_list"></ul></li>';
        $('#attributes-list').append(newAttributeHTML);
        console.log("new top level attribute added: " + project_project["gameAttributes"][newID].path);
    }
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


    var editObj = gameAttributes_update(s_path, name.val(), value.val(), minValue.val(), maxValue.val());

    gameAttributes_display(editObj.parentPath);
}

//this method is used to update the attribute's value from anywhere
function gameAttributes_update(s_path, name, value, minVal, maxVal){

    var attObj = gameAttributes_find(s_path);

    if(name!=null&&name!='')
    {attObj.name = name; $('.' + attObj.path +'-name').text(name);}

        attObj.value = value;
        attObj.minValue = minVal;
        attObj.maxValue = maxVal;

    console.log(attObj + " Updated");

    //Update Attribute HTML element
    $('#' + attObj.id + '-value').text(value);
    $('#' + attObj.id + '-min-value').text(minVal);
    $('#' + attObj.id + '-max-value').text(maxVal);

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
    var add_folder_button = $('#add_sub_folder_button');
    add_folder_button.show();
    add_folder_button.attr('data-path', s_path);
    var add_attribute_button = $('#add_attribute_values_button');
    add_attribute_button.show();
    add_attribute_button.attr('data-path', s_path);


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
                    + '<div class="collapsible-header"><span class="' + childObj.path + '-name">' + childObj.name + '</span></div>'
                    +  '<div class="collapsible-body">'
                    +      '<div class="row pos-relative " style="height: 50px;" >'
                    +          '<div class="col m2 attribute_float-bottom pos-absolute">'
                    +              '<span>Value: <span id="'+ childObj.id +'-value">' + childObj.value + '</span></span>'
                    +          '</div>'
                    +          '<div class="col m4 offset-m2 attribute_float-bottom pos-absolute">'
                    +              '<span>Value Range: <span id="' + childObj.id +'-min-value">' + childObj.minValue + '</span> to <span id="' + childObj.id + '-max-value">' + childObj.maxValue + '</span></span>'
                    +          '</div>'
                    +          '<div class="col m3 offset-m9 attribute_float-bottom pos-absolute">'
                    +              '<a class="btn-floating btn-small waves-effect waves-light red delete-button" id="'+ childObj.path+'-delete-button" data-path="'+ childObj.path+'" onclick="gameAttributes_delete(' + '\'' + childObj.path+ '\'' +')"><i class="small material-icons">delete</i></a>'
                    +              '<a class="btn-floating btn-small waves-effect waves-light blue edit-button" id="'+ childObj.path+'-edit-button" data-path="' + childObj.path + '" onclick="gameAttributes_openEditAttributeModal(this)"><i class="small material-icons">mode_edit</i></a> '
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

function gameAttributes_openAddFolderModal(elementID)
{
    myModal.prompt("Add an Attribute Folder", "Folders contain attribute values and other attribute folders. Use them to help organise your attributes.",
        [{name: "New Folder Name", default: "", type: "text"}],
        function(results)
        {
            //callback function
            var folder_name = results[0];
            gameAttributes_addAttributeFolder($(elementID).attr('data-path'), folder_name);
        },
        function(results)
        {
            //this is the verification function, it will occur before the callback
            //if true then callback is called
            //if false then the window will not close, and the callback will not fire
            console.log("Verifying ", results[0]);
            if (results[0] == "")
            {
                console.log("No Folder name entered");
                Materialize.toast('Please enter a folder name', 3000, 'rounded');
                return false;
            }
            else
            {
                console.log("Folder name successfully verified");
                return true;
            }
        });
}

function gameAttributes_openAddAttributeModal(elementID)
{
    myModal.prompt("Add an Attribute", "Attributes have values, minimum values, maximum value.",
        [{name: "Attribute Name", default: "", type: "text"}, {name: "Attribute Value", default: "0", type: "number"},  {name: "Minimum Value", default: "", type: "number"}, {name: "Maximum Value", default: "", type: "number"}],
        function(results)
        {
            //callback function

            gameAttributes_addAttribute( $(elementID).attr('data-path'), results[0], results[1], results[2], results[3]);
        },
        function(results)
        {
            //this is the verification function, it will occur before the callback
            //if true then callback is called
            //if false then the window will not close, and the callback will not fire
            console.log("Verifying ", results[0]);
            var verified = true;
            if (results[0] == "")
            {
                console.log("No Folder name entered");
                Materialize.toast('Please enter an attribute name', 3000, 'rounded');
                verified = false;
            }

            if(results[1] < results[2] || results[1] > results[3] || results[2]>results[3])
            {
                console.log("Illegal attribute values");
                Materialize.toast("Conflicting Attribute Values", 3000, 'rounded');
                verified = false;
            }

                return verified;
        });
}

function gameAttributes_openEditAttributeModal(elementID)
{
    var editObject = gameAttributes_find($(elementID).attr('data-path'));
    myModal.prompt("Update " + editObject.name, "Update the fields below",
        [{name: "Attribute Name", default: editObject.name, type: "text"}, {name: "Attribute Value", default: editObject.value, type: "number"},  {name: "Minimum Value", default: editObject.minValue, type: "number"}, {name: "Maximum Value", default: editObject.maxValue, type: "number"}],
        function(results)
        {
            //callback function
            gameAttributes_update( $(elementID).attr('data-path'), results[0], results[1], results[2], results[3]);
        },
        function(results)
        {
            //this is the verification function, it will occur before the callback
            //if true then callback is called
            //if false then the window will not close, and the callback will not fire
            console.log("Verifying ", results[0]);
            var verified = true;
            if (results[0] == "")
            {
                console.log("No Attribute name entered");
                Materialize.toast('Please enter an attribute name', 3000, 'rounded');
                verified = false;
            }

            if(results[1] < results[2] || results[1] > results[3] || results[2]>results[3] || (results[2]||results[3]) == "")
            {
                console.log("Illegal attribute values");
                Materialize.toast("Conflicting Attribute Values", 3000, 'rounded');
                verified = false;
            }
            return verified;
        });
}