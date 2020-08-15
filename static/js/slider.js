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

        //Time
        time = document.getElementById("time");
        $.post({
            url: "/",
            data: {'time':time.value}
        });

        //Accomodations Budget
        accom = document.getElementById('slider1');
        $.post({
            url: "/",
            data: {'budget':accom.value}
        });


        //Sliders
        for(let locat of document.getElementsByClassName('location')){
            console.log("test");
            console.log(locat.childNodes[1].length);
            // console.log(locat.childNodes[1].innerHTML + " " + locat.childNodes[2].innerHTML);
            // Per Location Time
            $.post({
                url: "/",
                data: { 
                  "coords": { 
                    "lat": locat.childNodes[1].innerHTML, 
                    "lon": locat.childNodes[2].innerHTML,
                  } 
                },
            });
        };
        
        
    });
});

rangeSlider();