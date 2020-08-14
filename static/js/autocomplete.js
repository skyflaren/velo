let autocomplete;
function initAutocomplete(){
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
                    document.getElementById('details').innerHTML = results[0].geometry.location.lat()+ " " + results[0].geometry.location.lng();
                } else {
                    window.alert("Geocoder failed due to: " + status);
                }
            }
        );
        document.getElementById('auto').placeholder = 'Enter place';
    }
}