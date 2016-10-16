goog.provide('logger')

function Logger(){
  this.data = []
  this.player = []

  this.flush = function(){
    this.data = []
    this.player = []
  }

  this.log = function(string){
    this.data.push(string)
  }

  this.playerLog = function(string){
    this.player.push(string)
  }

  this.outputAsArray = function(){
    return this.data
  }

  this.outputPlayerAsArray = function(){
    return this.player
  }

  this.makerOutput = function(){
    var html =  '<h4>Control Node Output</h4>'+
                this.outputAsArray()+
                '</div>'
    return html
  }

  this.playerOutput = function(){
    var html = this.outputPlayerAsArray()
    return html

    //return 'PLAYER DATA'
  }

}

var logger = new Logger()
