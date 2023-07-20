/* @kalzit.for resolve_name
Resolves a variable name (global scope)
*/
GLang.defaultRuntimeEnvironment.qdSet("resolve_name", {value:function(env, args) {
	try {
		return GLang.defaultRuntimeEnvironment.resolveName(env.unifyStringName(args[0].value));
	} catch (error) {
		return GLang.voidValue;
	}
}});

GLang.defaultRuntimeEnvironment.qdSet("no_parameter_function_from_string", {value:function(env, args) {
	console.log("LOL");

	const tree = GLang.prepareTree(GLang.generateTree(args[0].value));
	return {value:function() {
		return GLang.evaluatePreparedTree(tree, env);
	}}
}})
