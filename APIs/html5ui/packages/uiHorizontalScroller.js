GLang.dr.qdSet("ui_horizontal_scroller", {value:function(args){
	var scroller = document.createElement("div");
	scroller.classList.add("k-horizontal_scroller");
	for(var i = 0; i < args[0].value.length; i++){
		scroller.appendChild(GLang.displayValue(args[0].value[i]))
	}
	return {value:scroller, display:DISPLAY_DOM};
}});
