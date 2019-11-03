GLang.defaultRuntimeEnvironment.setInnerVariable("listenVariable", {value:GLang.arrayFun(function(env, args){
	var varRef = args[0];
	if(varRef.display !== "reference"){throw new Error("listenVariable needs a reference as the first parameter")}
	
	var varEnv = varRef.environment;
	var varName = varRef.value;
	
	varEnv.registerVariableListener(varName, function(){
		GLang.callObject(args[1], env, [varEnv.resolveName(varName)]);
	});
	return {value:0, display:"none"}
}), display:"function"});