var conductores = (localStorage.getItem("conductores") != null) ? JSON.parse(localStorage.getItem("conductores")) : [];
var image = 'http://maps.google.com/mapfiles/kml/shapes/cabs.png';
var comercios=(localStorage.getItem("comercio") != null) ? JSON.parse(localStorage.getItem("comercio")) : [];
var idVentanaActual = document.getElementsByName('yourid')[0].content;
var btn = document.getElementById('ejecutar');
var map1;
const tipo = document.getElementsByName('youruser')[0].content;
var contador=0;
function pedido(idComercio, respuesta) {
    if (respuesta == null){
        let idUser = document.getElementsByName('yourid')[0].content;
        var comercioActual = comercios.find(element => element.id === idUser);
    }else{
        var comercioActual = {id: idComercio[0], lat: idComercio[1], lng: idComercio[2]};
    }
    if (comercioActual != null) {
        // se obtiene la posicion del conductor mas cercano
        const position = buscarConductor(comercioActual, respuesta);
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
  localStorage.setItem("conductor", posicion);
}

function noSeEncontroConductor(id){
  var mensaje=[id, contador ];
  localStorage.setItem("resultados", mensaje);
  contador++;
  if (idVentanaActual== id){// este if es porque el evento se ejecuta en las demas ventanas y no en la comercioActual
    alert("Sin resultados, Todos los conductores ocupados");//por ende muestro ese mensaje para q se vea q no hay conductores disponibles
  }
}

function buscarConductor(comercioActual, respuesta) {
    let conductorMasCeranoId = 0;
    let mayor = 99999;
    conductores.forEach(function (item, index) {
      if(item.ocupado == true){
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
      return noSeEncontroConductor(comercioActual.id);
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
          } else {
              cambio_A_Ocupado(idUser);
              let respuesta="hola";
              pedido(posicionComercio, respuesta);
          }
      }
}
function resetearConductor(){
  alert("Sin resultados, Reseteando conductores");
  let mensaje=[contador];
  localStorage.setItem("reseteandoConductores", mensaje);
  contador++;
}
window.addEventListener('storage', function(event) {
  if ( event.key == "resultados"){
    mensaje=event.newValue.split(",");
     if(idVentanaActual==mensaje[0]){
        resetearConductor();
      }
    }

  if ( event.key == "reseteandoConductores") {
      conductores.forEach(function ( item, index ) {
          conductores[index].ocupado = false;
      });
    }

  if ( event.key == "generandoComercio" ){
    posicionComercio=event.newValue.split(",");
  }

  if ( event.key == "conductor" ){
    posicionConductor=event.newValue.split(",");
    solicitarConductor();
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
    if (type=="comercio"){
      var testeo ={ id: id , lat: ubicacion.latitude, lng: ubicacion.longitude};
      comercios.push(testeo);
      localStorage.setItem("comercio", JSON.stringify(comercios));
  	const marcador = new google.maps.Marker({
        position: point,
        map: mapa,
        title:"AppComercio"
      });
    }


    if (type == "conductor") {
		var coordenada = { id:id, lat: ubicacion.latitude, lng: ubicacion.longitude, ocupado:false};
		conductores.push(coordenada);
		localStorage.setItem("conductores", JSON.stringify(conductores));
    }

	for(var i = 0; i < conductores.length; i++) {
		var newPoint = { lat: conductores[i].lat, lng: conductores[i].lng };
		var newMarcador = new google.maps.Marker({
			position: newPoint,
			map: mapa,
			title:"Conductor",
      icon: image
		});
    }
  });
}
if(tipo=="comercio"){
  let idUser = document.getElementsByName('yourid')[0].content;
  btn.addEventListener('click', pedido);
}
