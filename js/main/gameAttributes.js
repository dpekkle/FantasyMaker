goog.provide('gameAttributes');
goog.require('project');

function GameAttribute(newAttributeObject, parent_path, parent_level, name, attID, is_leaf, value, minValue, maxValue){
    this.name = newAttributeObject.name;
    this.is_leaf = newAttributeObject.is_leaf;
    this.value = newAttributeObject.value;
    this.initValue = this.value;
    this.maxValue = newAttributeObject.maxValue;
    this.minValue = newAttributeObject.minValue;
    this.parentPath = newAttributeObject.parentPath;
    this.id = newAttributeObject.id;
    this.description = newAttributeObject.description;
    if(newAttributeObject.parentPath != null){
        this.level = newAttributeObject.level + 1;
        this.path = newAttributeObject.parentPath + "_" + newAttributeObject.id;
    }
    else{
        this.path = newAttributeObject.id;
        this.level = 0;
    }
    this.childrenArray = [];
}
var currentAttributeObj = null;


//Recursively resets all attributes under and including attribute of provided path
function gameAttributes_recursiveResetAllAttributes(attributePath){

    var attributeObj = gameAttributes_find(attributePath);
    if(attributeObj.is_leaf)
        attributeObj.value = attributeObj.initValue;

    var length = attributeObj.childrenArray.length;
    for(var i = 0; i<length; i++){
        gameAttributes_recursiveResetAllAttributes(attributeObj.path + '_' +attributeObj.childrenArray[i]);
    }

    console.log('Reset' + attributeObj.name);
}


function gameAttributes_addAttributeFolder(parent_path, folder_name, attID) {

    var attObj = {name: folder_name, is_leaf: false, parentPath: parent_path, id: attID};

    var addUnderObj = {};
    if(!parent_path){
        attObj.parentPath = null;
        addUnderObj = project_project['gameAttributes'];
        attObj.path = attObj.id;
    }else{
        attObj.path = parent_path + '_' + attObj.id;
        addUnderObj = gameAttributes_find(parent_path);
        addUnderObj.childrenArray.push(attObj.id); //push ID into array
    }


    addUnderObj[attObj.id] = new GameAttribute(attObj);

    gameAttributes_createModule_addAttributeListElement(attObj.path);
}


//returns array of parent names for given attribute
function gameAttributes_getAllParents(attributePath){

    path = attributePath.split("_");
    var attObj = project_project["gameAttributes"];
    var results = [];
    for(var i=0; i<path.length; i++){
        attObj = attObj[path[i]];
        results.push(attObj);
    }

    return results;
}



/* ATTRIBUTE DOCUMENT METHODS - FOLLOWING METHODS ARE CALLED FROM HTML */
function gameAttributes_createModule_addAttributeValue(){
    var attributeID = generateID();
    defineAttributeModal.prompt(attributeID, true, currentAttributeObj.path); //TODO
}

function gameAttributes_createModule_updateAttributeValue(attributeID){
    defineAttributeModal.prompt(attributeID, false);
}


function gameAttributes_createModule_addAttributeFolder(currentPath){
    var attributeID = generateID();


    myModal.prompt("Add A New Folder", "", [{name: "Enter A Folder Name", default: "", type: "text"}],
			function(results){
				var folderName = results[0];


                gameAttributes_addAttributeFolder(currentPath, folderName, attributeID);
                //if it is a top level attribute
                if(!currentPath)
                    currentAttributeObj = project_project['gameAttributes'][attributeID];

                gameAttribute_createModule_updateContextPane();

			},
			function(results){
				if (results[0] == ""){return false;}
       		else { return true;}
			});
}

function gameAttributes_createModule_openEditAttributeModal(attributePath)
{

}


function gameAttributes_createModule_deleteAttribute(attributePath)
{

}


//updates attribute modal when attribute is clicked on
function gameAttributes_createModule_displayFolder(attributePath){

    currentAttributeObj = gameAttributes_find(attributePath);
    gameAttribute_createModule_updateBreadcrumbs();
    gameAttribute_createModule_updateContextPane();

}



/*END DOCUMENT METHODS */

//function gameAttributes_createModule

/* ATTRIBUTE DOCUMENT  MANIPULATION METHODS - ATTRIBUTE MUST BE IN MEMORY */

