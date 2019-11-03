var cssIncluded = false;
function includeCss(){
	var style = document.createElement("link");
	style.rel = "stylesheet";
	style.type = "text/css";
	style.href = "/assets/stylesheets/html5/dynamic/fontFamily.css";
	document.head.appendChild(style);
}

this.flagFontFamily = function(familyName, object){
	if(familyName === -1){
		if(!cssIncluded){
			includeCss();
			cssIncluded = true;	
		}
		object.classList.add("calcitDynamic_fontFamily");
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
this.flagItalic = function(unused, object){
	object.style.fontStyle = "italic";
}