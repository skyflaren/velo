function getValues(){
	time = document.getElementById("time");
	console.log(time.value);
	$.post( "/updatelist", {
	    "time": time,
	});
}