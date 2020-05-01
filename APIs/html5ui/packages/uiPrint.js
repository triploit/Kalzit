GLang.defaultRuntimeEnvironment.setInnerVariable("uiPrint", {value:GLang.arrayFun(function(env, args){
	var element = args[0].value;
	return {value:function(env, args){
		element.appendChild(GLang.displayValue(args[0]));
	}, display:"function"};
})})