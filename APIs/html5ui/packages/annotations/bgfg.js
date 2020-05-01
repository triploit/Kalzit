;(function(global){
global.colorToString = function(_color){
	return "rgba(" + _color[0].value + ", " + _color[1].value + ", " + _color[2].value + ", " + (_color[3].value / 255) + ")";
}
function resetBackground(object){
	object.style.backgroundColor = object.style.backgroundImage = null;
}

global.flagBackgroundColor = function(_color, object){
	resetBackground(object);
	object.style.backgroundColor = _color;
}
global.flagForegroundColor = function(_color, object){
	object.style.color = _color;
}
global.flagBackgroundGradientLeftToRight = function(_colors, object){
	resetBackground(object);
	object.style.backgroundImage = "linear-gradient(to right, " + _colors[0].value + ", " + _colors[1].value + ")";
}
global.flagBackgroundGradientTopToBottom = function(_colors, object){
	resetBackground(object);
	object.style.backgroundImage = "linear-gradient(to bottom, " + _colors[0].value + ", " + _colors[1].value + ")";
}
global.flagOpacity = function(opacity, object){
	object.style.opacity = opacity;
}
global.flagBorderColor = function(_color, object){
	object.style.borderColor = _color;
	object.style.borderStyle = "solid";
	object.style.borderWidth = "2px";
}
})(this);