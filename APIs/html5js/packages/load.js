{
	
	//TODO: Document this
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

	/*
	A function that is used to load data from any publicly available web server. It needs an absolute URL to do this (those relative to the current server will probably not work).
	
	Usage example (Kalzit):
		$resolvedContent = loadGlobal: "https://www.example.com".
	
	Since the JavaScript code run in a browser is not allowed to talk to most servers directly, this function uses the endpoint "/api/loadUrl" of the Kalzit Server.
	
	If you want to use relative URLs, consider using "loadLocal".
	*/
	this.loadGlobal = function(url, _headers){
		try{
			return GLang.packageManager.loadUrl("/api/loadUrl?query=" + encodeURIComponent(url + ""), headersValuesToStringsArray(_headers));
		}catch(e){}
	};
	
	/*
	A function that is used to load data from the same server your app is hosted on. The preferred way to do this is by using relative URLs
	
	Usage example (Kalzit):
		$resolvedContent = loadLocal: "/local/resource".
		
	If you want to use absolute URLs, consider using "loadGlobal".
	*/
	this.loadLocal = function(url, _headers){
		try{
			return GLang.packageManager.loadUrl(url, headersValuesToStringsArray(_headers));
		}catch(e){}
	}

	/*
	Takes a Kalzit function value and turns it into a JavaScript function which expects one argument.
	
	The first paramter needs to be any Kalzit value. This is what will be called later.
	The second parameter needs to be a runtime environment in which to run the function (by default - most functions have their own environment attached to them).
	
	Usage example (JS):
		var callback = makeCallback(kalzitValue, GLang.defaultRuntimeEnvironment);
		callback(otherKalzitValue)
		
	This will basically call "kalzitValue" with "otherKalzitValue" as the parameter.
	Notice that you can not use any JavaScript value as the callback parameter. Stuff like callback(1) would not work.
	*/
	function makeCallback(callbackValue, env){
		return function(value){GLang.callObject(callbackValue, env, [value])};
	}
	
	/*
	This function is the foundation used to load something asynchronously using the "fetch" function.
	When the loading is done, a callback is called with the resulting string. If something failed, the callback is still called, but this time with the "void" value.
	
	The loadAsync function takes three parameters:
		1. A Kalzit function which is called when the loading succeeded or failed.
		2. A JavaScript string to tell what to load.
		3. A runtime environment which the callback should use by default
	
	Usage example (JS):
		loadAsync(kalzitCallbackFunction, "anyAccessibleResource", GLang.default environment);
	*/
	function loadAsync(callbackValue, path, env){
		var callback = makeCallback(callbackValue, env);
		
		fetch(path).then(response => response.text().then(
			text => callback(GLang.stringValue(text))
		)).catch(error => callback(GLang.voidValue));
	}
	
	/*
	A function that is used to load data from the same server your app is hosted on in an asynchronous way. The preferred way to do this is by using relative URLs
	
	Usage example (Kalzit):
		($resolvedContent fun {
			`Do stuff with the resolved content`
		}) loadLocalAsync "/local/resource".
		
	If you want to use absolute URLs, consider using "loadGlobalAsync".
	*/
	GLang.defaultRuntimeEnvironment.setInnerVariable("load_local_async", {value:GLang.arrayFun(function(env, args){
		loadAsync(args[0], args[1].value, env);
		return GLang.voidValue;
	})});
	
	/*
	A function that is used to load data from any publicly available server in an asynchronous way. It needs an absolute URL to do this (those relative to the current server will probably not work).
	
	Usage example (Kalzit):
		($resolvedContent fun {
			`Do stuff with the resolved content`
		}) loadGlobalAsync "https://www.example.com".
		
	Since the JavaScript code run in a browser is not allowed to talk to most servers directly, this function uses the endpoint "/api/loadUrl" of the Kalzit Server.
	In its current form, the server handles these load requests in a synchronous way - this means that running multiple asynchronous loadGlobal requests at once will probably not increase performance.
	
	If you want to use absolute URLs, consider using "loadLocalAsync".
	*/
	GLang.defaultRuntimeEnvironment.setInnerVariable("load_global_async", {value:GLang.arrayFun(function(env, args){
		loadAsync(args[0], "/api/loadUrl?query=" + encodeURIComponent(args[1].value), env);
		return GLang.voidValue;
	})});
}