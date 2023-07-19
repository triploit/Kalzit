GLang.defaultRuntimeEnvironment.qdSet("ui_horizontal_px_space", {value:function(env, args){
	var div = document.createElement("div");
	div.style.display = "inline-block";
	div.style.width = args[0].value + "px";
	return {value:div, display:DISPLAY_DOM};
}});
GLang.defaultRuntimeEnvironment.qdSet("ui_horizontal_percent_space", {value:function(env, args){
	var div = document.createElement("div");
	div.style.display = "inline-block";
	div.style.width = args[0].value + "%";
	return {value:div, display:DISPLAY_DOM};
}});
GLang.defaultRuntimeEnvironment.qdSet("ui_vertical_px_space", {value:function(env, args){
	var div = document.createElement("div");
	div.style.display = "block";
	div.style.height = args[0].value + "px";
	return {value:div, display:DISPLAY_DOM};
}});
GLang.defaultRuntimeEnvironment.qdSet("ui_vertical_percent_space", {value:function(env, args){
	var div = document.createElement("div");
	div.style.display = "block";
	div.style.height = args[0].value + "%";
	return {value:div, display:DISPLAY_DOM};
}});
