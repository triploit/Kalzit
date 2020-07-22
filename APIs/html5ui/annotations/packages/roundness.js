this.flagPercentRoundness = function(roundness, object){
	if(roundness < 0){
		object.classList.add("calcitDynamic_roundness")
	}else{
		object.style.borderRadius = (roundness / 2) + "%";
	}
}
this.flagPxRoundness = function(roundness, object){
	if(roundness < 0){
		object.classList.add("calcitDynamic_roundness")
	}else{
		object.style.borderRadius = roundness + "px";
	}
}