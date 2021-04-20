//TODO: integrate with KLoad

/*
Allows you to easily access the synchronous load functions provided by a KNI (Kalzit Native Interface).

This variable can have two states:
	1. It can contain the "null" value, which represents that this variable should not be used. (No KNI present)
	2. It can contain a value other than "null". In this case, the value is expected to be an object with the properties "global" and "local". (KNI present)
	
Both of these fields ("global" and "local") are expected to be functions with two parameters: A URL and a list of headers with their values.
*/
let load = KNI.hasSynchronousLoader() ? KNI.getSynchronousLoader() : null;

/*
Allows you to easily access the asynchronous load functions provided by a KNI (Kalzit Native Interface).

This variable can have two states:
	1. It can contain the "null" value, which represents that this variable should not be used. (No KNI present)
	2. It can contain a value other than "null". In this case, the value is expected to be an object with the properties "global" and "local". (KNI present)
	
Both of these fields ("global" and "local") are expected to be functions with two parameters: A URL and a list of headers with their values.
*/
let loadAsyncKNI = KNI.hasAsynchronousLoader() ? KNI.getAsynchronousLoader() : null;

//Provide debug information about what is used for loading
if(GLang.debug){
	GLang.log("syncLoadApi: " + (load ? "KNI" : "GLang.packageManager") + " is used for loading");
	GLang.log("asyncLoadApi: " + (loadAsyncKNI ? "KNI" : "Browser implementation") + " is used for loading asynchronously");
}

/** @kalzit.for load_global

A function that is used to load data from any publicly available web server. It needs an absolute URL to do this (those relative to the current server will probably not work).

Usage example (Kalzit):
	`$resolvedContent = loadGlobal: "https://www.example.com".`

Since the JavaScript code run in a browser is not allowed to talk to most servers directly, this function uses the endpoint "/api/loadUrl" of the Kalzit Server.

If you want to use relative URLs, consider using "loadLocal".
*/
this.loadGlobal = KLoad.loadGlobal;

/* @kalzit.for load_local
A function that is used to load data from the same server your app is hosted on. The preferred way to do this is by using relative URLs

Usage example (Kalzit):
	`$resolvedContent = loadLocal: "/local/resource".`
	
If you want to use absolute URLs, consider using "loadGlobal".
*/
this.loadLocal = KLoad.loadLocal;

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
var appId = location.pathname.split("/");
appId = appId[appId.length - 1];

console.log("kalzit.cacheWanted." + appId);
var cacheEnabled = localStorage.getItem("kalzit.cacheWantedFor." + appId) != "0";
function loadAsync(callbackValue, path, env, unimportant){
	var callback = makeCallback(callbackValue, env);
	
	var done = false;
	var CACHE_NAME = "KLoad-cache-v1";
	
	function importantFetchAndCache(){
		//Not cached - start an important fetch
		//If the "unimportant" parameter is set, do an unimportant fetch instead
		var fetchMethod = unimportant ? KFetch.unimportant : KFetch.important;
		
		fetchMethod(path).then(fetchResponse => {
			//Pass the result to the callback...
			var clonedResponse = fetchResponse.clone();
			fetchResponse.text().then(text => callback(GLang.stringValue(text)));
			
			// ... and cache the response if appropriate
			if(cacheEnabled && window.caches && (path.includes("/api/s/") || path.includes("/api/loadUrl?"))) {
				caches.open(CACHE_NAME).then(cache => {
					cache.put(path, clonedResponse)
				})
			}
		})	
	}
	
	//If available, load the resource from cache
	if(cacheEnabled && window.caches) {
		caches.open(CACHE_NAME).then(cache => {
			cache.match(path).then(response => {
				if(response){
					//Cached - pass the result to the callback and start an unimportant fetch for cacheing
					response.text().then(text => callback(GLang.stringValue(text)));
					KFetch.unimportant(path).then(fetchResponse => {
						//If there is a valid fetch response, cache it
						if(fetchResponse) {
							cache.put(path, fetchResponse);
						}
					})
				}else{
					importantFetchAndCache();
				}
			})
		}).catch(error => importantFetchAndCache());
	}else{
		//Attempt to clear the cache
		if(window.caches && !cacheEnabled) {
			caches.open(CACHE_NAME).then(cache => {
				console.log("Clearing cache for " + path);
				caches.delete(path);
			})
		}
		//Caches library is not available - do a cached fetch
		importantFetchAndCache()
	}
	
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
	loadAsyncKNI ? loadAsyncKNI.localAsync(makeCallback(args[0], env), args[1].value) : loadAsync(args[0], args[1].value, env);
	return GLang.voidValue;
})});
GLang.defaultRuntimeEnvironment.setInnerVariable("load_local_async_without_indicator", {value:GLang.arrayFun(function(env, args){
	loadAsyncKNI ? loadAsyncKNI.localAsync(makeCallback(args[0], env), args[1].value) : loadAsync(args[0], args[1].value, env, true);
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
	loadAsyncKNI ? loadAsyncKNI.globalAsync(makeCallback(args[0], env), args[1].value) : loadAsync(args[0], "/api/loadUrl?query=" + encodeURIComponent(args[1].value), env);
	return GLang.voidValue;
})});

this.loadDisableCache = function(){console.log("Load cache disabled"); cacheEnabled = false};
this.loadEnableCache = function(){console.log("Load cache enabled"); cacheEnabled = true};