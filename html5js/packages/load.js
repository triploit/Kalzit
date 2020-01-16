this.loadGlobal = function(url, _headers){
	var headerArray;
	if(_headers){
		headerArray = [];
		for(var i = 0; i < _headers.length; i++){
			headerArray[i] = [
				_headers[i].value[0].value,
				_headers[i].value[1].value
			]
		}
	}
	return GLang.packageManager.loadUrl("/api/loadUrl?query=" + encodeURIComponent(url + ""), headerArray);
};
this.loadLocal = function(url, _headers){
	var headerArray;
	if(_headers){
		headerArray = [];
		for(var i = 0; i < _headers.length; i++){
			headerArray[i] = [
				_headers[i].value[0].value,
				_headers[i].value[1].value
			]
		}
	}
	return GLang.packageManager.loadUrl(url, headerArray);
}

;(function(){
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
		loadAsync(args[0], "/api/loadUrl?query=" + encodeURIComponent(GLang.displayValue(args[1]).innerHTML), env);
		return {value:0};
	})});
})();