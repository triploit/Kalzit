GLang.defaultRuntimeEnvironment.qdSet("ui_native_textarea_variable_onchange", {value:GLang.arrayFun(function(env, args){
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
	
	return {value:textfield, display:DISPLAY_DOM};
})})
GLang.defaultRuntimeEnvironment.qdSet("ui_native_textarea_onchange", {value:GLang.arrayFun(function(env, args){
	var textfield = document.createElement("textarea");
	textfield.value=args[1].value;
	
	//To make this a bit more efficient, we store the last text content in memory - the change listener should only actually trigger if the text changed
	var lastValue = textfield.value;
	function callback(){
		var newValue = textfield.value;
		if(newValue !== lastValue) {
			//Oh wow, the value is actually different!
			//Trigger the change listener...
			GLang.callObject(args[0], env, [GLang.stringValue(newValue)]);
			//... and update the last known value
			lastValue = newValue;
		}
	}
	
	textfield.addEventListener("change", callback, false);
	textfield.addEventListener("keyup", callback, false);
	textfield.addEventListener("paste", callback, false);
	textfield.addEventListener("input", callback, false);
	return {value:textfield, display:DISPLAY_DOM};
})})
