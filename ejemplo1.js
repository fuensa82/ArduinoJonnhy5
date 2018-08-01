var five = require("johnny-five");
var http = require('http');
var express = require('express');

var pinBajaToldo=9;
var pinParaToldo=11;
var pinSubeToldo=10;
var pinLed13=13;
var estadoToldo="off";

var board = new five.Board({
  port: "COM4"
});


var promise = new Promise(function(resolve, reject) {
  board.on("ready", function() {
    this.pinMode(pinBajaToldo, this.MODES.OUTPUT);
    this.pinMode(pinParaToldo, this.MODES.OUTPUT);
    this.pinMode(pinSubeToldo, this.MODES.OUTPUT);
    this.pinMode(pinLed13, this.MODES.OUTPUT);
    resolve(this);
  });

});
//La placa ya está preparada
promise.then((board)=> {
  var app = express();
  app.listen(4321);
  app.use(express.static('estaticos'));
  
  app.get('/ponToldo',function(req, res){
      console.log("ponToldo");
      estadoToldo="on";
      res.json({resp:"Enviada orden de puesta"});
  });
  app.get('/quitaToldo',function(req, res){
      console.log("quitaToldo");
      estadoToldo="off";
      res.json({resp:"Enviada orden de quitado"});
  });
  
  app.get('/paraToldo',function(req, res){
      console.log("paraToldo");
      board.digitalWrite(pinParaToldo,1);
      setTimeout(()=>{
        board.digitalWrite(pinParaToldo,0);
      },500);
      estadoToldo="half";
      res.json({resp:"Enviada orden de parar Toldo"});
  });
  
  app.get('/estadoToldo',function(req, res){
      console.log("estadoToldo");
      res.json({resp:estadoToldo});
  });
  
  app.get('*',function(req, res){
      console.log("Resto");
      res.json({resp:"Orden no reconocida"});
  });


}, function(err) {
  console.log(err);
});