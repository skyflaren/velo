function getValues(){
	time = document.getElementById("time");
	console.log(time.value);
	$.ajax({
	    type: "POST",
	    url: "/updatelist",
	    data: time.value,
	});
}