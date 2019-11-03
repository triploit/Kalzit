GLang.defaultRuntimeEnvironment.setInnerVariable("uiPasswordOnaction", {value:GLang.arrayFun(function(env, args){
	var textfield = document.createElement("input");
	textfield.classList.add("calcitPassword");
	textfield.type="password";
	textfield.value=args[1].value;
	textfield.onkeyup=function(e){
		if(e.key === "Enter"){
			GLang.callObject(args[0], env, [GLang.stringValue(textfield.value)]);
		}
	}
	return {value:textfield, display:"dom"};
})})
GLang.defaultRuntimeEnvironment.setInnerVariable("uiPasswordOnchange", {value:GLang.arrayFun(function(env, args){
	var textfield = document.createElement("input");
	textfield.classList.add("calcitPassword");
	textfield.type="password";
	textfield.value=args[1].value;
	textfield.onkeyup=function(e){
		GLang.callObject(args[0], env, [GLang.stringValue(textfield.value)]);
	}
	return {value:textfield, display:"dom"};
})})