GLang.codeblockFromTree = function(preparedTree, env) {
	return {value:{
		cb:function(env) {
			return GLang.evaluatePreparedTree(preparedTree, env);
		}
	}, display:DISPLAY_CODEBLOCK, env:env}
}

//Supports a typed argument list as well as a function type
GLang.functionFromCodeblock = function(codeblock, defaultEnv, argumentList, type){
	const result = {value:function(env, args){
		//console.log("call of fun-based function");
		
		const result = codeblock(GLang.createFunctionScope(defaultEnv, argumentList, args));
		//Apply type if present
		if(type) {
			return GLang.callObject(type, env, [result]);
		} else {
			return result;
		}
	}, display:DISPLAY_FUNCTION};
	GLang.setAnnotation(result, {value:[
		GLang.stringValue("argumentList"),
		argumentList
	]});
	return result;
}