function gameAttribute_createModule_updateContextPane(){

    var attribute;
    var folderHtml;
    var valueHtml;
    var folderList = $('#folder-container');
    var valueList = $('#values-container');
    folderList.empty();
    valueList.empty();

    for(var i=0; i<currentAttributeObj.childrenArray.length; i++){
        attribute = gameAttributes_find(currentAttributeObj.path + '_' + currentAttributeObj.childrenArray[i]);
        if(!attribute.is_leaf) { //only append to folder pane if it is indeed a folder
            folderHtml = '<div class="folder card-panel hoverable" onclick="gameAttributes_createModule_displayFolder(\'' + attribute.path + '\')"><h6 class="folder-title ">' + attribute.name + '</h6></div>';
            folderList.append(folderHtml);
        }else{ //otherwise append value html
            valueHtml =   '<div id="'+ attribute.id +'-value-card" class="value-card-panel col l3 m4 s6 card-panel hoverable">'
            +       '<i class="material-icons small">equalizer</i><span style="font-size: 19px; font-weight: bold">'+ attribute.name +'</span><hr/>'
            +           '<span style="font-size: 14px"> Initial Value: <span id="'+attribute.id+'-value" style="font-size: 19px; font-weight: bold">'+ attribute.value +'</span></span><br/>'
            +           '<span style="font-size: 14px"> Value Range: <span id="'+attribute.id+'-min-value" style="font-size: 19px; font-weight: bold">'+ attribute.minValue +'</span> to <span id="'+attribute.id+'-max-value" style="font-size: 19px; font-weight: bold">'+ attribute.maxValue +'</span></span><br/>'
            +           '<hr/>'
            +           '<a class="btn-floating red right hoverable" onclick="gameAttributes_createModule_openEditAttributeModal(\''+ attribute.path +'\')"><i class="material-icons small">delete</i></a>'
            +           '<a class="btn-floating blue right hoverable"onclick="gameAttributes_createModule_deleteAttribute(\''+ attribute.path +'\')"><i class="material-icons small">mode_edit</i></a>'
            +    '</div>';
            valueList.append(valueHtml);

            //update min & max if they're not specified
            if(attribute.minValue==undefined)
                $('#' + attribute.id + '-min-value').text('∞');

            if(attribute.maxValue==undefined)
                $('#' + attribute.id + '-max-value').text('∞');

        }


    }
}


function gameAttribute_createModule_updateBreadcrumbs(){

    var parentsArray = gameAttributes_getAllParents(currentAttributeObj.path);

    var breadcrumbsContainer = $('#folder-breadcrumbs-container');
    breadcrumbsContainer.empty();

    for(var i = 0; i<parentsArray.length; i++){
        var breadcrumbHtml = '<a href="#!" class="breadcrumb" onclick="gameAttributes_createModule_displayFolder(\'' + parentsArray[i].path + '\')">' + parentsArray[i].name + '</a>';
        breadcrumbsContainer.append(breadcrumbHtml);
    }


}



//Add html list element for attribute
//Format for list elements : <li id="<attribute ID>-list-element" class=" ... "> <ul id="<attribute ID>-inner-list"(if folder)> </ul></li>
function gameAttributes_createModule_addAttributeListElement(attributePath){

    var attributeObj = gameAttributes_find(attributePath);

    //basic list item html, does not account for leaf vs folder
        //.lastChild : applies correct background image
    var listItemHtml;
    if(!attributeObj.is_leaf)
         listItemHtml =  '<li id="'+ attributeObj.id +'-list-element" class="lastChild"><a class="' + attributeObj.id + '-name" onclick="gameAttributes_createModule_displayFolder(\'' + attributeObj.path + '\')">' + attributeObj.name + '</a></li>';
    else
        listItemHtml =  '<li id="'+ attributeObj.id +'-list-element" class="lastChild">' + attributeObj.name + '</li>';

    //Get the parent list element to append to
    var parentInnerList;
    if(attributeObj.parentPath != null){
        parentInnerList = $('#' + gameAttributes_find(attributeObj.parentPath).id + '-inner-list');
        //remove .lastChild from above element (for styling)
        $('#' + gameAttributes_find(attributeObj.parentPath).id + '-list-element li:last').removeClass('lastChild');
    }

    else{
        parentInnerList = $('#all-attributes-inner-list');
        $('#all-attributes-inner-list li:last').removeClass('lastChild');
    }




    parentInnerList.append(listItemHtml);

    //Manipulate newly added list element based on if it is a folder (do nothing if it is a value)
    if(!attributeObj.is_leaf){
        var attributeListElement =  $('#' + attributeObj.id + '-list-element');
        attributeListElement.addClass('collapsibleListClosed');

        //add inner list
        var attributeInnerListHtml = '<ul id="' + attributeObj.id + '-inner-list" class="collapsible-list"></ul>';
        attributeListElement.append(attributeInnerListHtml);
    }

}


