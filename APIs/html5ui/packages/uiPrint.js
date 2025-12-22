GLang.dr.qdSet("ui_print", {value:GLang.arrayFunction(1, function(args){
	var element = args[0].value;
	return {value:function(args){
		element.appendChild(GLang.displayValue(args[0]));
		return GLang.voidValue;
	}, display:DISPLAY_FUNCTION};
})})
