;(function(global){
	
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
	
	//A package manager implementation for the browser
	GLang.domPackageManager = Object.create(new GLang.PackageManager());
	GLang.domPackageManager.loadUrl = loadUrl;
	
})(this);