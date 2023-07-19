;(function(global){
global.color_to_string = function(_color){
	return "rgba(" + _color[0].value + ", " + _color[1].value + ", " + _color[2].value + ", " + (_color[3].value / 255) + ")";
}
function resetBackground(object){
	object.style.backgroundColor = object.style.backgroundImage = null;
}

global.flag_background_color = function(color, object){
	resetBackground(object);
	object.style.backgroundColor = color;
}
global.flag_background_image_url = function(imageUrl, object){
	resetBackground(object);
	object.style.backgroundImage = 'url("' + imageUrl + '")';
	object.style.backgroundRepeat = "no-repeat";
	object.style.backgroundPosition = "center";
}
global.flag_foreground_color = function(color, object){
	object.style.color = color;
}
global.flag_background_gradient_left_to_right = function(_colors, object){
	resetBackground(object);
	object.style.backgroundImage = "linear-gradient(to right, " + _colors[0].value + ", " + _colors[1].value + ")";
}
global.flag_background_gradient_top_to_bottom = function(_colors, object){
	resetBackground(object);
	object.style.backgroundImage = "linear-gradient(to bottom, " + _colors[0].value + ", " + _colors[1].value + ")";
}
global.flag_opacity = function(opacity, object){
	object.style.opacity = opacity;
}
global.flag_border_color = function(color, object){
	object.style.borderColor = color;
	object.style.borderStyle = "solid";
	object.style.borderWidth = "2px";
}
})(this);
