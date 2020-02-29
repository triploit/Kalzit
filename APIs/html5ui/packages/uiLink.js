GLang.defaultRuntimeEnvironment.setInnerVariable("uiLink", {value:GLang.arrayFun(function(env, args){
	var anchor = document.createElement("a");
	anchor.classList.add("calcitLink");
	anchor.appendChild(GLang.displayValue(args[1]));
	anchor.href=args[0].value;
	return {value:anchor, display:"dom"};
})})