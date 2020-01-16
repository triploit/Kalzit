GLang.defaultRuntimeEnvironment.setInnerVariable("uiHorizontalScroller", {value:function(env, args){
	var scroller = document.createElement("div");
	scroller.classList.add("calcitHorizontalScroller");
	scroller.classList.add("calcitDynamic_horizontalScroller");
	for(var i = 0; i < args[0].value.length; i++){
		scroller.appendChild(GLang.displayValue(args[0].value[i]))
	}
	return {value:scroller, display:"dom"};
}});