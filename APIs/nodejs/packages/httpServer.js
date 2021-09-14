var kServer = require("./libraries/k-server");

function wrapRequestValue(kServerRequest) {
	return {value:[
		{value:[{value:"method"}, {value:kServerRequest.method}]},
		{value:[{value:"endServing"}, {
			value: function(env, args){
				if(args.length){
					kServerRequest.endServing(args[0].value);
					return args[0];
				}else{
					kServerRequest.endServing();
					return GLang.voidValue;
				}
			}, display: "function"
		}]},
		{value:[{value:"write"}, {
			value: function(env, args){
				kServerRequest.write(args[0].value, args.length > 1 ? args[1].value : null);
				return args[0];
			}, display: "function"
		}]},
		{value:[{value:"writeFile"}, {
			value: function(env, args){
				kServerRequest.writeFile(args[0].value, args.length > 1 ? args[1].value : null);
				return args[0];
			}, display: "function"
		}]},
		{value:[{value:"writeEncryptedFile"}, {
			value: function(env, args){
				//Make a JS config object from the Kalzit one
				var propOf = GLang.eval("propOf");
				var configObject = args[0];
				var jsConfig = {
					key: GLang.callObject(propOf, env, [
						GLang.stringValue("key"), configObject
					]).value,
					initVector: GLang.callObject(propOf, env, [
						GLang.stringValue("initVector"), configObject
					]).value,
					input: GLang.callObject(propOf, env, [
						GLang.stringValue("input"), configObject
					]).value
				}
				
				kServerRequest.writeEncryptedFile(jsConfig);
				return GLang.voidValue;
			}, display: "function"
		}]},
		{value:[{value:"writeBytes"}, {
			value: function(env, args){
				kServerRequest.writeBytes(args[0].value, args.length > 1 ? args[1].value : null);
				return args[0];
			}, display: "function"
		}]},
		{value:[{value:"writeRaw"}, {
			value: function(env, args){
				kServerRequest.writeRaw(args[0].value, args.length > 1 ? args[1].value : null);
				return args[0];
			}, display: "function"
		}]},
		{value:[{value:"startServing"}, {
			value: function(env, args){
				kServerRequest.startServing(args[0].value + "");
				return args[0];
			}, display: "function"
		}]},
		{value:[{value:"respondCode"}, {
			value: function(env, args){
				kServerRequest.respondCode(args[0].value);
				return args[0];
			}, display: "function"
		}]},
		{value:[{value:"setEncoding"}, {
			value: function(env, args){
				kServerRequest.setEncoding(args[0].value + "");
				return args[0];
			}, display: "function"
		}]},
		{value:[{value:"cookie"}, GLang.stringValue(kServerRequest.cookie)]},
		{value:[{value:"getHeader"}, {
			value: function(env, args){
				return GLang.stringValue(kServerRequest.getHeader(args[0].value + ""));
			}, display: "function"
		}]},
		{value:[{value:"setHeader"}, {
			value: function(env, args){
				kServerRequest.setHeader(args[0].value + "", args[1].value + "");
				return GLang.voidValue
			}, display: "function"
		}]},
		{value:[{value:"url"}, GLang.stringValue(kServerRequest.url)]},
		{value:[{value:"host"}, GLang.stringValue(kServerRequest.host)]},
		{value:[{value:"getPostDataStringAsync"}, {
			value: function(env, args){
				//Parameters
				var callback = args[0];
				var sizeLimit = args.length > 1 ? parseInt(args[1].value) : null; 
				
				kServerRequest.getPostDataStringAsync(function(posted){
					GLang.callObject(callback, env, posted == null ? [] : [GLang.stringValue(posted)])
				}, sizeLimit);
				
				return GLang.voidValue
			}, display: "function"
		}]},
		{value:[{value:"getPostDataByteSizeEstimate"}, {
			value: function(env, args){
				return {value:kServerRequest.getPostDataByteSizeEstimate()};
			}, display: "function"
		}]},
		{value:[{value:"getPostDataFileAsync"}, {
			value: function(env, args){
				//We need to extract some named functions from a Kalzit object (first parameter)
				var callbackObject = args[0];
				var propOf = GLang.eval("propOf");
				
				//These are the needed Kalzit functions
				var onSuccess = GLang.callObject(propOf, env, [
					GLang.stringValue("onSuccess"), callbackObject
				]);
				var onError = GLang.callObject(propOf, env, [
					GLang.stringValue("onError"), callbackObject
				]);
				var onPreparation = GLang.callObject(propOf, env, [
					GLang.stringValue("onPreparation"), callbackObject
				]);
				
				//We will now have to wrap these Kalzit functions into JS functions and use them with the real getPostDataFileAsync implementation
				kServerRequest.getPostDataFileAsync({
					onSuccess: (tempFileName) => GLang.callObject(onSuccess, env, [GLang.stringValue(tempFileName)]),
					onError: () => GLang.callObject(onError, env, []),
					onPrepatation: (contentLength) => GLang.callObject(onPreparation, env, [{value: contentLength}])
				});
				
				//Make sure that something valid is returned
				return GLang.voidValue
			}, display: "function"
		}]}
	]};
};

GLang.defaultRuntimeEnvironment.setInnerVariable("httpServer", {value:function(env, args){
	kServer.httpServer(function (request) {
		GLang.callObject(args[0], env, [wrapRequestValue(request)]);
	}, args[1].value);
	
	return GLang.voidValue;
}, display:"function"})

GLang.defaultRuntimeEnvironment.setInnerVariable("httpsServer", {value:function(env, args){
	kServer.httpsServer(function (request) {
		GLang.callObject(args[0], env, [wrapRequestValue(request)]);
	}, args[1].value);
	
	return GLang.voidValue;
}, display:"function"})
