let autocomplete, map;


function initAutocomplete(){
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: {
            lat: 40.72,
            lng: -73.96
        }
    });
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('auto'),
        {
            types: ['establishment'],
            componentRestrictions: {'country': ['ID']},
            fields: ['place_id', 'geometry', 'name']
        }
    );
    autocomplete.addListener('place_changed', onChange);
}

function onChange(){
    const geocoder = new google.maps.Geocoder();
    const infowindow = new google.maps.InfoWindow();
    
    var place = autocomplete.getPlace();
    if (!place.geometry){
        document.getElementById('auto').placeholder = 'Enter place';
    }
    else{
        geocoder.geocode(
            {
                placeId: place.place_id
            },
            (results, status) => {
                if (status === "OK") {
                    var tmp = document.getElementsByClassName("logo")[0];
                    var velo = document.getElementsByClassName("velo")[0];
                    var right = document.getElementsByClassName("right")[0];
                    var map2 = document.getElementById("map");

                    let i = 1.0;
                    fade = setInterval(function(){
                        // tmp.style.opacity = i+"";
                        // velo.style.opacity = i+"";
                        right.style.backgroundColor = "rgba(227, 164, 116, " + i + ")"; 
                        i -= 0.01;
                        if(i == 0){
                            clearInterval(fade);
                            fade = false;
                        }
                    },1000);

                    tmp.style.display = "none";
                    tmp.style.visbility = "none";
                    map2.style.zIndex = "1";
                    map.setZoom(11);
                    map.setCenter(results[0].geometry.location);
                    let marker = new google.maps.Marker({
                        map,
                        position: results[0].geometry.location
                    });
                    infowindow.setContent(results[0].formatted_address);
                    infowindow.open(map, marker);
                    document.getElementById('auto').value = '';
                    // document.getElementById('details').innerHTML = results[0].geometry.location.lat()+ " " + results[0].geometry.location.lng();

                    

                    // div.setAttribute('class', 'someClass');

                    var location = document.createElement('div');

                    var name = document.createElement('span');
                    name.setAttribute('class', 'place-name');
                    name.innerHTML = place.name;

                    // name.innerHTML = results[0].geometry.location.lat()+ " " + results[0].geometry.location.lng() + " " + place.name;

                    var lat = document.createElement('span');
                    lat.innerHTML = results[0].geometry.location.lat();
                    lat.style.visibility = "none";
                    lat.style.display = "none";

                    var lon = document.createElement('span');
                    lon.innerHTML = results[0].geometry.location.lng()
                    lon.style.visibility = "none";
                    lon.style.display = "none";


                    var slider = document.createElement('div');
                    slider.innerHTML = document.getElementById('repeat').innerHTML;

                    var script = document.createElement('script');
                    script.src = "/static/js/slider.js";

                    location.appendChild(name);
                    location.appendChild(lat);
                    location.appendChild(lon);
                    location.appendChild(slider);
                    location.appendChild(script);

                    location.setAttribute('class', 'location');
                    document.getElementById("results").appendChild(location);
                }
                else {
                    window.alert("Geocoder failed due to: " + status);
                }
            }
           
        );
        document.getElementById('auto').placeholder = 'Enter place';
    }
}