GLang.defaultRuntimeEnvironment.setInnerVariable("uiArrowIcon", {value:GLang.arrayFun(function(env, args){
	var arrow = document.createElement("div");
	arrow.classList.add("k-arrow_icon");
	return {value:arrow, display:DISPLAY_DOM};
})});
