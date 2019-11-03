GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowWebpageUrl", {value:GLang.arrayFun(function(env, args){
	var iframe = document.createElement("iframe");
	iframe.src=args[0].value;
	return {value:iframe, display:"dom"}
})});