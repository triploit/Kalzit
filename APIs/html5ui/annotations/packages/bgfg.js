;(function(global){
global.colorToString = function(_color){
	return "rgba(" + _color[0].value + ", " + _color[1].value + ", " + _color[2].value + ", " + (_color[3].value / 255) + ")";
}
function resetBackground(object){
	object.style.backgroundColor = object.style.backgroundImage = null;
}

global.flagBackgroundColor = function(color, object){
	resetBackground(object);
	object.style.backgroundColor = color;
}
global.flagBackgroundImageUrl = function(imageUrl, object){
	resetBackground(object);
	object.style.backgroundImage = 'url("' + imageUrl + '")';
	object.style.backgroundRepeat = "no-repeat";
	object.style.backgroundPosition = "center";
}
global.flagForegroundColor = function(color, object){
	object.style.color = color;
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
global.flagBorderColor = function(color, object){
	object.style.borderColor = color;
	object.style.borderStyle = "solid";
	object.style.borderWidth = "2px";
}
})(this);
