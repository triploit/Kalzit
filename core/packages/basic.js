GLang.defaultRuntimeEnvironment.setInnerVariable("each", {value:function(env, args){
	var result = [];
	
	for(var i = 0; i < args[1].value.length; i++){
		result.push(GLang.callObject(args[0], env, [args[1].value[i]]));
	}
	return {value:result};
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