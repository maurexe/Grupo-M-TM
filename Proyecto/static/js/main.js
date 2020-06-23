var array = (localStorage.getItem("array") != null) ? JSON.parse(localStorage.getItem("array")) : [];
var image = 'http://maps.google.com/mapfiles/kml/shapes/cabs.png';
window.addEventListener("storage", function (){
    console.log("prueba");
}, false);
var btn = document.getElementById('ejecutar');
function calcular(){
  alert("Buscando al conductor mas cercano");
  for (var i = 0; i < array.length; i++) {
    console.log(array[i].id,array[i].lat, array[i].lng, array[i].bandera)
  }
}

btn.addEventListener('click', calcular)
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
    if (type=="comercio"){
  	const marcador = new google.maps.Marker({
        position: point,
        map: mapa,
        title:"AppComercio"
      });
    }

    var x = false;

    if (type == "conductor") {
		var coordenada = { id:id, lat: ubicacion.latitude, lng: ubicacion.longitude, bandera:x };
		array.push(coordenada);
		localStorage.setItem("array", JSON.stringify(array));

    var push = { id:"alexis", lat: -32.929014, lng: -68.769267, bandera:x };
    array.push(push);
		localStorage.setItem("array", JSON.stringify(array));
    }

	for(var i = 0; i < array.length; i++) {
		var newPoint = { lat: array[i].lat, lng: array[i].lng };
		var newMarcador = new google.maps.Marker({
			position: newPoint,
			map: mapa,
			title:"Conductor",
      icon: image
		});
    }
  });
}

