var schedule = [],
day = 1,
total = 1;

function initMap() {
  
   //var lat1 = document.getElementById("lat1").value;
   //var lng1 = document.getElementById("lng1").value;
   //var lat2 = document.getElementById("lat2").value;
   //var lng2 = document.getElementById("lng2").value;
  var location = new google.maps.LatLng(43.801304, -79.370698);
  var location2 = new google.maps.LatLng(43.800875, -79.356319);
  var location3 = new google.maps.LatLng(43.652461,-79.387226);
  var transmethod="DRIVING";

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: location,
    zoomControl: false,
    mapTypeControl: false,
    "styles":[{"elementType":"geometry","stylers":[{"color":"#e0deda"}]},{"elementType":"labels.icon","stylers":[{"visibility":"simplified"}]},
    {"elementType":"labels.text.stroke","stylers":[{"color":"#f5f1e6"}]},{"featureType":"administrative","elementType":"geometry.stroke",
    "stylers":[{"color":"#c9b2a6"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"color":"#ae9e90"}]},
    {"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#ebe0c3"}]},{"featureType":"landscape.natural","elementType":"geometry",
    "stylers":[{"color":"#e8e2dc"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"poi",
    "elementType":"labels.text.fill","stylers":[{"color":"#93817c"}]},{"featureType":"poi.attraction","elementType":"labels","stylers":[{"visibility":"on"}]},
    {"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#c3d1ab"}]},{"featureType":"poi.park","elementType":"labels",
    "stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#447530"}]},{"featureType":"road",
    "elementType":"geometry","stylers":[{"color":"#f5f1e6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#fdfcf8"}]},
    {"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#e3b574"}]},{"featureType":"road.highway","elementType":"geometry.stroke",
    "stylers":[{"color":"#e3b574"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"color":"#edbb98"}]},
    {"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#806b63"}]},{"featureType":"transit.line","elementType":"geometry",
    "stylers":[{"color":"#dfd2ae"}]},{"featureType":"transit.line","elementType":"labels.text.fill","stylers":[{"color":"#8f7d77"}]},{"featureType":"transit.line",
    "elementType":"labels.text.stroke","stylers":[{"color":"#ebe3cd"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#e3c7b1"}]},
    {"featureType":"transit.station.airport","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#aec7d6"}]},
    {"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#92998d"}]}],
  });
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: true,
    map,
    panel: document.getElementById("right-panel")
  });
  displayRoute(
    location,
    location2,
    location3,
    directionsService,
    directionsRenderer,
    transmethod
  );

}

function displayRoute(origin, waypoint, destination, service, display, transmethod) {
  var transitMethod = transmethod;
  service.route(
    {
      origin: origin,
      destination: destination,
      waypoints: [
         { location: waypoint }
      ],
      travelMode: transitMethod,
      avoidTolls: true
    },
    (result, status) => {
      if (status === "OK") {
        display.setDirections(result);
        // instance = document.createElement('img');
        // instance.src = "static/js/plus-circle.svg";
        // document.getElementById("right-panel").appendChild(instance);

        

      } else {
        alert("Could not display directions due to: " + status);
      }
    }
  );
}

function restyle(){
//    var path = loadPath({{schedule|tojson}})
//    console.log("test");
//    console.log(path);
   for(let marker of document.getElementsByClassName("adp-marker2")){
     console.log("lmao");
     marker.src = "static/js/map-pin.svg";
   }
  for(let time of document.getElementsByClassName("adp-summary")){
    inst = document.createElement("span");
  }
}

function pass_to_script(data){
    schedule = data['schedule'];
    day = parseInt(data['day']);
    total = parseInt(data['total']);
    console.log(schedule);
    console.log(day);
    console.log(total);
}