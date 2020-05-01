{
	
	let load = KNI.hasSynchronousLoader() ? KNI.getSynchronousLoader() : null;
	let loadAsyncKNI = KNI.hasAsynchronousLoader() ? KNI.getAsynchronousLoader() : null;
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

	this.loadGlobal = load ? function(u, _hs){return load.global(u, GLang.headersArrayToJson(headersValuesToStringsArray(_hs)))} : function(url, _headers){
		return GLang.packageManager.loadUrl("/api/loadUrl?query=" + encodeURIComponent(url + ""), headersValuesToStringsArray(_headers));
	};
	this.loadLocal = load ? function(u, _hs){return load.local(u, GLang.headersArrayToJson(headersValuesToStringsArray(_hs)))} : function(url, _headers){
		return GLang.packageManager.loadUrl(url, headersValuesToStringsArray(_headers));
	}

	function makeCallback(callbackValue, env){
		return function(value){GLang.callObject(callbackValue, env, [value])};
	}
	function loadAsync(callbackValue, path, env){
		var callback = makeCallback(callbackValue, env);
		
		fetch(path).then(response => response.text().then(
			text => callback(GLang.stringValue(text))
		)).catch(error => callback(GLang.voidValue));
	}
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("load_local_async", {value:GLang.arrayFun(function(env, args){
		loadAsyncKNI ? loadAsyncKNI.localAsync(makeCallback(args[0], env), args[1].value) : loadAsync(args[0], args[1].value, env);
		return GLang.voidValue;
	})});
	GLang.defaultRuntimeEnvironment.setInnerVariable("load_global_async", {value:GLang.arrayFun(function(env, args){
		loadAsyncKNI ? loadAsyncKNI.globalAsync(makeCallback(args[0], env), args[1].value) : loadAsync(args[0], "/api/loadUrl?query=" + encodeURIComponent(args[1].value), env);
		return GLang.voidValue;
	})});
}