function colorToString(_color){
	return "rgba(" + _color[0].value + ", " + _color[1].value + ", " + _color[2].value + ", " + (_color[3].value / 255) + ")";
}
function resetBackground(object){
	object.style.backgroundColor = object.style.backgroundImage = null;
}

this.flagBackgroundColor = function(_color, object){
	resetBackground(object);
	object.style.backgroundColor = colorToString(_color);
}
this.flagForegroundColor = function(_color, object){
	object.style.color = colorToString(_color);
}
this.flagBackgroundGradientLeftToRight = function(_colors, object){
	resetBackground(object);
	object.style.backgroundImage = "linear-gradient(to right, " + colorToString(_colors[0].value) + ", " + colorToString(_colors[1].value);
}
this.flagBackgroundGradientTopToBottom = function(_colors, object){
	resetBackground(object);
	object.style.backgroundImage = "linear-gradient(to bottom, " + colorToString(_colors[0].value) + ", " + colorToString(_colors[1].value);
}