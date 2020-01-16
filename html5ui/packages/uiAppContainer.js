this.uiNativeAppContainerBackgroundColor = function(_color){
	document.body.style.backgroundColor = _color;
}
this.uiClearAppContainer = function(){
	var playground = document.getElementById("playground");
	while (playground.hasChildNodes()) {
	    playground.removeChild(playground.lastChild);
	}
}