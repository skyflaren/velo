function initMap() {
  
   //var lat1 = document.getElementById("lat1").value;
   //var lng1 = document.getElementById("lng1").value;
   //var lat2 = document.getElementById("lat2").value;
   //var lng2 = document.getElementById("lng2").value;
  var location = new google.maps.LatLng(43.801304, -79.370698);
  var location2 = new google.maps.LatLng(43.800875, -79.356319);
  var location3 = new google.maps.LatLng(43.652461,-79.387226);
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
    directionsRenderer
  );
}

function displayRoute(origin,waypoint, destination, service, display) {
  service.route(
    {
      origin: origin,
      destination: destination,
      waypoints: [  
         { location: waypoint }
      ],
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true
    },
    (result, status) => {
      if (status === "OK") {
        display.setDirections(result);
        instance = document.createElement('img');
        instance.src = "plus-circle.svg";
        document.getElementById("right-panel").appendChild(instance);
      } else {
        alert("Could not display directions due to: " + status);
      }
    }
  );
}