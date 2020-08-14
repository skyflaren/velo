for (let slider of document.getElementsByClassName("range-slider__range")){
    console.log(slider);
    slider.addEventListener('mousemove', function(){
        var x = slider.value;
        var color = 'linear-gradient(90deg, #59bfff ' + x + '%, #bfd2de ' + x + '%)';
        slider.style.background = color;
    });
    slider.addEventListener('mouseup', function(){
      var x = Math.round(slider.value/20)*20;
      slider.value = x;
      var color = 'linear-gradient(90deg, #59bfff ' + x + '%, #bfd2de ' + x + '%)';
      slider.style.background = color;
    });

};

var rangeSlider = function(){
  var slider = $('.range-slider'),
      range = $('.range-slider__range'),
      value = $('.range-slider__value');

  slider.each(function(){

    value.each(function(){
      var value = $(this).prev().attr('value')/20;
      $(this).html(value);
    });

    range.on('mousemove', function(){
      $(this).next(value).html(Math.round(this.value/20));
    });
  });
};

$(document).ready(function(){
  $("#submit").click(function(){
    var slider_data = $("#slider3").attr('value');
    console.log(slider_data);
    $.ajax({
      type : 'POST',
      url : "{{url_for('home')}}",
      data : {'data':slider_data}
    });
  });
});

rangeSlider();