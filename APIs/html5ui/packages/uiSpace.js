GLang.defaultRuntimeEnvironment.setInnerVariable("uiHorizontalPxSpace", {value:function(env, args){
	var div = document.createElement("div");
	div.style.display = "inline-block";
	div.style.width = args[0].value + "px";
	return {value:div, display:"dom"};
}});
GLang.defaultRuntimeEnvironment.setInnerVariable("uiHorizontalPercentSpace", {value:function(env, args){
	var div = document.createElement("div");
	div.style.display = "inline-block";
	div.style.width = args[0].value + "%";
	return {value:div, display:"dom"};
}});
GLang.defaultRuntimeEnvironment.setInnerVariable("uiVerticalPxSpace", {value:function(env, args){
	var div = document.createElement("div");
	div.style.display = "block";
	div.style.height = args[0].value + "px";
	return {value:div, display:"dom"};
}});
GLang.defaultRuntimeEnvironment.setInnerVariable("uiVerticalPercentSpace", {value:function(env, args){
	var div = document.createElement("div");
	div.style.display = "block";
	div.style.height = args[0].value + "%";
	return {value:div, display:"dom"};
}});