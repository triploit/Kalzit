GLang.codeblockFromTree = function(preparedTree, env) {
	return {value:{
		cb:function(env) {
			return GLang.evaluatePreparedTree(preparedTree, env);
		}
	}, display:DISPLAY_CODEBLOCK, env:env}
}

//Supports a typed argument list
GLang.functionFromCodeblock = function(codeblock, defaultEnv, argumentList){
	const result = {value:function(env, args){
		//console.log("call of fun-based function");
		
		return codeblock(GLang.createFunctionScope(defaultEnv, argumentList, args));
	}, display:DISPLAY_FUNCTION};
	
	if(GLANG_DEBUG) {
		GLang.setAnnotation(result, {value:[
			GLang.stringValue("argumentList"),
			argumentList
		]});
	}
	return result;
}
