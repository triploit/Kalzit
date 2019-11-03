this.loadGlobal = function(url){
	return GLang.packageManager.loadUrl("/html5/files/serverside_load.php?query=" + encodeURIComponent(url + ""));
};
this.loadLocal = function(url){
	return GLang.packageManager.loadUrl(url);
}

function loadAsync(callbackValue, path, env){
	var callback = function(value){GLang.callObject(callbackValue, env, [value])};
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", path, true);
	xhr.onload = function (e) {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				callback(GLang.stringValue(xhr.responseText));
			} else {
				callback(GLang.voidValue);
			}
		}
	};
	xhr.onerror = function (e) {
		callback(GLang.voidValue);
	};
	xhr.send(null);
	
}

GLang.defaultRuntimeEnvironment.setInnerVariable("load_local_async", {value:GLang.arrayFun(function(env, args){
	loadAsync(args[0], args[1].value, env);
	return {value:0};
})});
GLang.defaultRuntimeEnvironment.setInnerVariable("load_global_async", {value:GLang.arrayFun(function(env, args){
	loadAsync(args[0], "html5/files/serverside_load.php?query=" + encodeURIComponent(GLang.displayValue(args[1]).innerHTML), env);
	return {value:0};
})});