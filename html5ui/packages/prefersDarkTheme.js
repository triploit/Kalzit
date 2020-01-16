;(function(thiz){

var darkTheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

var stylesheetTag = document.createElement("link");
stylesheetTag.rel = "stylesheet";
var darkStylesheet = "/assets/stylesheets/html5/byJs/dark.css";
var lightStylesheet = "/assets/stylesheets/html5/byJs/light.css";
stylesheetTag.href = darkTheme ? darkStylesheet : lightStylesheet;
document.head.appendChild(stylesheetTag);

var listeners = [];
(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')).addListener(function(result){
	darkTheme = result.matches;
	if(listeners.length){
		stylesheetTag.href = darkTheme ? darkStylesheet : lightStylesheet;
	}
	for(var i = 0; i < listeners.length; i++){
		listeners[i](darkTheme);
	}
});

thiz.prefersDarkTheme = function(){
	return true == darkTheme;
}

GLang.defaultRuntimeEnvironment.setInnerVariable("onDarkThemePreferenceChange", {value:function(env, args){
	listeners.push(function(dark){
		GLang.callObject(args[0], env, [{value:dark ? 1 : 0}])
	});
	return GLang.voidValue;
}})

})(this);