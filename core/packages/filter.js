GLang.defaultRuntimeEnvironment.setInnerVariable("filter", {value:function(env, args){
	return {value:args[1].value.filter(
		entry => GLang.callObject(args[0], env, [entry]).value
	)}
}});