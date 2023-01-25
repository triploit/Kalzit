const KLoad = {};

;(function(global){
	
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
	
	GLang.headersArrayToJson = function(_headers){
		return _headers ? JSON.stringify(_headers) : "[]";
	}
	
	//Loads a js file by http (or relative) url and runs it.
	function loadUrl(url, _headers){
		// get some kind of XMLHttpRequest
		var xhrObj = new XMLHttpRequest();
		//if present, send headers (setRequestHeader())
		xhrObj.open('GET', url, false);
		if(_headers){
			for(var i = 0; i < _headers.length; i++){
				xhrObj.setRequestHeader(_headers[i][0], _headers[i][1]);
			}
		}
		// send a synchronous request
		xhrObj.send('');
		
		var result = xhrObj.responseText;
		if(xhrObj.status === 200){
			return result;
		}else{
			return null;
		}
	}
	
	global.loadUrl = loadUrl;
	
	/** @kalzit.for load_global
	
	A function that is used to load data from any publicly available web server. It needs an absolute URL to do this (those relative to the current server will probably not work).
	
	Usage example (Kalzit):
		`$resolvedContent = loadGlobal: "https://www.example.com".`
	
	Since the JavaScript code run in a browser is not allowed to talk to most servers directly, this function uses the endpoint "/api/loadUrl" of the Kalzit Server.
	
	If you want to use relative URLs, consider using "loadLocal".
	*/
	global.loadGlobal = function(url, _headers){
		try{
			return loadUrl("/api/loadUrl?query=" + encodeURIComponent(url + ""), headersValuesToStringsArray(_headers));
		}catch(e){}
	};
	
	/* @kalzit.for load_local
	A function that is used to load data from the same server your app is hosted on. The preferred way to do this is by using relative URLs
	
	Usage example (Kalzit):
		`$resolvedContent = loadLocal: "/local/resource".`
		
	If you want to use absolute URLs, consider using "loadGlobal".
	*/
	global.loadLocal = function(url, _headers){
		try{
			return loadUrl(url, headersValuesToStringsArray(_headers));
		}catch(e){}
	}
	
})(KLoad);