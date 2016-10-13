goog.provide('gameInventory');
goog.require('project');


/* MAIN INVENTORY METHODS */
function InventoryItem(itemID, name, description){
    this.itemID = itemID;
    this.name = name;
    this.description = description;
    this.itemCount = 0; //allow user to set at definition?
    //this.playCount = this.itemCount; //updated during playthrough?
}

//defines and returns new item
function gameInventory_defineItem(name, description){
    var newItemID = "item-" + generateID();
    project_project.gameInventory[newItemID] = new InventoryItem(newItemID, name, description);

    return project_project.gameInventory[newItemID];
}
//edits & returns existing item
function gameInventory_editItem(itemID, name, description){
   var itemObject = project_project.gameInventory[itemID];
    itemObject.name = name;
    itemObject.description = description;

    return itemObject;
}

function gameInventory_deleteItem(itemID){
    project_project.gameInventory[itemID] = null;
    delete  project_project.gameInventory[itemID];
}

function gameInventory_getItem(itemID){
    return project_project.gameInventory[itemID];
}

/* END MAIN INVENTORY METHODS */

/* CREATE MODULE DOCUMENT METHODS */
function gameInventory_openDefineItemOverlay() {
    myModal.prompt("Define a New Item", "Define an item below",
        [{name: "Item Name", default: "", type: "text"}, {name: "Item Description", default: "", type: "text" }],
        function(results)
        {
            //define new item, and append to list in item definition modal
            gameInventory_definitionModal_append(gameInventory_defineItem(results[0], results[1]));
        },
        function(results)
        {
            //this is the verification function, it will occur before the callback
            //if true then callback is called
            //if false then the window will not close, and the callback will not fire
            console.log("Verifying ", results[0]);
            if (results[0] == "")
            {
                Materialize.toast('Please enter an item name', 3000, 'rounded');
                return false;
            }
            else
            {
                console.log("item name successfully verified");
                Materialize.toast('New Item Defined', 3000, 'rounded');
                return true;
            }
        });
}

function gameInventory_openEditItemOverlay(itemID){
    var itemObj = gameInventory_getItem(itemID);
    myModal.prompt("Editing " + itemObj.name, "Update item below",
        [{name: "Item Name", default: itemObj.name, type: "text"}, {name: "Item Description", default: itemObj.description, type: "text" }],
        function(results)
        {
            //define new item, and append to list in item definition modal
            gameInventory_definitionModal_update(gameInventory_editItem(itemID, results[0], results[1]));
        },
        function(results)
        {
            //this is the verification function, it will occur before the callback
            //if true then callback is called
            //if false then the window will not close, and the callback will not fire
            console.log("Verifying ", results[0]);
            if (results[0] == "")
            {
                Materialize.toast('Please enter an item name', 3000, 'rounded');
                return false;
            }
            else
            {
                console.log("item name successfully verified");
                Materialize.toast('Item Updated', 3000, 'rounded');
                return true;
            }
        });
}

    //add the new item definition to the list of defined items
    function gameInventory_definitionModal_append(item){
        var itemHtml = ''
            + '<li class="'+ item.itemID +'-list-element">'
            + '<div class="collapsible-header"><span class="' + item.itemID + '-name">' + item.name + '</span></div>'
            +  '<div class="collapsible-body">'
            +      '<div class="row pos-relative ">'
            +      '<div class="col m12"><h6>Description: </h6></div>'
            +      '<div class="col m12"><p class="'+ item.itemID +'-description">'+ item.description  +'</p>'
            +          '<div class="col m3 offset-m9 attribute_float-bottom pos-absolute">'
            +              '<a class="btn-floating btn-small waves-effect waves-light blue edit-button" onclick="gameInventory_openEditItemOverlay(' + '\'' + item.itemID + '\'' +')"><i class="small material-icons">mode_edit</i></a> &nbsp;'
            +              '<a class="btn-floating btn-small waves-effect waves-light red delete-button"  onclick="gameInventory_definitionModal_delete(' + '\'' + item.itemID + '\'' +')"><i class="small material-icons">delete</i></a>'
            +          '</div>'
            +      '</div>'
            +  '</div>'
            +    '</li>';

        $('.inventory-list').append(itemHtml);
    }

    //Update the listing of an already existing item
    //CALLED FROM MODAL
    function gameInventory_definitionModal_update(item){
        $('.' + item.itemID + '-name').text(item.name);
        $('.' + item.itemID + '-description').text(item.description);
    }

    //CALLED FROM HTML
    function gameInventory_definitionModal_delete(itemID){
        $('.' + itemID + '-list-element').remove();
        gameInventory_deleteItem(itemID);
    }

/* END CREATE MODULE DOCUMENT METHODS */






