GLang.defaultRuntimeEnvironment.qdSet("ui_print", {value:GLang.arrayFun(function(env, args){
	var element = args[0].value;
	return {value:function(env, args){
		element.appendChild(GLang.displayValue(args[0]));
		return GLang.voidValue;
	}, display:DISPLAY_FUNCTION};
})})
