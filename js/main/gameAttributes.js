goog.provide('gameAttributes');
goog.require('project');

function GameAttribute(newAttributeObject){
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
    this.NO_DELETE = false; //usually allow user to delete folder
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


function gameAttributes_deleteAttribute(attributePath){
    path = attributePath.split("_");
    var attObj = project_project["gameAttributes"];
    //stop at parent of attribute to be deleted
    for(var i=0; i<path.length-1; i++){
        attObj = attObj[path[i]];
    }
    console.log("Deleting - " + attObj[path[path.length-1]].path);

    //If at top level theres no parent array to change
    if(attObj != project_project['gameAttributes']){
        attObj.childrenArray.splice($.inArray(attObj[path[path.length-1]].id, attObj.childrenArray), 1);
        attObj[path[path.length-1]] = null;
    }
    delete  attObj[path[path.length-1]];
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

    gameAttributes_createModule_recursiveListDisplayAll();
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
                if(!currentPath) {
                    currentAttributeObj = project_project['gameAttributes'][attributeID];
                    gameAttributes_createModule_displayFolder(currentAttributeObj.path);
                }
                gameAttribute_createModule_updateContextPane();

			},
			function(results){
				if (results[0] == ""){return false;}
       		else { return true;}
			});
}

function gameAttributes_createModule_openEditAttributeModal(attributeID)
{
 defineAttributeModal.prompt(attributeID, false, currentAttributeObj.path);
    gameAttributes_createModule_displayFolder(currentAttributeObj.path);
}


function gameAttributes_createModule_deleteAttribute(attributePath){
    gameAttributes_deleteAttribute(attributePath);
    $('#' + path[path.length-1] + '-list-element').remove();
    $('#' + currentAttributeObj.id + '-inner-list li:last-child').addClass('lastChild');
    gameAttributes_createModule_displayFolder(currentAttributeObj.path);
}

//updates attribute modal when attribute is clicked on
function gameAttributes_createModule_displayFolder(attributePath){
    if(!attributePath)
    {
        $('#folder-container').empty();
        $('#values-container').empty();
        $('#folder-breadcrumbs-container').empty();
        $('.attributesButton').hide();
    }
    else
    {
        currentAttributeObj = gameAttributes_find(attributePath);
        gameAttribute_createModule_updateBreadcrumbs();
        gameAttribute_createModule_updateContextPane();

        if(currentAttributeObj.NO_DELETE)
        {
            $('.attributesButton').show();
            $('.hide-on-prevent-delete').hide()

        }else{
            $('.attributesButton').show();
        }


    }
}

function gameAttributes_createModule_deleteFolder(){

    //Open modal to warn
    myModal.prompt("Are You Want To Delete "+ currentAttributeObj.name  +"?", "Deleting a folder will also delete all sub-folder and values", false,
        function(results){
            //Delete if user confirms
            gameAttributes_deleteAttribute(currentAttributeObj.path);
            gameAttributes_createModule_displayFolder(false);
            $('#' + path[path.length-1] + '-list-element').remove();
            $('#' + currentAttributeObj.id + '-inner-list li:last-child').addClass('lastChild');
            gameAttributes_createModule_recursiveListDisplayAll();
        },
        function (results) { return true; });


}

