/*
	Name: gameInventory.js
	Created By: Russell
  Purpose: To allow the user to create and define game inventory items and set up their representations in the ui
*/

goog.provide('gameInventory');
goog.require('project');


/* MAIN INVENTORY METHODS */
function InventoryItem(itemObj) {
    this.itemID = itemObj.itemID;
    this.name = itemObj.name;
    this.description = itemObj.description;
    this.initCount = itemObj.initCount;
    this.modifiers = itemObj.modifiers;
    this.playCount = this.initCount;
    /*
     modifiers format :
     'modifiers' : {
        {
        attributePath : < path of attribute to be modified>
        modifierValue : <Value to modify by +/-> NOTE : only supporting addition/subtraction right now
        }
     }
     */

}


    function gameInventory_defineItem(name, description) {
        var newItemID = "item-" + generateID();
        project_project.gameInventory[newItemID] = new InventoryItem(newItemID, name, description);

        //return project_project.gameInventory[newItemID];
    }

//edits & returns existing item
    function gameInventory_editItem(itemID, name, description) {
        var itemObject = project_project.gameInventory[itemID];
        itemObject.name = name;
        itemObject.description = description;

        return itemObject;
    }

    function gameInventory_deleteItem(itemID) {
        project_project.gameInventory[itemID] = null;
        delete  project_project.gameInventory[itemID];
    }

    function gameInventory_getItem(itemID) {
        return project_project.gameInventory[itemID];
    }

    function gameInventory_addModifier(itemID, modifierID, modifierObj) {
        project_project.gameInventory[itemID].modifiers[modifierID] = modifierObj;
    }

    function gameInventory_deleteModifier(itemID, modifierID) {
        ///check if item exists before attempting to delete modifier
        if (project_project.gameInventory[itemID] != undefined) {
            project_project.gameInventory[itemID].modifiers[modifierID] = null;
            delete project_project.gameInventory[itemID].modifiers[modifierID];
        }
    }

    //returns array of modifier objects for specified item
    function gameInventory_getAllItemModifiers(itemID){
        var modifierArray = [];
        for (var modID in project_project.gameInventory[itemID].modifiers) {
            modifierArray.push(project_project.gameInventory[itemID].modifiers[modID]);
        }
        return modifierArray;
    }

    /* END MAIN INVENTORY METHODS */

    /* INVENTORY CREATE MODULE DOCUMENT METHODS */
    //ALL ITEMS HAVE ID WITH FORMAT 'item-[ITEMID]'

    function gameInventory_createModule_defineItem() {
        var itemID = 'item-' + generateID();//Generate ID that will be used for the item & item html elements
        defineItemModal.prompt(itemID, true);
    }

    function gameInventory_createModule_updateItem(itemID) {
        defineItemModal.prompt(itemID, false);
    }


    function gameInventory_createModule_updateItemHtml(itemID) {
        var displayName = $('.' + itemID + '-name');
        var displayDescription = $('.' + itemID + '-description');
        var displayInitCount = $('.' + itemID + '-initCount');
        var displayModifiers = $('.' + itemID + '-modifiers-list');
        var itemObj = project_project.gameInventory[itemID];

        displayName.text(itemObj.name);
        displayDescription.text(itemObj.description);
        displayInitCount.text(itemObj.initCount);
        displayModifiers.empty();

         var modifierObj = {};
        for (var modID in project_project.gameInventory[itemID].modifiers) {
            modifierObj = project_project.gameInventory[itemID].modifiers[modID];
            var valueString;
            if(modifierObj.modifierValue < 0)
                valueString = '<span style="font-weight: bold;"> ' + modifierObj.modifierValue + '</span>';
            else
                valueString = '<span style="font-weight: bold;">+ ' + modifierObj.modifierValue + '</span>';


            if(gameAttributes_find(modifierObj.attributePath) != undefined)
                displayModifiers.append('<div class="chip">' + gameAttributes_find(modifierObj.attributePath).name + valueString + '</div>');
        }
    }

    function gameInventory_createModule_deleteItem(itemID){
        $('.' + itemID + '-list-element').remove();
        gameInventory_deleteItem(itemID);
    }



    function gameInventory_createModule_appendItemDiv(itemID, itemObj) {
        /* Applies Item Div skeleton with ID's if no itemObj is supplied */
        var itemHtml = ''
            + '<li class="' + itemID + '-list-element">'
            + '<div class="collapsible-header"><span class="' + itemID + '-name">' + itemObj.name + '</span></div>'
            + '<div class="collapsible-body">'
            + '<div class="row pos-relative ">'
            + '<div class="col m6"><h6><i class="material-icons small">subject</i>Description: </h6><hr/><p class="' + itemID + '-description">' + itemObj.description + '</p></div>'
            + '<div class="col m6"><h6><i class="material-icons small">stars</i>Modifiers: </h6><hr/> <div class="' + itemID + '-modifiers-list"></div> </div> </div><hr/>'
            + '<div class="row" style="margin-bottom: 1px">'
            + '<div class="col m4"> Initial Count: <span class="' + itemID + '-initCount"></span></div>'
            + '<div class="col m1 offset-m9">'
            + '<a class="btn-floating btn-small waves-effect waves-light blue edit-button" onclick="gameInventory_createModule_updateItem(' + '\'' + itemID + '\'' + ')"><i class="small material-icons">mode_edit</i></a> &nbsp;'
            + '</div>'
            + '<div class="col m1">'
            + '<a class="btn-floating btn-small waves-effect waves-light red delete-button"  onclick="gameInventory_createModule_deleteItem(' + '\'' + itemID + '\'' + ')"><i class="small material-icons">delete</i></a>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</li>';

        $('.inventory-item-list').append(itemHtml);

    }

    function gameInventory_createModule_populateItemsList() {
        for (var itemId in project_project.gameInventory) {
            gameInventory_createModule_appendItemDiv(itemId, project_project.gameInventory[itemId]);
            gameInventory_createModule_updateItemHtml(itemId);
        }
    }



