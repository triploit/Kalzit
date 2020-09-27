this.flagFontFamily = function(familyName, object){
	if(familyName === -1){
		object.classList.add("k-standard_font");
	}else{
		object.style.fontFamily = familyName;
	}
}

this.flagEmFontSize = function(size, object){
	object.style.fontSize = size + "em";
}
this.flagPxFontSize = function(size, object){
	object.style.fontSize = size + "px";
}