for (let slider of document.getElementsByClassName("range-slider__range")){
    slider.addEventListener('mousemove', function(){
        var x = slider.value;
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
        budget = "",
        durations = [],
        latitudes = [],
        longitudes = [],
        names = [];

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

        time = durations.shift();

        console.log(longitudes)

        $.ajax({
            type: "POST",
            url: '/process',
            dataType: "json",
            traditional: true,
            data: {
                time: time_val,
                budget: budget,
                names: JSON.stringify(names),
                latitudes: JSON.stringify(latitudes),
                longitudes: JSON.stringify(longitudes),
                durations: JSON.stringify(durations),
            }
        })
        .done(function(data) {
            if(data.warning){
                console.log(warning);
            }
        });
        event.preventDefault();
    });
});

rangeSlider();