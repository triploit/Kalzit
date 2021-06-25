GLang.defaultRuntimeEnvironment.setInnerVariable("uiNativeTextareaVariableOnchange", {value:GLang.arrayFun(function(env, args){
	var varRef = args[0];
	if(varRef.display !== "reference"){throw new Error("uiPicker needs a reference as the first parameter")}
	
	var varEnv = varRef.environment;
	var varName = varRef.value;
	
	var textfield = document.createElement("textarea");
	textfield.value = varEnv.resolveName(varName).value;
	textfield.onkeyup=function(e){
		varEnv.setInnerVariable(varName, GLang.stringValue(textfield.value), true);
	}
	
	GLang.registerVariableListener(varName, function(){
		textfield.value = varEnv.resolveName(varName).value;
	})
	
	return {value:textfield, display:"dom"};
})})
GLang.defaultRuntimeEnvironment.setInnerVariable("uiNativeTextareaOnchange", {value:GLang.arrayFun(function(env, args){
	var textfield = document.createElement("textarea");
	textfield.value=args[1].value;
	function callback(){
		GLang.callObject(args[0], env, [GLang.stringValue(textfield.value)]);
	}
	
	textfield.addEventListener("change", callback, false);
	textfield.addEventListener("keyup", callback, false);
	return {value:textfield, display:"dom"};
})})