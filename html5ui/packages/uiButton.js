GLang.defaultRuntimeEnvironment.setInnerVariable("uiButton", {value:GLang.arrayFun(function(env, args){
	var button = document.createElement("input");
	button.type = "button";
	button.classList.add("calcitButton");
	button.onclick = function(){
		GLang.callObject(args[0], env, []);
	};
	button.value = args[1].value;
	return {value:button, display:"dom"};
})});