function gameAttributes_createModule_openEditFolderModal(){
    myModal.prompt("Updating Folder: "+ currentAttributeObj.name , "Enter a new folder name below", [{name: "Folder Name", default: currentAttributeObj.name, type: "text"}],
        function(results){
            //Update Folder Name
            currentAttributeObj.name = results[0];
            $('.' + currentAttributeObj.id + '-name').text(results[0]);
            gameAttributes_createModule_displayFolder(currentAttributeObj.path);
        },
        function (results) {
            if (results[0] == "") {
                Materialize.toast("Please Enter A Folder Name", 'rounded', 3000, 'dismissible');
                return false;
            }else{
                return true;
            }
        }
    );


}
/*END DOCUMENT METHODS */


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
            folderHtml = '<div class="folder card-panel hoverable" onclick="gameAttributes_createModule_displayFolder(\'' + attribute.path + '\')"><h6 class="folder-title left">' + attribute.name + '</h6></div>';
            folderList.append(folderHtml);
        }else{ //otherwise append value html
            valueHtml =   '<div id="'+ attribute.id +'-value-card" class="value-card-panel col l3 m6 s12 card-panel hoverable truncate">'
            +       '<i class="material-icons small">equalizer</i><span style="font-size: 19px; font-weight: bold">'+ attribute.name +'</span><hr/>'
            +           '<span style="font-size: 14px">Value: <span id="'+attribute.id+'-value" class="truncate" style="font-size: 19px; font-weight: bold">'+ attribute.value +'</span></span><br/>'
            +           '<span style="font-size: 14px">Range: <span id="'+attribute.id+'-min-value" style="font-size: 19px; font-weight: bold">'+ attribute.minValue +'</span>&nbspto&nbsp<span id="'+attribute.id+'-max-value" style="font-size: 19px; font-weight: bold">'+ attribute.maxValue +'</span></span><br/>'
            +           '<hr/>'
            +           '<a class="btn-floating red right hoverable" onclick="gameAttributes_createModule_deleteAttribute(\''+ attribute.path +'\')"><i class="material-icons small">delete</i></a>'
            +           '<a class="btn-floating blue right hoverable"onclick="gameAttributes_createModule_openEditAttributeModal(\''+ attribute.id +'\')"><i class="material-icons small">mode_edit</i></a>'
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
        $('#' + gameAttributes_find(attributeObj.parentPath).id + '-inner-list li:last-child').removeClass('lastChild');
    }

    else{
        parentInnerList = $('#all-attributes-inner-list');
        $('#all-attributes-inner-list li:last-child').removeClass('lastChild');
    }


    parentInnerList.append(listItemHtml);
    $('#' + attributeObj.id +'-list-element').addClass('lastChild');

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

    $('#all-attributes-inner-list li:last-child').addClass('lastChild');

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
            +                   '<label for="attribute-initValue-input" data-error="Please A Enter Valid Value" class="active" >Initial Value</label>'
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
            +                   '<label for="attribute-minValue-input" data-error="Please A Enter Valid Value" class="active">Minimum Value</label>'
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
            +                   '<label for="attribute-maxValue-input" data-error="Please A Enter Valid Value" class="active" >Maximum Value</label>'
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
                Materialize.updateTextFields();
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
            var validRange = true;

            var minToggle = this.minValueToggle.prop('checked');
            var maxToggle = this.maxValueToggle.prop('checked');
            var minValue = parseInt(this.minValueInput.val());
            var maxValue = parseInt(this.maxValueInput.val());
            var initValue = parseInt(this.initValueInput.val());


            //check name & init count fields
            if (this.nameInput.val() != undefined && this.nameInput.val() != "" && this.initValueInput.val() != undefined && this.initValueInput.val() != "")
                validated = true;


            if(this.maxValueToggle.prop('checked') && this.maxValueInput.val() == "" )
            {
                validated = false;
                maxValid = false;
            }


            if(this.minValueToggle.prop('checked') && this.minValueInput.val() == "" ) {
                validated = false;
                minValid = false;
            }

           if(minToggle){
               if(minValue > initValue){
                   validated = false;
                   validRange = false;
               }
           }

            if(maxToggle){
                if(maxValue < initValue){
                    validated = false;
                    validRange = false;
                }
            }

            if(maxToggle && minToggle){

                if(minValue > maxValue){
                    validated = false;
                    validRange = false;
                }

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
                    currentAttributeObj[this.attributeObj.id] = new GameAttribute(resultObj);
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
                console.log("value definition validation failed");

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

                if(!validRange)
                    Materialize.toast("Please make sure your range of values is valid", 7000, 'rounded', 'dismissible');


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


/* AUXILIARY METHODS */

//Will attempt to navigate to path, will return false if path is not valid
function gameAttributes_attemptFind(s_path){
    path = s_path.split("_");
    var attObj = project_project["gameAttributes"];

    for(var i=0; i<path.length; i++){
        if(attObj[path[i]] == undefined)
          return false;

        attObj = attObj[path[i]];
    }

    return attObj;
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

//used to generate random unique IDS for attributes
function generateID()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 4; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

/* END AUXILIARY METHODS */
