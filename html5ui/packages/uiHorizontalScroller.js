GLang.defaultRuntimeEnvironment.setInnerVariable("uiHorizontalScroller", {value:function(env, args){
	var scroller = document.createElement("div");
	scroller.classList.add("calcitHorizontalScroller");
	for(var i = 0; i < args[0].value.length; i++){
		scroller.appendChild(GLang.displayValue(args[0].value[i]))
	}
	scroller.style.width = "auto";
	scroller.style.whiteSpace = "nowrap";
	scroller.style.overflowX = "scroll";
	scroller.style.overflowY = "hidden";
	scroller.style.width = "100%";
	return {value:scroller, display:"dom"};
}});