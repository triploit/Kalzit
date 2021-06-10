(function(){
	
	function makeResponseObject(request) {
		return {value: [
			{value: [{value: "getText"}, {
				value: function(){
					return GLang.stringValue(request.responseText)
				}
			}]}
		]}
	}
	
	function httpGetLocalAsync(env, args) {
		var config = GLang.wrapValueToJsObject(args[1]);
		var headers = config.headers || {};
		var url = config.url;
		
		var callback = args[0];
		
		
		var request = new XMLHttpRequest();
		request.open("GET", url);
		
		for(property in headers) {
			console.log(property)
			request.setRequestHeader(property, headers[property]);	
		}
		
		request.onreadystatechange = function(event) {
			if (this.readyState == 4) {
				//Request is done
				GLang.callObject(callback, env, [makeResponseObject(this)])
			}
		};
		
		request.send();
		return GLang.voidValue;
	}
	
	function httpPostLocalAsync(env, args) {
		var config = GLang.wrapValueToJsObject(args[1]);
		var headers = config.headers || {};
		var url = config.url;
		var dataString = config.data;

		var callback = args[0];
		
		
		var request = new XMLHttpRequest();
		request.open("POST", url);
		
		for(property in headers) {
			console.log(property)
			request.setRequestHeader(property, headers[property]);	
		}
		
		request.onreadystatechange = function(event) {
			if (this.readyState == 4) {
				//Request is done
				GLang.callObject(callback, env, [makeResponseObject(this)])
			}
		};
		
		request.send(dataString);
		return GLang.voidValue;
	}

	GLang.defaultRuntimeEnvironment.setInnerVariable("httpGetLocalAsync", {value: httpGetLocalAsync});
	GLang.defaultRuntimeEnvironment.setInnerVariable("httpPostLocalAsync", {value: httpPostLocalAsync});
	
})();