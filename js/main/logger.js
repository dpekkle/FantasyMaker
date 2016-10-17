goog.provide('logger')

function Logger(){
  this.data = []
  this.player = []

  //game maker output(control node)
  this.flush = function(){
    this.data = []
    this.player = []
  }

  this.log = function(string){
    this.data.push(string)
  }

  this.makerOutput = function(){
    return this.data
  }


  //outcome text output
  this.outputAsArray = function(){
    return this.data
  }

  this.playerLog = function(string){
    this.player.push(string)
  }

  this.outputPlayerAsArray = function(){
    return this.player
  }



  this.playerOutput = function(){
    var html = ''

    for(idx in this.player){
      var line = this.player[idx]
      html += line + '</br>'
    }

    return html

    //return 'PLAYER DATA'
  }

}

var logger = new Logger()
