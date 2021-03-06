for (let slider of document.getElementsByClassName("range-slider__range")){
    slider.addEventListener('mousemove', function(){
        var x = slider.value;
//        console.log((x-slider.min));
//        console.log(slider.max-slider.min);
//        console.log((x-slider.min)/(slider.max-slider.min)*100);
        var color = 'linear-gradient(90deg, #e3975d ' + x + '%, #e0d1c5 ' + x + '%)';
        slider.style.background = color;
    });
    slider.addEventListener('mouseup', function(){
        var x = Math.round(slider.value/20)*20;
        slider.value = x;
        var color = 'linear-gradient(90deg, #e3975d ' + x + '%, #e0d1c5 ' + x + '%)';
        slider.style.background = color;
    });
};

var rangeSlider = function(){
    var slider = $('.range-slider'),
        range = $('.range-slider__range'),
        value = $('.range-slider__value');

    slider.each(function(){
        // console.log(slider.length);

        value.each(function(){
            var value = $(this).prev().val()/20;
            $(this).html(value);
        });

        range.on('mousemove', function(){
            $(this).next(value).html(Math.round(this.value/20));
        });
    });
};

// Pass values to Flask
$(document).ready(function(){
    $("#submit").off().click(function(){

        var time_val = "",
        rating = "",
        icons = [],
        durations = [],
        transit = [],
        latitudes = [],
        longitudes = [],
        names = [];

        time = document.getElementById("time");
        time_val = time.value;

        //Sliders
        for(let locat of document.getElementsByClassName('location')){
            // Per Location Time
            names.push(locat.childNodes[0].innerHTML);
            latitudes.push(locat.childNodes[1].innerHTML);
            longitudes.push(locat.childNodes[2].innerHTML);
        };

        for(let locat of document.getElementsByClassName('range-slider__value')){
            durations.push(locat.innerHTML);
        }

        for (let icon of document.getElementsByClassName("transit-method")){
            let opacity = icon.style.opacity;
            console.log(opacity);
	        if(opacity == 0.6){
	    	    icons.push(1);
	        }
	        else{
	            icons.push(0);
	        }
	    };

        rating = durations.shift();

        $.ajax({
            type: "POST",
            url: '/process',
            dataType: "json",
            traditional: true,
            data: {
                time: time_val,
                rating: rating,
                icons: JSON.stringify(icons),
                names: JSON.stringify(names),
                latitudes: JSON.stringify(latitudes),
                longitudes: JSON.stringify(longitudes),
                durations: JSON.stringify(durations),
            }
        })
        .done(function(data) {
            if(data.warning){
                console.log(data.warning);
                alert(data.warning);
            }
            if(data.redirect){
                window.location.href = data.redirect;
            }
        });
        event.preventDefault();
    });
});

rangeSlider();