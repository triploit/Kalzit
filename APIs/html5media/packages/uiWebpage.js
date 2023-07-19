/* @kalzit.for ui_show_webpage_url
Takes an URL and creates a UI element that shows the referenced website.

For example, if you want to show the "README" file of this project in your app, you could do this:
```kalzit
print: uiShowWebpageUrl: "/README.md".
```

Please note that some websites might prevent you from embedding them.
*/
GLang.defaultRuntimeEnvironment.qdSet("ui_show_webpage_url_native", {value:GLang.arrayFun(function(env, args){
	var iframe = document.createElement("iframe");
	iframe.src=args[0].value;
	iframe.setAttribute("allowfullscreen", "true");
	iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
	return {value:iframe, display:DISPLAY_DOM}
})});
