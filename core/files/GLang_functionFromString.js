//Supports neither typed arguments nor a function type; variant of functionFromTree heavily optimized for code block execution
;GLang.functionFromCodeBlock = function(codeBlock, defaultEnv){
	return {value:function(env, args){
		return GLang.evaluateTree(
			codeBlock.value.sentences, GLang.createCodeBlockScope(codeBlock.env || defaultEnv, args));
	}, display:"function"};
};

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
