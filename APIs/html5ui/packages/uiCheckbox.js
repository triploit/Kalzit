GLang.defaultRuntimeEnvironment.setInnerVariable("uiCheckbox", {value:GLang.arrayFun(function(env, args){
	var checkbox = document.createElement("input");
	checkbox.type="checkbox";
	checkbox.classList.add("calcitCheckbox");
	checkbox.innerText=args[1].value;
	checkbox.onchange=function(e){
		GLang.callObject(args[0], env, [{value:checkbox.checked ? 1 : 0}]);
	}
	
	var span = document.createElement("span");
	span.innerText=args[1].value;
	
	var div = document.createElement("div");
	div.appendChild(checkbox);
	div.appendChild(span);
	return {value:div, display:"dom"};
})})
GLang.defaultRuntimeEnvironment.setInnerVariable("uiCheckboxVariable", {value:GLang.arrayFun(function(env, args){
	var checkbox = document.createElement("input");
	checkbox.type="checkbox";
	checkbox.innerText=args[1].value;
	checkbox.onchange=function(e){
		env.setInnerVariable(args[0].value, {value:checkbox.checked ? 1 : 0}, true);
	}
	
	env.registerVariableListener(args[0].value, function(){
		checkbox.checked = env.resolveName(args[0].value).value !== 0;
	})
	
	var span = document.createElement("span");
	span.innerText=args[1].value;
	
	var div = document.createElement("div");
	div.appendChild(checkbox);
	div.appendChild(span);
	return {value:div, display:"dom"};
})})