var kServer = require("./libraries/k-server");

function wrapRequestValue(kServerRequest) {
	return {value:[
        {value:[{value:"writeExistingFile"}, {
			value: function(args){
				kServerRequest.writeExistingFile(args[0].value, args.length > 1 ? args[1].value : null);
				return args[0];
			}, display: DISPLAY_FUNCTION
		}]},
		{value:[{value:"writeFile"}, {
			value: function(args){
				kServerRequest.writeFile(args[0].value, args.length > 1 ? args[1].value : null);
				return args[0];
			}, display: DISPLAY_FUNCTION
		}]},
		{value:[{value:"method"}, {value:kServerRequest.method}]},
		{value:[{value:"endServing"}, {
			value: function(args){
				if(args.length){
					kServerRequest.endServing(args[0].value);
					return args[0];
				}else{
					kServerRequest.endServing();
					return GLang.voidValue;
				}
			}, display: DISPLAY_FUNCTION
		}]},
		{value:[{value:"write"}, {
			value: function(args){
				kServerRequest.write(args[0].value, args.length > 1 ? args[1].value : null);
				return args[0];
			}, display: DISPLAY_FUNCTION
		}]},
		{value:[{value:"writeBytes"}, {
			value: function(args){
				kServerRequest.writeBytes(args[0].value, args.length > 1 ? args[1].value : null);
				return args[0];
			}, display: DISPLAY_FUNCTION
		}]},
		{value:[{value:"writeRaw"}, {
			value: function(args){
				kServerRequest.writeRaw(args[0].value, args.length > 1 ? args[1].value : null);
				return args[0];
			}, display: DISPLAY_FUNCTION
		}]},
		{value:[{value:"startServing"}, {
			value: function(args){
				kServerRequest.startServing(args[0].value + "");
				return args[0];
			}, display: DISPLAY_FUNCTION
		}]},
		{value:[{value:"respondCode"}, {
			value: function(args){
				kServerRequest.respondCode(args[0].value);
				return args[0];
			}, display: DISPLAY_FUNCTION
		}]},
		{value:[{value:"setEncoding"}, {
			value: function(args){
				kServerRequest.setEncoding(args[0].value + "");
				return args[0];
			}, display: DISPLAY_FUNCTION
		}]},
		{value:[{value:"cookie"}, GLang.stringValue(kServerRequest.cookie)]},
		{value:[{value:"getHeader"}, {
			value: function(args){
				return GLang.stringValue(kServerRequest.getHeader(args[0].value + ""));
			}, display: DISPLAY_FUNCTION
		}]},
		{value:[{value:"setHeader"}, {
			value: function(args){
				kServerRequest.setHeader(args[0].value + "", args[1].value + "");
				return GLang.voidValue
			}, display: DISPLAY_FUNCTION
		}]},
		{value:[{value:"url"}, GLang.stringValue(kServerRequest.url)]},
		{value:[{value:"host"}, GLang.stringValue(kServerRequest.host)]},
		{value:[{value:"getPostDataStringAsync"}, {
			value: function(args){
				//Parameters
				var callback = args[0];
				var sizeLimit = args.length > 1 ? parseInt(args[1].value) : null; 
				
				kServerRequest.getPostDataStringAsync(function(posted){
					GLang.call(callback, posted == null ? [] : [GLang.stringValue(posted)])
				}, sizeLimit);
				
				return GLang.voidValue
			}, display: DISPLAY_FUNCTION
		}]},
		{value:[{value:"getPostDataByteSizeEstimate"}, {
			value: function(args){
				return {value:kServerRequest.getPostDataByteSizeEstimate()};
			}, display: DISPLAY_FUNCTION
		}]},
		{value:[{value:"getPostDataFileAsync"}, {
			value: function(args){
				//We need to extract some named functions from a Kalzit object (first parameter)
				var callbackObject = args[0];
				var propOf = GLang.dr.resolveName("prop_of");
				
				//These are the needed Kalzit functions
				var onSuccess = GLang.call(propOf, [
					GLang.stringValue("onSuccess"), callbackObject
				]);
				var onError = GLang.call(propOf, [
					GLang.stringValue("onError"), callbackObject
				]);
				var onPreparation = GLang.call(propOf, [
					GLang.stringValue("onPreparation"), callbackObject
				]);
				
				//We will now have to wrap these Kalzit functions into JS functions and use them with the real getPostDataFileAsync implementation
				kServerRequest.getPostDataFileAsync({
					onSuccess: (tempFileName) => GLang.call(onSuccess, [GLang.stringValue(tempFileName)]),
					onError: () => GLang.call(onError, []),
					onPrepatation: (contentLength) => GLang.call(onPreparation, [{value: contentLength}])
				});
				
				//Make sure that something valid is returned
				return GLang.voidValue
			}, display: DISPLAY_FUNCTION
		}]}
	]};
};

GLang.dr.qdSet("http_server", {value:function(args){
	kServer.httpServer(function (request) {
		GLang.call(args[0], [wrapRequestValue(request)]);
	}, args[1].value);
	
	return GLang.voidValue;
}, display:DISPLAY_FUNCTION})

GLang.dr.qdSet("https_server", {value:function(args){
	kServer.httpsServer(function (request) {
		GLang.call(args[0], [wrapRequestValue(request)]);
	}, args[1].value);
	
	return GLang.voidValue;
}, display:DISPLAY_FUNCTION})

GLang.dr.qdSet("custom_https_server", {value:function(args){
	var callback = args[0];
	var config = GLang.wrapValueToJsObject(args[1]);
	config.callback = function (request) {
		GLang.call(callback, [wrapRequestValue(request)]);
	}
	
	kServer.customHttpsServer(config);
	
	return GLang.voidValue;
}, display:DISPLAY_FUNCTION})
