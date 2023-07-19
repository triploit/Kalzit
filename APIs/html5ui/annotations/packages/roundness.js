this.flag_percent_roundness = function(roundness, object){
	if(roundness < 0){
		object.classList.add("k-rounded")
	}else{
		object.style.borderRadius = (roundness / 2) + "%";
	}
}
this.flag_px_roundness = function(roundness, object){
	if(roundness < 0){
		object.classList.add("k-rounded")
	}else{
		object.style.borderRadius = roundness + "px";
	}
}
