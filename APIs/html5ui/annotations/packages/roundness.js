this.flagPercentRoundness = function(roundness, object){
	if(roundness < 0){
		object.classList.add("k-rounded")
	}else{
		object.style.borderRadius = (roundness / 2) + "%";
	}
}
this.flagPxRoundness = function(roundness, object){
	if(roundness < 0){
		object.classList.add("k-rounded")
	}else{
		object.style.borderRadius = roundness + "px";
	}
}