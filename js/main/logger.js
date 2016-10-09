goog.provide('logger')

function Logger(){
  this.data = []

  this.flush = function(){
    this.data = []
  }

  this.log = function(string){
    this.data.push(string)
  }

  this.outputAsArray = function(){
    return this.data
  }

  this.controlOutputHTML = function(){
    var html =  '<h4>Control Node Output</h4>'+
                this.outputAsArray()+
                '</div>'
    return html
  }

}

var logger = new Logger()
