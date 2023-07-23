;(function(){
	var kLoad = require("./libraries/k-load");
	
	GLang.dr.qdSet("load_global_async", {value:GLang.arrayFun(function(env, args){
		function callback(value){
			if(value != null) {
				GLang.callObject(args[0], env, [GLang.stringValue(value)]);
			}else{
				GLang.callObject(args[0], env, []);
			}
		}
		
		kLoad.loadGlobalAsync(callback, args[1].value);
		
		return GLang.voidValue;
	})});
	
	GLang.dr.qdSet("load_global", {value:GLang.arrayFun(function(env, args){
		var result = kLoad.loadGlobal(args[0].value);
		return result ? GLang.stringValue(result) : GLang.voidValue;
	})});
	
	GLang.dr.qdSet("load_global_raw", {value:GLang.arrayFun(function(env, args){
		var result = kLoad.loadGlobalRaw(args[0].value);
		return result ? {value:result} : GLang.voidValue
	})});
	
	GLang.dr.qdSet("load_global_with_status", {value:GLang.arrayFun(function(env, args){
		var result = kLoad.loadGlobalWithStatus(args[0].value);
		return GLang.wrapJsToValue(result)
	})});
	
})();
