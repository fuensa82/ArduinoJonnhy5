var five = require("johnny-five");
var express = require('express');
var app = express();
var server = require('http').Server(app);
var utils = require("./modulos/utils");

var pinBajaToldo=9;
var pinParaToldo=11;
var pinSubeToldo=10;
var pinLed13=13;
estadoToldo="off";
ultimaAccion="off";
ultimaHora=utils.getFechaYHora(); //indica la ultima hora a la que se quitó o puso por completo el toldo
timeMillis=utils.getTimeMillis();
millisEstadoActual=0;

console.log(utils.getFechaYHora());

var board = new five.Board({
  //port: "COM4"
  port: "/dev/ttyACM0"
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
  app.listen(4321);
  app.use(express.static('estaticos'));
  
  app.get('/ponToldo',function(req, res){
      console.log("ponToldo");
      board.digitalWrite(pinBajaToldo,1);
      setTimeout(()=>{
        board.digitalWrite(pinBajaToldo,0);
      },50);
      estadoToldo="on";
      utils.guardaEstado("on");
      res.json({resp:"Enviada orden de puesta"});
  });
  app.get('/quitaToldo',function(req, res){
      console.log("quitaToldo");
      board.digitalWrite(pinSubeToldo,1);
      setTimeout(()=>{
        board.digitalWrite(pinSubeToldo,0);
      },50);
      utils.guardaEstado("off");
      res.json({resp:"Enviada orden de quitado"});
  });
  
  app.get('/paraToldo',function(req, res){
      console.log("paraToldo");
      board.digitalWrite(pinParaToldo,1);
      setTimeout(()=>{
        board.digitalWrite(pinParaToldo,0);
      },50);
      utils.paradaDeToldo();
      res.json({resp:"Enviada orden de parar Toldo"});
  });
  
  app.get('/estadoToldo',function(req, res){
      console.log("estadoToldo");
      if(estadoToldo=="half"){
        var aux=Math.round((millisEstadoActual/10)/51);
        res.json({resp:(aux+" %")});
      }else{
        res.json({resp:estadoToldo});
      } 
  });

  app.get('/hora', function(req,res){
      res.json({resp:ultimaHora});
  });

}, function(err) {
  console.log(err);
});