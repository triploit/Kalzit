var cssIncluded = false;
function includeCss(){
	var style = document.createElement("link");
	style.rel = "stylesheet";
	style.type = "text/css";
	style.href = "/assets/stylesheets/html5/dynamic/roundness.css";
	document.head.appendChild(style);
}

this.flagPercentRoundness = function(roundness, object){
	if(roundness < 0){
		if(!cssIncluded){
			includeCss()
			cssIncluded = true;
		}
		object.classList.add("calcitDynamic_roundness")
	}else{
		object.style.borderRadius = (roundness / 2) + "%";
	}
}
this.flagPxRoundness = function(roundness, object){
	if(roundness < 0){
		if(!cssIncluded){
			includeCss()
			cssIncluded = true;
		}
		object.classList.add("calcitDynamic_roundness")
	}else{
		object.style.borderRadius = roundness + "px";
	}
}