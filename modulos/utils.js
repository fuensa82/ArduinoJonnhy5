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

exports.getFechaYHora=getFechaYHora;