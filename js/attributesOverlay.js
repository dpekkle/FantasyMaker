goog.provide('attributesOverlay')
goog.require('project')
goog.require('conditions')

var attributeCount = 0;
var attID = 0; //value to make sure each attribute has a unique ID regardless of attribute count





function attributesOverlay_openAttributesOverlay(){
    //TODO - Pull existing attributes from DB if needed
}


function attributesOverlay_addAttribute(listID){
    //html of attribute row
    var newAttributeHtml = '<li id="att-' + attID +'">  <div class="collapsible-header" id="att-' + attID + '-header">Attribute Name</div> <div class="collapsible-body"> <br/>' +
        ' <div class="row"> <div class="input-field col s4">' +
        ' <input id="att-' + attID + '-name" type="text" class="validate"> ' +
        '<label for="att-' + attID + '-name">Name</label> </div> <div class="input-field col s2"> ' +
        '<input id="att-max-val" type="number"/> <label for="att-max-val">Max Value</label> </div>' +
        ' <div class="input-field col s2"> <input id="att-init-value" type="number"/> ' +
        '<label for="att-init-value">Initial Value</label></div>  <button class="btn btn-default" id="att-' + attID + '" onclick="attributeOverlay_updateAttribute(this.id)">Update</button> </div> </div> </li>';

    $('#' + listID).append(newAttributeHtml);

    attributeCount++;
    attID++;

}

function attributeOverlay_updateAttribute(inputID) {
    //Attributes are distinguished by ID's, to get the Max Value of the 3rd attribute on the list:
    //'formID + -Max'

    var attName = $('#'+ inputID + '-name').val();
    $('#' + inputID + '-header').html(attName); //Update Attribute name in header

    //TODO - Bind data to project_project(russell)


}

function attributeOverlay_deleteAttribute(){

    //TODO - Implement attribute Deletion (russell)

}
