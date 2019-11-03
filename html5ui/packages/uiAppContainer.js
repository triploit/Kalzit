this.uiAppContainerBackgroundColor = function(_color){
	document.body.style.backgroundColor = "rgba(" + _color[0].value + ", " + _color[1].value + ", " + _color[2].value + ", " + (_color[3].value / 255) + ")";
}