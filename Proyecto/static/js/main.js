function initMap(){
  const ubicacion = new Localizacion(()=>{
    const myLatLng= {lat: ubicacion.latitude, lng: ubicacion.longitude};
    const options = {
      center: myLatLng,
      zoom: 15
    };
    var map = document.getElementById('map');
    const mapa =new google.maps.Map(map, options);
    const marcador = new google.maps.Marker({
      position: myLatLng,
      map: mapa,
      title:"AppConductor"
    });
  });
}

