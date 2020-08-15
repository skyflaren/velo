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
    center: location 
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

  var test = '{{schedule}}';
  console.log(schedule);
  console.log("test");
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
   for(let marker of document.getElementsByClassName("adp-marker2")){
     console.log("lmao");
     marker.src = "static/js/map-pin.svg";
   }
  for(let time of document.getElementsByClassName("adp-summary")){
    inst = document.createElement("span");
  }
}

