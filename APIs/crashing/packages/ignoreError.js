GLang.dr.qdSet("ignore_error", {value:function(args) {
	var toCall = args[0];
	try {
		return GLang.call(toCall, []);
	} catch (e) {
		return GLang.voidValue
	}
}});