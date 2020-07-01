var conductores = (localStorage.getItem("conductores") != null) ? JSON.parse(localStorage.getItem("conductores")) : [];
var image = 'http://maps.google.com/mapfiles/kml/shapes/cabs.png';
var comercios=(localStorage.getItem("comercio") != null) ? JSON.parse(localStorage.getItem("comercio")) : [];
var idVentanaActual = document.getElementsByName('yourid')[0].content;
var btn = document.getElementById('ejecutar');
var map1;
var tipo = document.getElementsByName('youruser')[0].content;
var contador=0;
function pedido(idComercio, respuesta, idConductor) {
    if (respuesta == null){
        let idUser = document.getElementsByName('yourid')[0].content;
        var comercioActual = comercios.find(element => element.id === idUser);
    }else{
        var comercioActual = {id: idComercio[0], lat: idComercio[1], lng: idComercio[2]};
    }
    if (comercioActual != null) {
        // se obtiene la posicion del conductor mas cercano
        const position = buscarConductor(comercioActual, respuesta, idConductor);
        if ( position != null ){
            generarComercio(comercioActual.id, comercioActual.lat, comercioActual.lng);
            conductores[position].ocupado = true;
            generarConductor(conductores[position].id, conductores[position].lat, conductores[position].lng);
          }
    }
}

function generarComercio(id, lat, lng) {
  var posicion= [id, lat, lng];
  localStorage.setItem("generandoComercio", posicion);
}

function generarConductor(id, lat, lng) {
  var posicion= [id, lat, lng];
  localStorage.setItem("PidiendoConductor", posicion);
}

function noSeEncontroConductor(id, respuesta){
  var mensaje=[id, contador ];
  if (respuesta != null){
  localStorage.setItem("resultados", mensaje);
  }
  contador++;
  if (idVentanaActual== id){// este if es porque el evento se ejecuta en las demas ventanas y no en la comercioActual
    alert("Sin resultados, Todos los conductores ocupados");//por ende muestro ese mensaje para q se vea q no hay conductores disponibles
  }
}

function buscarConductor(comercioActual, respuesta, idConductor) {
    let conductorMasCeranoId = 0;
    let mayor = 99999;
    conductores.forEach(function (item, index) {
      if(item.ocupado == true){
        if (respuesta != null){
          let datos=[idConductor, contador];
          localStorage.setItem("volviendoAFalso", datos);
          contador++;
        }
      }else{
        const lalitud = item.lat - comercioActual.lat;
        const longitud = item.lng - comercioActual.lng;
        const distancia = Math.sqrt( lalitud*lalitud + longitud*longitud );
        if (distancia < mayor) {
            mayor = distancia;
            conductorMasCeranoId = index;
        }
      }
    });
    if ( mayor == 99999 ){
      return noSeEncontroConductor(comercioActual.id, respuesta);
    }
    else{
      return conductorMasCeranoId;
    }
}
function cambio_A_Ocupado(id){
  conductores.forEach(function ( item, index ) {
    if( item.id == id ){
        conductores[index].ocupado = true;
    }
  });
}
var mensaje=[];
var posicionComercio=[];
var posicionConductor=[];
var datosRecibidos=[];
function dibujarLineaAComercio(idComercio, idConductor){
  alert("Un conductor a aceptado el viaje, Conectando");
  let datosComercio = comercios.find(element => element.id === idComercio);
  let datosConductor = conductores.find(element => element.id === idConductor);
  origen= { lat: datosConductor.lat , lng: datosConductor.lng };
  destino= { lat: datosComercio.lat , lng: datosComercio.lng };
  dibujarLinea(origen, destino, map1);
}
function solicitarConductor() {
  var idUser = document.getElementsByName('yourid')[0].content;
      if (posicionConductor[0] == idUser) {
        var respuesta = confirm("Tienes un nuevo pedido");
          if (respuesta) {
            origen= { lat: parseFloat( posicionConductor[1] ), lng: parseFloat( posicionConductor[2] )};
            destino= { lat: parseFloat( posicionComercio[1] ), lng: parseFloat( posicionComercio[2] ) };
            dibujarLinea(origen, destino, map1);
            const comercio = new google.maps.Marker({
                position: { lat: parseFloat( posicionComercio[1] ), lng: parseFloat( posicionComercio[2] ) },
                map: map1,
                title:"Comercio"
              });
          let datosAlComercio=[posicionComercio[0], posicionConductor[0]];
          localStorage.setItem("conductorOcupado", posicionConductor[0]);//cambia a ocupado a todos los comercios, usamos esto ya que para simular el escenario estamos usando localstorage
          localStorage.setItem("dibujarLineaAComercio", datosAlComercio);
          } else {
              cambio_A_Ocupado(idUser);
              let respuesta="hola";
              pedido(posicionComercio, respuesta, idUser);

          }
      }
}
function resetearConductores(){
  alert("Sin resultados, Reseteando conductores");
  localStorage.setItem("reseteandoConductores", contador);
  conductores.forEach(function ( item, index ) {
      conductores[index].ocupado = false;
  });
  contador++;
}
window.addEventListener('storage', function(event) {
  if ( event.key == "volviendoAFalso"){
    let volver=[];
    volver=event.newValue.split(",");
    console.log(volver[0])
       conductores.forEach(function ( item, index ) {
         if( item.id == volver[0] ){
             conductores[index].ocupado = false;
         }
       });
    }
  if ( event.key == "resultados"){
    mensaje=event.newValue.split(",");
     if(idVentanaActual==mensaje[0]){
        resetearConductores();
      }
    }

  if ( event.key == "reseteandoConductores") {
      conductores.forEach(function ( item, index ) {
          conductores[index].ocupado = false;
      });
    }
  if ( event.key == "conductorOcupado") {
        conductores.forEach(function ( item, index ) {
          if (item.id == event.newValue){
            conductores[index].ocupado = true;
          }
        });
    }
  if ( event.key == "generandoComercio" ){
    posicionComercio=event.newValue.split(",");
  }

  if ( event.key == "PidiendoConductor" ){
    posicionConductor=event.newValue.split(",");
    solicitarConductor();
  }
  if ( event.key == "dibujarLineaAComercio" ){
    datosRecibidos=event.newValue.split(",");
    if(idVentanaActual==datosRecibidos[0]){
       dibujarLineaAComercio(datosRecibidos[0], datosRecibidos[1]);
     }
  }
});


