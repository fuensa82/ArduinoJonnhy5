var five = require("johnny-five");
var express = require('express');
var app = express();
var server = require('http').Server(app);
var utils = require("./modulos/utils");

var pinGrifoPrincipal=12;
var pinBajaToldo=9;
var pinParaToldo=11;
var pinSubeToldo=10;
var pinHumedad=0;
var tiempoRiego=3*60*1000; //3 MINUTOS
var sensorHumedad;
var humedadSuelo;
estadoToldo="off";
estadoRiego="off";
ultimaAccion="off";
ultimaHora=utils.getFechaYHora(); // 3 indica la ultima hora a la que se quitó o puso por completo el toldo
timeMillis=utils.getTimeMillis();
millisEstadoActual=0;
//Variales riego
ultimaHoraRiego=utils.getFechaYHora();
ultimaHoraRiegoCompleto=utils.getFechaYHora();

console.log(utils.getFechaYHora());

var board = new five.Board({
  //port: "COM4"
  port: "/dev/ttyACM0"
});

//Lo hacemos con promesas para no meter todo el servidor REST dentro de board.on
var promise = new Promise(function(resolve, reject) {
  board.on("ready", function() {
    this.pinMode(pinGrifoPrincipal, this.MODES.OUTPUT);
    this.pinMode(pinBajaToldo, this.MODES.OUTPUT);
    this.pinMode(pinParaToldo, this.MODES.OUTPUT);
    this.pinMode(pinSubeToldo, this.MODES.OUTPUT);
    //this.pinMode(pinHumedad, this.MODES.ANALOG);
    sensorHumedad = new five.Sensor({pin:pinHumedad,freq:10000});
    sensorHumedad.on("data", function() {
      humedadSuelo=sensorHumedad.scaleTo(50, 0);
      console.log("Humedad: "+humedadSuelo);
    });
    resolve(this);
  });

});
//La placa ya está preparada
promise.then((board)=> {
  app.listen(4321);
  app.use(express.static('estaticos'));
  board.digitalWrite(pinGrifoPrincipal,1);
  app.get('/humedad',function(rep,res){
    res.json({humedad:humedadSuelo});
  });
  app.get('/riega',function(req, res){
      console.log("riega");
      board.digitalWrite(pinGrifoPrincipal,0);
      setTimeout(()=>{
        board.digitalWrite(pinGrifoPrincipal,1);
        estadoRiego="off";
        console.log("Riego parado automaticamente");
        ultimaHoraRiegoCompleto=utils.getFechaYHora();
      },tiempoRiego);
      estadoRiego="on";
      res.json({resp:"Enviada orden de riego"});
  });
  app.get('/paraRiego',function(req, res){
      board.digitalWrite(pinGrifoPrincipal,1);
      console.log("riego parado");
      estadoRiego="off";
      ultimaHoraRiego=utils.getFechaYHora();
      res.json({resp:"Enviada orden de parar riego"});
  });
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

    app.get('/estado',function(req, res){
      console.log("estado");
      if(estadoToldo=="half"){
        var aux=Math.round((millisEstadoActual/10)/51);
        res.json({resp:(aux+" %"),resp2:estadoRiego});
      }else{
        res.json({resp:estadoToldo,resp2:estadoRiego});
      } 
  });

  app.get('/hora', function(req,res){
      res.json({resp:ultimaHora});
  });
  app.get('/horasRiego', function(req,res){
      res.json({ultimaHoraRiego:ultimaHoraRiego, ultimaHoraRiegoCompleto:ultimaHoraRiegoCompleto});
  });

}, function(err) {
  console.log(err);
});