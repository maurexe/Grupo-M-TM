var conductores = (localStorage.getItem("conductores") != null) ? JSON.parse(localStorage.getItem("conductores")) : [];
var image = 'http://maps.google.com/mapfiles/kml/shapes/cabs.png';
var comercios=(localStorage.getItem("comercio") != null) ? JSON.parse(localStorage.getItem("comercio")) : [];
var btn = document.getElementById('ejecutar');
var map1;
const tipo = document.getElementsByName('youruser')[0].content;
var contador=0;
function pedido() {
    var idUser = document.getElementsByName('yourid')[0].content;
    // aca se busca por id el comercio que hizo el pedido
    const comercioActual = comercios.find(element => element.id === idUser);
    if (comercioActual != null) {
        generarComercio(comercioActual.lat, comercioActual.lng);
        // se obtiene la posicion del conductor mas cercano
        const position = buscarConductor(comercioActual);
        conductores[position].ocupado = true;
        generarConductor(conductores[position].id, conductores[position].lat, conductores[position].lng);
    }
}

function generarComercio(lat, lng) {
  var posicion= [lat, lng];
  localStorage.setItem("pedido", posicion);
}

function generarConductor(id, lat, lng) {
  var posicion= [id, lat, lng];
  localStorage.setItem("conductor", posicion);
}

function buscarConductor(comercioActual) {
    let conductorMasCeranoId = 0;
    let mayor = 99999;
    conductores.forEach(function (item, index) {
        const lalitud = item.lat - comercioActual.lat;
        const longitud = item.lng - comercioActual.lng;
        const distancia = Math.sqrt( lalitud*lalitud + longitud*longitud );
        if (distancia < mayor) {
            mayor = distancia;
            conductorMasCeranoId = index;
        }
    });
    return conductorMasCeranoId;
}

var posicionComercio=[];
var posicionConductor=[];
function solicitarConductor() {
  var idUser = document.getElementsByName('yourid')[0].content;
      if (posicionConductor[0] == idUser) {
          var respuesta = confirm("Desea tomar este pedido?");
          if (respuesta) {
            origen= { lat: parseFloat( posicionConductor[1] ), lng: parseFloat( posicionConductor[2] )};
            destino= { lat: parseFloat( posicionComercio[0] ), lng: parseFloat( posicionComercio[1] ) };
            dibujarLinea(origen, destino, map1);
            const comercio = new google.maps.Marker({
                position: { lat: parseFloat( posicionComercio[0] ), lng: parseFloat( posicionComercio[1] ) },
                map: map1,
                title:"Comercio"
              });

          } else {
              console.log("logica para buscar un nuevo conductor");
          }
      }
}

window.addEventListener('storage', function(event) {
  if ( event.key == "pedido" ){
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
    var testeo ={ id: id , lat: ubicacion.latitude, lng: ubicacion.longitude, ocupado:false };
	const options = {
      center: point,
      zoom: 15
    };
	var map = document.getElementById('map');
    const mapa = new google.maps.Map(map, options);
    map1=mapa;
    if (type=="comercio"){
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

    var push = { id:"alexis", lat: -32.929014, lng: -68.769267, ocupado:false};
    conductores.push(push);
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
  btn.addEventListener('click', pedido);
}
