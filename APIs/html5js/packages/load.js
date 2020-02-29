;(function(thiz){
	
	var load = KNI.hasSynchronousLoader() ? KNI.getSynchronousLoader() : null;
	var loadAsyncKNI = KNI.hasAsynchronousLoader() ? KNI.getAsynchronousLoader() : null;
	console.log("syncLoadApi: " + (load ? "KNI" : "GLang.packageManager") + " is used for loading");
	console.log("asyncLoadApi: " + (loadAsyncKNI ? "KNI" : "Browser implementation") + " is used for loading asynchronously");

	function headersValuesToStringsArray(_headers){
		if(_headers){
			var headerArray = [];
			for(var i = 0; i < _headers.length; i++){
				headerArray[i] = [
					_headers[i].value[0].value,
					_headers[i].value[1].value
				]
			}
			return headerArray
		}
	}

	thiz.loadGlobal = load ? function(u, _hs){return load.global(u, GLang.headersArrayToJson(headersValuesToStringsArray(_hs)))} : function(url, _headers){
		return GLang.packageManager.loadUrl("/api/loadUrl?query=" + encodeURIComponent(url + ""), headersValuesToStringsArray(_headers));
	};
	thiz.loadLocal = load ? function(u, _hs){return load.local(u, GLang.headersArrayToJson(headersValuesToStringsArray(_hs)))} : function(url, _headers){
		return GLang.packageManager.loadUrl(url, headersValuesToStringsArray(_headers));
	}

	function makeCallback(callbackValue, env){
		return function(value){GLang.callObject(callbackValue, env, [value])};
	}
	var loadAsync = function(callbackValue, path, env){
		var callback = makeCallback(callbackValue, env);
		
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
		loadAsyncKNI ? loadAsyncKNI.localAsync(makeCallback(args[0], env), args[1].value) : loadAsync(args[0], args[1].value, env);
		return GLang.voidValue;
	})});
	GLang.defaultRuntimeEnvironment.setInnerVariable("load_global_async", {value:GLang.arrayFun(function(env, args){
		loadAsyncKNI ? loadAsyncKNI.globalAsync(makeCallback(args[0], env), args[1].value) : loadAsync(args[0], "/api/loadUrl?query=" + encodeURIComponent(args[1].value), env);
		return GLang.voidValue;
	})});
})(this);