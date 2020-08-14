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

$(document).ready(function(){
    $("#submit").off().click(function(){
        for(let locat of document.getElementsByClassName('range-slider__range')){
            var slider_data = locat.value;
            console.log(slider_data);
            $.post({
                url: "/",
                data: {'data':slider_data}
            });
        };
    });
});

rangeSlider();