//Enforces Referential Integrity between attributes & inventory item modifiers
    function gameInventory_checkForRemovedAttributes(){
        var modifierObj;
        for (var itemId in project_project.gameInventory) {
            modifierObj = project_project.gameInventory[itemId].modifiers;


            for(var modifier in modifierObj){
                if(gameAttributes_attemptFind(modifierObj[modifier].attributePath) == false|| gameAttributes_attemptFind(modifierObj[modifier].attributePath) == undefined){
                    modifierObj[modifier] = null;
                    delete modifierObj[modifier];
                }

            }
        }
    }

    function DefineItemModal() {
        this.confirm = false;
        this.isNewItem = false;
        this.currentItemID = null;
        this.modifierCount = 0;

        this.init = function () {
            $("body").append(''
                + '<div id="define-item-modal" class=" modal modal-fixed-footer">'
                + '<div class="modal-content">'
                + '<div class="row row-centered">'
                + '<h3>Define Item</h3>'
                + '<div class="input-field col m6">'
                + '<input id="item-name-input" class="validate"  type="text"/>'
                + '<label for="item-name-input" data-error="Required" class="active" >Item Name</label>'
                + '</div>'
                + '<div class="input-field col m2 offset-m4">'
                + '<input id="item-initCount-input" class="validate" value="0" type="number"/>'
                + '<label for="item-initCount-input" data-error="Required" class="active" >Initial Item Count</label>'
                + '</div>'
                + '<div class="input-field col m6">'
                + '<textarea id="item-detail-input" class="materialize-textarea"></textarea>'
                + '<label for="item-detail-input" class="active">Item Description</label>'
                + '</div>'
                + '<button class="col m4 offset-m2 btn tooltipped" data-tooltip="Modifiers will modify attributes when they are in a players inventory" onclick="defineItemModal.addModifierInput(true);" style="margin-top: 75px;">Add Attribute Modifier</button>'
                + '</div>'
                + '<div class="row row-centered">'
                + '<ul class="item-modifiers-input-list"></ul>'
                + '</div>'
                + '</div>'
                + '<div class="modal-footer">'
                + '<a href="#!" class=" modal-action modal-close waves-effect waves-red btn-flat" onclick="defineItemModal.evaluateModal(false)">Cancel</a>'
                + '<a href="#!" class=" modal-action waves-effect waves-green btn-flat" onclick="defineItemModal.evaluateModal(true)">Confirm</a>'
                + '</div>'
                + '</div>');
        };


        this.prompt = function (itemID, isNewItem) {
            var nameInput = $('#item-name-input');
            var detailInput = $('#item-detail-input');
            var initCountInput = $('#item-initCount-input');
            var modifierInputs = $('.item-modifiers-input-list');
            var itemObj = null;
            this.currentItemID = itemID;
            this.isNewItem = isNewItem;
            this.modifierCount = 0;

            $('#item-modifiers-input-list').empty();

            //If it is not a new item (editing existing item), pre-fill inputs
            if (!this.isNewItem) {
                itemObj = project_project.gameInventory[itemID];
                nameInput.val(itemObj.name);
                detailInput.val(itemObj.description);
                detailInput.trigger('autoresize');
                initCountInput.val(itemObj.initCount);

                for (var modID in project_project.gameInventory[itemID].modifiers) {
                    if(project_project.gameInventory[itemID].modifiers[modID].attributePath != "")
                        this.addModifierInput(false, modID, project_project.gameInventory[itemID].modifiers[modID]);
                    else
                        delete project_project.gameInventory[itemID].modifiers[modID];
                }

            }

            $('#define-item-modal').openModal({
                dismissible: true,
                ready: function(){
                },
                complete: function(){
                    nameInput.val('');
                    detailInput.val('');
                    initCountInput.val('');
                    modifierInputs.empty();
                }
            });


        };

        this.evaluateModal = function (status) {
            var nameInput = $('#item-name-input');
            var detailInput = $('#item-detail-input');
            var initCountInput = $('#item-initCount-input');
            var modifierInputs = $('.item-modifiers-input-list');
            var allModifierValueInputs = $('.modifier-value-input');

            if (status) //user confirmed operation
            {
                var validated = false;

                //check name & init count fields
                if (nameInput.val() != undefined && nameInput.val() != "" && initCountInput.val() != undefined && initCountInput.val() != "")
                    validated = true;


                var validModifiers = true;
                //check modifier input fields
                allModifierValueInputs.each(function() {
                    if($(this).val() == "" || $(this).val() == undefined){
                        $(this).addClass("invalid");
                        validModifiers = false;
                        validated = false;
                    }

                });

                //User confirmed operation & input was validated
                if (validated) {
                    //Get input
                    var resultObj = {
                        name: nameInput.val(),
                        itemID: this.currentItemID,
                        description: detailInput.val(),
                        initCount: initCountInput.val(),
                        modifiers: this.evaluateModifiers()
                    };

                    //If it is a new item, add to memory
                    if (this.isNewItem) {
                        project_project.gameInventory[this.currentItemID] = new InventoryItem(resultObj);
                        gameInventory_createModule_appendItemDiv(this.currentItemID, project_project.gameInventory[this.currentItemID]);
                        gameInventory_createModule_updateItemHtml(this.currentItemID);
                    }
                    else {
                        //upating an already existing item
                        project_project.gameInventory[this.currentItemID] = new InventoryItem(resultObj);
                        gameInventory_createModule_updateItemHtml(this.currentItemID);
                    }

                    if (detailInput.val() == undefined || detailInput.val() == "")
                        detailInput.val("No description provided");

                    //close modal, clear inputs
                    $('#define-item-modal').closeModal();
                    nameInput.val('');
                    detailInput.val('');
                    initCountInput.val('0');
                    modifierInputs.empty();
                }
                else {
                    console.log("item definition validation failed");

                    if(nameInput.val() == undefined || nameInput.val() == ""){
                        Materialize.toast("Please provide an item name", 5000, 'rounded', 'dismissible');
                        nameInput.addClass("invalid");
                    }

                    if(initCountInput.val() == undefined || initCountInput.val() == ""){
                        Materialize.toast("Please provide an item count", 7000, 'rounded', 'dismissible');
                        initCountInput.addClass("invalid");
                    }

                    if(!validModifiers)
                        Materialize.toast("Please provide valid attribute modifier values", 9000, 'rounded', 'dismissible');


                }
            }
            else // user cancelled operation
            {
                //close modal, clear inputs
                $('#define-item-modal').closeModal();
                nameInput.val('');
                detailInput.val('');
                initCountInput.val('0');
                modifierInputs.empty();

            }

        };

        this.addModifierInput = function (isNewModifier, modID, modObj) {

            if (isNewModifier)
                var modifierID = 'modifier-' + generateID();
            else
                var modifierID = modID;


            var html = '<li id=inventoryItemModifierRow_' + modifierID + '>'
                + '<div class="row">'
                + generic_generateAttributeButton(modifierID + '-modifyAttributeInput', 'game-attributes') //context menu just has game attributes
                + '<div class="input-field col m2"><input id="' + modifierID + '-modifyAmountInput" type="number" class="modifier-value-input validate"/><label data-error="Required" class="active">Modify Amount</label></div>'
                + '<div class="col m1"><button class="btn-floating red offset-m2" style="margin-top: 20px;" onclick="defineItemModal.removeModifierInput(\'' + modifierID + '\');"><i class="small material-icons">delete</i></button></div>'
                + '</div>'
                + '<div class="divider"></div>'
                + '</li>';

            this.modifierCount++;


            $('.item-modifiers-input-list').append(html);
            $('select').material_select();


            if (!isNewModifier) {
                $('#' + modifierID + '-modifyAmountInput').val(modObj.modifierValue);
                $('#' + modifierID + '-modifyAttributeInput').text(gameAttributes_find(modObj.attributePath).name);
                $('#' + modifierID + '-modifyAttributeInput').attr('path', modObj.attributePath);
                updateTooltip(modifierID, modObj.attributePath);
                //attributeSelected(gameAttributes_find(modObj.attributePath).name, modifierID + '-modifyAttributeInput', gameAttributes_find(modObj.attributePath));
            }
            else
                initAttributeButton(modifierID + '-modifyAttributeInput');


        };

        this.removeModifierInput = function (modifierID) {
            $('#inventoryItemModifierRow_' + modifierID).remove();
            this.modifierCount--;
        };

        this.evaluateModifiers = function () {

            var modifiersIdArray = [];
            var resultObj = {};
            $('.item-modifiers-input-list').children().each(function () {
                modifiersIdArray.push($(this).attr('id').split("_")[1]);
            });

            for (var c = 0; c < modifiersIdArray.length; c++) {
                var modId = modifiersIdArray[c];
                if($('#' + modId + '-modifyAttributeInput').attr('path') != undefined) {
                    var modifyAtt = $('#' + modId + '-modifyAttributeInput').attr('path');
                    var modifyAmount = $('#' + modId + '-modifyAmountInput').val();

                    resultObj[modId] = {attributePath: modifyAtt, modifierValue: modifyAmount};
                    }
                }

            return resultObj;

        }
    }



var defineItemModal = new DefineItemModal();
defineItemModal.init();
/* END INVENTORY CREATE MODULE DOCUMENT METHODS */
