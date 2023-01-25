GLang.defaultRuntimeEnvironment.setInnerVariable("qrCodeDataUrlAsync", {value:GLang.arrayFun(function(env, args){
	var input = args[1].value + "";
	
	function callback(value){
		GLang.callObject(args[0], env, [value])
	}
	
	require("qrcode").toDataURL(input, function(err, url) {
		callback(url ? GLang.stringValue(url) : GLang.voidValue);
	})
	
	return GLang.voidValue;
}), display:"function"});

GLang.defaultRuntimeEnvironment.setInnerVariable("qrCodeRawAsync", {value:GLang.arrayFun(function(env, args){
	var input = args[1].value + "";
	
	function callback(value){
		GLang.callObject(args[0], env, [value])
	}
	
	require("qrcode").toBuffer(input, function(err, buffer) {
		callback(buffer ? {value:buffer} : GLang.voidValue);
	})
	
	return GLang.voidValue;
}), display:"function"});