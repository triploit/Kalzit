/* @kalzit.for resolve_name
Resolves a variable name (global scope)
*/
GLang.defaultRuntimeEnvironment.setInnerVariable("resolve_name", {value:function(env, args) {
	try {
		return GLang.defaultRuntimeEnvironment.resolveName(env.unifyStringName(args[0].value));
	} catch (error) {
		return GLang.voidValue;
	}
}});
