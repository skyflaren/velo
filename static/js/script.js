for (let icon of document.getElementsByClassName("transit-method")){
	icon.addEventListener('click', function(){
	    if(this.style.opacity < 0.4){ 
	    	this.style.opacity = "0.6";
	    }
	    else{
	    	this.style.opacity = 0.2;
	    }
	})
}
