GLang.defaultRuntimeEnvironment.qdSet("set_css_color_combination", {value:function(env, args){
	var object = GLang.wrapValueToJsObject(args[0]);
	function colorString(color){
		return GLang.wrapValueToJsObject(GLang.callObject(
			GLang.defaultRuntimeEnvironment.resolveName("ColorString"),
			env,
			[GLang.wrapJsToValue(color)]
		))
	}
	
	document.documentElement.style.setProperty("--kv-black_accent_color", colorString(object.blackAccentColor));
	document.documentElement.style.setProperty("--kv-white_accent_color", colorString(object.whiteAccentColor));
	document.documentElement.style.setProperty("--kv-twilight_accent_color", colorString(object.twilightAccentColor));
	document.documentElement.style.setProperty("--kv-darker_twilight_accent_color", colorString(object.darkerTwilightAccentColor));
	document.documentElement.style.setProperty("--kv-lighter_twilight_accent_color", colorString(object.lighterTwilightAccentColor));
	document.documentElement.style.setProperty("--kv-light_accent_color", colorString(object.lightAccentColor));
	document.documentElement.style.setProperty("--kv-dark_accent_color", colorString(object.darkAccentColor));
	return GLang.voidValue;
}});
