//Devuelve la fecha y hora actual en formato hh:mm dd/mm/aaaa
function getFechaYHora(){
    var fecha=new Date();
    var aux="";
    var dia=rellenarPorIzq(fecha.getDate(),2,'0');
    var mes=rellenarPorIzq(fecha.getMonth()+1,2,'0');
    var anio=fecha.getFullYear();
    var min=rellenarPorIzq(fecha.getMinutes(),2,'0');
    var hora=rellenarPorIzq(fecha.getHours(),2,'0');
    return hora+":"+min+" "+dia+"/"+mes+"/"+anio;
}
/**
 * Crea un string de como máximo 20 caracteres
 * @param {Numero que se quiere rellena} num 
 * @param {Longitud total que queremos que tenga la cadena resultado} longTotal 
 * @param {Caracter con el que queremos rellenar la cadena} caracter 
 */
function rellenarPorIzq(num,longTotal,caracter){
    var relleno="";
    for(var i=0;i<longTotal;i++){
        relleno+=caracter;
    }
    var aux=relleno+num;
    return aux.substring(aux.length-longTotal);
}
/**
 * 
 */
function getTimeMillis(){
    var hora=new Date();
    return hora.getTime();
}
/**
 * Funcion que solo se debe utilizar a la hora de poner y parar el toldo, nunca cuando se pare. Guardará el estado y la hora de ejecucion
 * @param {Accion enviada al toldo} accion
 */
function guardaEstado(accion){
    //estadoToldo=estado;
    //ultimaAccion=estado;
    timeMillis=getTimeMillis();
    ultimaHora=getFechaYHora();
}

function paradaDeToldo(){
    //estado="half";
    if(estadoToldo=="half"){
        return
    }
    ultimaHora=getFechaYHora();
    var timeMillisNuevo=getTimeMillis();
    timeTotal=timeMillisNuevo-timeMillis;
    
    console.log("timeMillis: "+timeMillis);
    console.log("timeMillisNuevo "+timeMillisNuevo);
    console.log("millisEstadoActual "+millisEstadoActual);
    
    timeMillis=timeMillisNuevo;
    if(parseInt(timeTotal)>51000){
        //si el tiempo transcurrido es mayor de 51s es que ya ha terminado el todo.
        if(estadoToldo=="on"){
            millisEstadoActual=51000;
        }else{
            millisEstadoActual=0;
        }
    }else{
        if(estadoToldo=="on"){
            millisEstadoActual+=timeTotal;
        }else{
            millisEstadoActual-=timeTotal;
        }
        if(millisEstadoActual<0){
            millisEstadoActual=0;
            estadoToldo="off";
        }else if(millisEstadoActual>51000){
            millisEstadoActual=51000;
            estadoToldo="on";
        }else{
            estadoToldo="half";
        }
    }
}

exports.getFechaYHora=getFechaYHora;
exports.getTimeMillis=getTimeMillis;
exports.rellenarPorIzq=rellenarPorIzq;
exports.paradaDeToldo=paradaDeToldo;
exports.guardaEstado=guardaEstado;