goog.provide('gameAttributes')
goog.require('project')

function GameAttribute(parent_path, parent_level, name, attID, value){
    this.name = name;
    this.value = value;
    if(parent_path != null){
        this.level = parent_level + 1;
        this.path = parent_path.push(attID);
    }
    else{
        this.path = [attID];
        this.level = 0;
    }


    this.addChild = function(new_name, value){
        var newID = generateID();
        this[newID] = new GameAttribute(this.path, this.level, new_name, newID, value);
        console.log("New Nested attribute added under: " + this.path[this.level]);
        console.log("New Attribute ID: " + newID);
        //TODO - Remove this.value?
        //TODO - Append HTML to this in document
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

function gameAttributes_display(s_path){
    //TODO - GRAB INFORMATION OF ATTRIBUTE, BIND TO DOCUMENT
}

function gameAttributes_displayAll(){
    //TODO - DISPLAY INDEX OF ALL ATTRIBUTES IN HTML

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
