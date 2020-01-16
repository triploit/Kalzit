GLang.defaultRuntimeEnvironment.setInnerVariable("uiNativeTextareaVariableOnchange", {value:GLang.arrayFun(function(env, args){
	var textfield = document.createElement("textarea");
	textfield.value = GLang.eval(args[0].value).value;
	textfield.onkeyup=function(e){
		GLang.defaultRuntimeEnvironment.setInnerVariable(args[0].value, GLang.stringValue(textfield.value), true);
	}
	
	GLang.registerVariableListener(args[0].value, function(){
		textfield.value = GLang.eval(args[0].value).value;
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