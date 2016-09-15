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


    //var attributeTitle = $('#attribute-detail-title');
    //var classList = $('#attribute-detail-class-list');
    var valueList = $('#values-list');
    var addClassInput = $('#add-class-name');
    var addValueNameInput = $('#add-value-name');
    var addValueDataInput = $('#add-value-data');

    //clear old html
   // classList.empty();
    valueList.empty();
    //attributeTitle.text(" ");
    //attributeTitle.text(attribute.name)

    //TODO - UPDATE ATTRIBUTE NAME
    if (attribute.is_leaf){
        //$('#attribute-detail').show();
      //TODO - DISPLAY VALUE HTML w/ FORM TO UPDATE
    }else{
        //$('#attribute-detail').show();

        //Bind current attribute path to the input fields
        //addClassInput.attr('data-path', attribute.path);
        //addValueDataInput.attr('data-path', attribute.path);
        //addValueNameInput.attr('data-path', attribute.path);

        var i;
        var childrenArray = attribute.children;
       for(i=0; i<childrenArray.length; i++){
            if(attribute[childrenArray[i]].is_leaf){
                var childObj = attribute[childrenArray[i]];
                $.ajax({
                    url: "attribute_partial.html",
                    success: function (data) {
                       if(valueList.append(data))
                           console.log($('#temp_title_id').id);
                    },
                    dataType: 'html'
                });


                //grab all temporary ID'ed elements to update
                var tempTitle = $('#temp_title_id');
                var tempInitVal = $('#temp_init_value_id');
                var tempMaxVal = $('#temp_max_value_id');
                var tempNameInput = $('#temp_name_edit_input');
                var tempNameInputLabel = $('#temp_name_edit_input_label');
                var tempInitValInput = $('#temp_init_val_edit_input');
                var tempInitValInputLabel = $('#temp_init_val_edit_input_label');
                var tempMaxValInput = $('#temp_max_val_edit_input');
                var tempMaxValInputLabel = $('#temp_max_val_edit_input_label');
                var tempUpdateButton = $('#temp_update_button');
                var tempDeleteButton = $('#temp_delete_button');


                //template of attribute/value list element has been loaded, update the temporary IDs and fields
                //Update Title & Value Fields
                console.log(childObj.name);
                //console.log(tempTitle).attr(id));
                tempTitle.text(childObj.name);
                tempTitle.attr('id', '' + childObj + '-display-name');

                tempInitVal.text(childObj.value); //TODO - Change to init Value
                tempInitVal.id = childObj + '-display-init-val';

                //tempMaxVal.text(childObj.value); //TODO - Change to max Value
                //tempMaxVal.id = childObj + '-display-max-val';

                //Update Input Field ID's, Labels, & data-path attributes
                tempNameInputLabel.attr('for', '' + childObj + '-edit-name-input');
                tempNameInput.data('path', childObj.path);
                tempNameInput.id = childObj + '-edit-name-input';

                tempInitValInputLabel.attr('for', '' + childObj + '-edit-init-input');
                tempInitValInput.data('path', childObj.path);
                tempInitValInput.id = childObj + '-edit-init-input';

                tempMaxValInputLabel.attr('for', '' + childObj + '-edit-max-input');
                tempMaxValInput.data('path', childObj.path);
                tempMaxValInput.id = childObj + '-edit-max-input';

                //Update buttons
                tempUpdateButton.data('path', childObj.path);
                //tempUpdateButton.onclick(updateAttribute());
                tempUpdateButton.id = childObj + '-update';

                tempDeleteButton.data('path', childObj.path);
                //tempDeleteButton.click(deleteAttribute());
                tempDeleteButton.id = childObj + '-delete'


            }
              //  valueList.append('<div class="chip" onclick="gameAttributes_display('+ '\'' + attribute[childrenArray[i]].path + '\'' +')">' + attribute[childrenArray[i]].name + ': ' + attribute[childrenArray[i]].value + '</div>'); //TODO - ADD LINK TO ATTRIBUTE OR EDIT BUTTON
            //else
                //classList.append('<div class="chip" onclick="gameAttributes_display('+ '\'' + attribute[childrenArray[i]].path + '\'' +')">' + attribute[childrenArray[i]].name + '</div>');
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

//TODO - COLLATE INTO ONE METHOD
function showAddTopLevelInput(){
    $('#new-top-level-button').hide();
    $('#new-top-level-container').show();
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

$("#add-top-level-name").keypress(function(event) {
    if (event.which == 13) {
        var class_name_input =$('#add-top-level-name');
        //--

       project_addTopGameAttribute(class_name_input.val());

        //Clear Fields
        class_name_input.val("");

        $('#new-top-level-button').show();
        $('#new-top-level-container').hide();
    }
});

//temporary function for dealing with button click
//TODO - Clean up
function temp_add_top_level() {
    var class_name_input =$('#add-top-level-name');
    //--

    project_addTopGameAttribute(class_name_input.val());

    //Clear Fields
    class_name_input.val("");

    $('#new-top-level-button').show();
    $('#new-top-level-container').hide();
}

