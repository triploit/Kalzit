GLang.defaultRuntimeEnvironment.qdSet("ui_password_onaction", {value:GLang.arrayFun(function(env, args){
	var textfield = document.createElement("input");
	textfield.classList.add("calcitPassword");
	textfield.type="password";
	textfield.value=args[1].value;
	textfield.onkeyup=function(e){
		if(e.key === "Enter"){
			GLang.callObject(args[0], env, [GLang.stringValue(textfield.value)]);
		}
	}
	return {value:textfield, display:DISPLAY_DOM};
})})
GLang.defaultRuntimeEnvironment.qdSet("ui_password_onchange", {value:GLang.arrayFun(function(env, args){
	var textfield = document.createElement("input");
	textfield.classList.add("calcitPassword");
	textfield.type="password";
	textfield.value=args[1].value;
	function callback(){
		GLang.callObject(args[0], env, [GLang.stringValue(textfield.value)]);
	}
	
	textfield.addEventListener("change", callback, false);
	textfield.addEventListener("keyup", callback, false);
	return {value:textfield, display:DISPLAY_DOM};
})})
