//Supports a typed argument list as well as a function type
GLang.functionFromTree = function(tree, defaultEnv, argumentList, type){
	const result = {value:function(env, args){
		const result = GLang.evaluateTree(tree, GLang.createFunctionScope(defaultEnv, argumentList, args));
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
