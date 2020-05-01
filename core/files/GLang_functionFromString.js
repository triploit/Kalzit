;GLang.functionFromString = function(string, defaultEnv){
	return GLang.functionFromTree(
		GLang.generateTree(string),
		defaultEnv,
		//Argument list (default parameter names are specified here)
		{value:[{value:"x"}, {value:"y"}]}
		//Untyped function
	)
};
GLang.functionFromTree = function(tree, defaultEnv, argumentList, type){
	var result = {value:function(env, args){
		var functionEnvironment = GLang.createFunctionScope(defaultEnv, argumentList, args);
		
		var result = GLang.evaluateTree(tree, functionEnvironment);
		//Apply type (if present)
		return type ? GLang.callObject(type, env, [result]) : result;
	}, display:"function"};
	GLang.setAnnotation(result, {value:[
		GLang.stringValue("argumentList"),
		argumentList
	]});
	return result;
}