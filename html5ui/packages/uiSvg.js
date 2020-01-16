GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowSvgPath", {value:GLang.arrayFun(function(env, args){
	var dimsAndPath = args[0].value.split("\n");
	var dims = dimsAndPath[0];
	var path = dimsAndPath[1];
	
	var svgTag = document.createElement("svg");
	var pathTag = document.createElement("path");
	pathTag.setAttribute("d", path);
	if(dims) {
		pathTag.setAttribute("viewBox", dims);
	}
	
	svgTag.appendChild(pathTag);
	
	return {value:svgTag, display:"dom"};
}), display:"function"});