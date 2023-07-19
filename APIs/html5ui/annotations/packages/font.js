this.flag_font_family = function(familyName, object){
	if(familyName === -1){
		object.classList.add("k-standard_font");
	}else{
		object.style.fontFamily = familyName;
	}
}

this.flag_em_font_size = function(size, object){
	object.style.fontSize = size + "em";
}
