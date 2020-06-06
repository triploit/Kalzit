var darkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

var listeners = [];
window.matchMedia('(prefers-color-scheme: dark)').addListener(result => {
	darkTheme = result.matches;
	for(var i = 0; i < listeners.length; i++){
		listeners[i](darkTheme);
	}
});

this.prefersDarkTheme = function(){
	return true == darkTheme;
}

GLang.defaultRuntimeEnvironment.setInnerVariable("onDarkThemePreferenceChange", {value:function(env, args){
	listeners.push(function(dark){
		GLang.callObject(args[0], env, [{value:dark ? 1 : 0}])
	});
	return GLang.voidValue;
}});