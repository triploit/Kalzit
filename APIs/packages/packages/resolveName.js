/* @kalzit.for resolve_name
Resolves a variable name (global scope)
*/
GLang.dr.qdSet("resolve_name", {value:function(args) {
	try {
		return GLang.dr.resolveName(args[0].value);
	} catch (error) {
		if(GLANG_DEBUG) {
			console.log(error);
		}
		return GLang.voidValue;
	}
}});

GLang.dr.qdSet("global_single_parameter_function_from_string", {value:function(args) {
	const tree = GLang.prepareTree(GLang.generateTree(args[1].value));
	const argName = args[0].value;

	return {value:function(args) {
		const newEnv = Object.create(GLang.dr);

		//console.log("globalSingleParameterFunctionFromString: argName is " + argName);
		//console.log("globalSingleParameterFunctionFromString: value is " + GLang.stringify(args[0]));

		newEnv[argName] = args[0];
		return GLang.evaluatePreparedTree(tree, newEnv);
	}}
}})
