GLang.defaultRuntimeEnvironment.setInnerVariable("uiText", {value:function(env, args){
	return {value:GLang.displayValue(GLang.stringValue(args[0].value + "")), display:DISPLAY_DOM};
}, display:DISPLAY_FUNCTION});
