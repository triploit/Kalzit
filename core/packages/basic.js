GLang.defaultRuntimeEnvironment.setInnerVariable("each", {value:function(env, args){
	return {value:args[1].value.map(
		entry => GLang.callObject(args[0], env, [entry])
	)}
}})
GLang.defaultRuntimeEnvironment.setInnerVariable("do", {value:function(env, args){
	var params = [];
	if(args.length >= 2){
		params = args[1].value;
		if(!(params instanceof Array)){
			params = [args[1]];
		}
	}
	return GLang.callObject(args[0], env, params);
}})