var schedule = [],
locations = [],
day = 1,
total = 1,
travel_mode = 0,
warnings = [];

function initMap() {
    for (let i=0;i<schedule.length;i++){
      locations.push(new google.maps.LatLng(schedule[i][0], schedule[i][1]));
    }
    
    var transmethod = "DRIVING";
    if (travel_mode == 2){
        transmethod = "DRIVING";
    }
    else if (travel_mode == 1){
        transmethod = "BICYCLING";
    }
    else{
        transmethod = "WALKING";
    }

    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 10,
      center: locations[0],
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
      locations,
      directionsService,
      directionsRenderer,
      transmethod
    );

  }

  function displayRoute(stops, service, display, transmethod) {
    var transitMethod = transmethod;
    locations2 = []
    for (let i=1;i<stops.length-1;i++){
      locations2.push({location: stops[i]});
    }
    service.route(
      {
        origin: stops[0],
        destination: stops[stops.length-1],
        waypoints: locations2,
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
    travel_mode = parseInt(data['travel']);
    warnings = data['warnings'];
    // console.log(schedule);
    // console.log(day);
    // console.log(total);
    console.log(travel_mode)
}


function onloadPager(){
  for(let pager of document.getElementsByClassName("pager")){
      let tmp = window.location.href.split("/");
      let last = tmp[tmp.length-1];
      if(parseInt(last) == 1 && pager.id == 'left'){
        pager.style.opacity = "0.3";
        pager.style.cursor = "auto";
      }
  }
  document.getElementById('message').innerHTML = warnings[0];
}

function pageLeft(){
    let tmp = window.location.href.split("/");
    let last = tmp[tmp.length-1];
    if(parseInt(last)-1 >= 1){
      window.location.href = (parseInt(last)-1)+"";
    }
}

function pageRight(){
    let tmp = window.location.href.split("/");
    let last = tmp[tmp.length-1];
    if(parseInt(last)+1 <= total){
      window.location.href = (parseInt(last)+1)+""
    }
}