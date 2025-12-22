GLang.dr.qdSet("qr_code_data_url_async", {value:GLang.arrayFunction(2, function(args){
	var input = args[1].value + "";
	
	function callback(value){
		GLang.call(args[0], [value])
	}
	
	require("qrcode").toDataURL(input, function(err, url) {
		callback(url ? GLang.stringValue(url) : GLang.voidValue);
	})
	
	return GLang.voidValue;
}), display:"function"});

GLang.dr.qdSet("qr_code_raw_async", {value:GLang.arrayFunction(2, function(args){
	var input = args[1].value + "";
	
	function callback(value){
		GLang.call(args[0], [value])
	}
	
	require("qrcode").toBuffer(input, function(err, buffer) {
		callback(buffer ? {value:buffer} : GLang.voidValue);
	})
	
	return GLang.voidValue;
}), display:"function"});