function dibujarLinea(origen, destino, mapa1){
  var objConfigDR={
    map: mapa1,
    suppressMarkers: true
  }
  var objConfigDS={
    origin:origen,
    destination:destino,
    travelMode: google.maps.TravelMode.DRIVING
  }

  var ds= new google.maps.DirectionsService();
  var dr = new google.maps.DirectionsRenderer(objConfigDR);
  ds.route(objConfigDS, fnRutear);

function fnRutear(resultados, status){
    if(status == "OK" ){
      dr.setDirections(resultados);
    }else {
      alert("ERROR"+status)
    }
}
}

function initMap() {
  const ubicacion = new Localizacion(() => {
    const id = document.getElementsByName('yourid')[0].content;
    const type = document.getElementsByName('youruser')[0].content;
    var point = { lat: ubicacion.latitude, lng: ubicacion.longitude };
	const options = {
      center: point,
      zoom: 15
    };
	var map = document.getElementById('map');
    const mapa = new google.maps.Map(map, options);
    map1=mapa;

    if (type == "conductor") {
		var coordenada = { id:id, lat: ubicacion.latitude, lng: ubicacion.longitude, ocupado:false};
		conductores.push(coordenada);
		localStorage.setItem("conductores", JSON.stringify(conductores));
    const marcadorConductor = new google.maps.Marker({
      position: point,
      map: mapa,
      title:id,
      icon: image
   });
    }

    if (type=="comercio"){
      var testeo ={ id: id , lat: ubicacion.latitude, lng: ubicacion.longitude};
      comercios.push(testeo);
      localStorage.setItem("comercio", JSON.stringify(comercios));
      for(var i = 0; i < conductores.length; i++) {
    		var newPoint = { lat: conductores[i].lat, lng: conductores[i].lng };
    		var newMarcador = new google.maps.Marker({
    			position: newPoint,
    			map: mapa,
    			title:conductores[i].id,
          icon: image
    		});
        }
  	     const marcador = new google.maps.Marker({
           position: point,
           map: mapa,
           title:"Comercio"
        });
      }
  });
}
if(tipo=="comercio"){
  let idUser = document.getElementsByName('yourid')[0].content;
  btn.addEventListener('click', pedido);
}
