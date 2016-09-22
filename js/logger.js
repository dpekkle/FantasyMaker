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

}

var logger = new Logger()
