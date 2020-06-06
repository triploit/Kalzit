/*
Takes an URL and creates a UI element that shows the referenced website.

For example, if you want to show the "README" file of this project in your app, you could do this:
	print: uiShowWebpageUrl: "/README.md".

Please note that some websites might prevent you from embedding them.
*/
GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowWebpageUrl", {value:GLang.arrayFun(function(env, args){
	var iframe = document.createElement("iframe");
	iframe.src=args[0].value;
	return {value:iframe, display:"dom"}
})});