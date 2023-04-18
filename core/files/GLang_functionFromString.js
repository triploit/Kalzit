;GLang.functionFromCodeBlock = function(codeBlock, defaultEnv){
	return GLang.functionFromTree(
		codeBlock.value.sentences,
		codeBlock.env || defaultEnv,
		//Argument list (default parameter names are specified here)
		{value:[{value:"x"}, {value:"y"}]}
		//Untyped function
	)
};
GLang.functionFromTree = function(tree, defaultEnv, argumentList, type){
	var result = {value:function(env, args){
		var functionEnvironment = GLang.createFunctionScope(defaultEnv, argumentList, args);
		
		var result = GLang.evaluateTree(tree, functionEnvironment);
		//Apply type if present
		if(type) {
			return GLang.callObject(type, env, [result]);
		} else {
			return result;
		}
	}, display:"function"};
	GLang.setAnnotation(result, {value:[
		GLang.stringValue("argumentList"),
		argumentList
	]});
	return result;
}
