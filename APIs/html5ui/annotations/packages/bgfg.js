GLang.dr.qdSet("color_to_string", {value:function(env, args){
    const _color = args[0].value;
    return GLang.stringValue(
        "rgba(" + _color[0].value + ", " + _color[1].value + ", " + _color[2].value + ", " + (_color[3].value / 255) + ")"
    )
}});

function resetBackground(object){
	object.style.backgroundColor = object.style.backgroundImage = null;
}

this.flag_background_color = function(color, object){
	resetBackground(object);
	object.style.backgroundColor = color;
}
this.flag_background_image_url = function(imageUrl, object){
	resetBackground(object);
	object.style.backgroundImage = 'url("' + imageUrl + '")';
	object.style.backgroundRepeat = "no-repeat";
	object.style.backgroundPosition = "center";
}
this.flag_foreground_color = function(color, object){
	object.style.color = color;
}

GLang.dr.qdSet("flag_background_gradient_left_to_right", {value:function(env, args){
    const _colors = args[0].value;
    const object = args[1].value;

    resetBackground(object);
    object.value.style.backgroundImage = "linear-gradient(to right, " + _colors[0].value + ", " + _colors[1].value + ")";

    return GLang.voidValue;
}});

GLang.dr.qdSet("flag_background_gradient_top_to_bottom", {value:function(env, args){
    const _colors = args[0].value;    
    const object = args[1].value;

	resetBackground(object);
	object.style.backgroundImage = "linear-gradient(to bottom, " + _colors[0].value + ", " + _colors[1].value + ")";
    
    return GLang.voidValue;
}});

this.flag_opacity = function(opacity, object){
	object.style.opacity = opacity;
}
this.flag_border_color = function(color, object){
	object.style.borderColor = color;
	object.style.borderStyle = "solid";
	object.style.borderWidth = "2px";
}