function gameAttributes_createModule_recursiveListDisplayAll(){
    $('#all-attributes-inner-list').empty();

    for(var att in project_project.gameAttributes){
        gameAttributes_createModule_recursiveListDisplay(att);
    }

    CollapsibleLists.applyTo(document.getElementById('all-attributes-inner-list'));
}

//Appends attribute to attribute list and recursively adds children elements
function gameAttributes_createModule_recursiveListDisplay(attribute_path) {

    gameAttributes_createModule_addAttributeListElement(attribute_path);

    var attObj = gameAttributes_find(attribute_path);

    for(var i = 0; i < attObj.childrenArray.length; i++) {
        gameAttributes_createModule_recursiveListDisplay(gameAttributes_find(attribute_path + '_' +attObj.childrenArray[i]).path);
    }
}



var defineAttributeModal = new DefineAttributeModal;
defineAttributeModal.init();

function DefineAttributeModal() {
    this.confirm = false;
    this.isNewValue = false;

    this.init = function () {
        $("body").append(''
            + '<div id="define-attribute-modal" class=" modal modal-fixed-footer">'
            +   '<div class="modal-content">'
            +       '<div class="row row-centered">'
            +           '<h3>Define Attribute</h3>' //BREADCRUMBS HERE
            +       '</div>'
            +       '<div class="row row-centered">' // EDIT CONTENT ROW
            +           '<div class="col m6">' //LEFT SIDE COLUMN (edit name, description)
            +               '<div class="input-field col m10">'
            +                   '<input id="attribute-name-input" class="validate"  type="text"/>'
            +                   '<label for="attribute-name-input" data-error="Required" class="active" >Attribute Name</label>'
            +               '</div>'
            +                '<div class="input-field col m10">'
            +                   '<textarea id="attribute-detail-input" class="materialize-textarea"></textarea>'
            +                   '<label for="attribute-detail-input" class="active">Item Description</label>'
            +               '</div>'
            +           '</div>'
            +           '<div class="col m6">' //RIGHT SIDE COLUMN (edit value, min max)
            +               '<div class="input-field col m6 offset-m6">' // Value Input
            +                   '<input id="attribute-initValue-input" class="validate" value="0" type="number"/>'
            +                   '<label for="attribute-initValue-input" data-error="Required" class="active" >Initial Value</label>'
            +               '</div>'
            +                '<div class="switch col m4 right-align">' //Min Value Toggle
            +                '<label>'
            +                        'Enable Minimum'
            +                        '<input id="attribute-minValue-toggle" type="checkbox">'
            +                        '<span class="lever"></span>'
            +                    '</label>'
            +                '</div>'
            +               '<div class="input-field col m6 offset-m2">' //Min Value Input
            +                   '<input id="attribute-minValue-input" class="validate" value="0" type="number"/>'
            +                   '<label for="attribute-minValue-input" data-error="Required" class="active">Minimum Value</label>'
            +               '</div>'
            +                '<div class="switch col m4 right-align">' //Max Value Toggle
            +                '<label >'
            +                        'Enable Maximum'
            +                        '<input id="attribute-maxValue-toggle" type="checkbox">'
            +                        '<span class="lever"></span>'
            +                    '</label>'
            +               '</div>'
            +               '<div class="input-field col m6 offset-m2">' //Max Value Input
            +                   '<input id="attribute-maxValue-input" class="validate" value="0" type="number"/>'
            +                   '<label for="attribute-maxValue-input" data-error="Required" class="active" >Maximum Value</label>'
            +               '</div>'
            +           '</div>'
            +         '</div>'
            +   '</div>'
            +   '<div class="modal-footer">'
            +       '<a href="#!" class=" modal-action modal-close waves-effect waves-red btn-flat" onclick="defineAttributeModal.evaluateModal(false)">Cancel</a>'
            +       '<a href="#!" class=" modal-action waves-effect waves-green btn-flat" onclick="defineAttributeModal.evaluateModal(true)">Confirm</a>'
            +   '</div>'
            + '</div>');
    };


    this.prompt = function (itemID, isNewValue, currentPath) {
        this.nameInput = $('#attribute-name-input');
        this.detailInput = $('#attribute-detail-input');
        this.initValueInput = $('#attribute-initValue-input');
        this.minValueToggle = $('#attribute-minValue-toggle');
        this.minValueInput = $('#attribute-minValue-input');
        this.maxValueToggle = $('#attribute-maxValue-toggle');
        this.maxValueInput = $('#attribute-maxValue-input');
        var attributeObj = null;
        this.currentAttributeID = itemID;
        this.currentPath = currentPath; //Path of containing folder
        this.isNewValue = isNewValue;
        this.attributeObj = {};
        //set is_leaf

        //If it is not a new attribute (editing existing), pre-fill inputs
        if(!this.isNewValue){
            this.attributeObj = gameAttributes_find(currentPath + '_' + itemID);
            this.nameInput.val(this.attributeObj.name);
            this.detailInput.val(this.attributeObj.description);
            this.detailInput.trigger('autoresize');
            this.initValueInput.val(this.attributeObj.initValue);
        }

        $('#define-attribute-modal').openModal({
            dismissible: true,
            ready: function(){
            },
            complete: function(){
                $('#attribute-name-input').val('');
                $('#attribute-detail-input').val('');
                $('#attribute-initValue-input').val('0');
                $('#attribute-minValue-input').val('0');
                $('#attribute-maxValue-input').val('0');
            }
        });


    };

    this.evaluateModal = function (status) {

        if (status) //user confirmed operation
        {
            var validated = false;

            var minValid = true;
            var maxValid = true;

            //check name & init count fields
            if (this.nameInput.val() != undefined && this.nameInput.val() != "" && this.initValueInput.val() != undefined && this.initValueInput.val() != "")
                validated = true;


            if(this.maxValueToggle.prop('checked') && (this.maxValueInput.val() == "" || this.maxValueInput.val() == undefined) )
            {
                validated = false;
                maxValid = false;
            }


            if(this.minValueToggle.prop('checked') && (this.minValueInput.val() == "" || this.minValueInput.val() == undefined) ) {
                validated = false;
                minValid = false;
            }

            //User confirmed operation & input was validated
            if (validated) {


                if (this.detailInput.val() == undefined || this.detailInput.val() == "")
                    this.detailInput.val("No description provided");

                //Get input
                var resultObj = {
                    name: this.nameInput.val(),
                    id: this.currentAttributeID,
                    description: this.detailInput.val(),
                    value: this.initValueInput.val(),
                    parentPath: currentAttributeObj.path,
                    is_leaf: true
                };

                if(this.minValueToggle.prop('checked'))
                    resultObj.minValue = this.minValueInput.val();
                else
                    resultObj.minValue = undefined;

                if(this.maxValueToggle.prop('checked'))
                    resultObj.maxValue = this.maxValueInput.val();
                else
                    resultObj.maxValue = undefined;


                if (this.isNewValue) {
                    currentAttributeObj[this.currentAttributeID] = new GameAttribute(resultObj);
                    currentAttributeObj.childrenArray.push(this.currentAttributeID);
                    gameAttributes_createModule_recursiveListDisplayAll();

                   gameAttributes_createModule_displayFolder(currentAttributeObj.path);
                }
                else {
                    //upating an already existing attribute
                    currentAttributeObj[this.currentItemID] = new GameAttribute(resultObj);
                    gameAttributes_createModule_displayFolder(currentAttributeObj.path);
                }

                //close modal, clear inputs
                $('#define-attribute-modal').closeModal();
                this.nameInput.val('');
                this.detailInput.val('');
                this.initValueInput.val('0');
                this.minValueInput.val('0');
                this.maxValueInput.val('0');
            }
            else {
                console.log("item definition validation failed");

                if(this.nameInput.val() == undefined || this.nameInput.val() == ""){
                    Materialize.toast("Please provide an attribute name", 5000, 'rounded', 'dismissible');
                    this.nameInput.addClass("invalid");
                }

                if(this.initValueInput.val() == undefined || this.initValueInput.val() == ""){
                    Materialize.toast("Please provide an initial attribute value ", 7000, 'rounded', 'dismissible');
                    this.initValueInput.addClass("invalid");
                }

                if(!minValid)
                {
                    Materialize.toast("Please provide a minimum value", 7000, 'rounded', 'dismissible');
                    this.minValueInput.addClass("invalid");
                }

                if(!maxValid)
                {
                    Materialize.toast("Please provide a maximum value", 7000, 'rounded', 'dismissible');
                    this.maxValueInput.addClass("invalid");
                }
            }
        }
        else // user cancelled operation
        {
            //close modal, clear inputs
            $('#define-item-modal').closeModal();
            this.nameInput.val('');
            this.detailInput.val('');
            this.initValueInput.val('0');
            this.maxValueInput.val('0');
            this.minValueInput.val('0');
        }

    };

}


/* END ATTRIBUTE DOCUMENT MANIPULATION METHODS */


 //navigate to attribute from provided path
 function gameAttributes_find(s_path){
 path = s_path.split("_");
 var attObj = project_project["gameAttributes"];
 for(var i=0; i<path.length; i++){
 attObj = attObj[path[i]];
 }
 return attObj;
 }

















/*
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
*/
//used to generate random unique IDS for attributes
function generateID()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 4; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
/*
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



*/