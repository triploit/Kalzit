//Tries to convert a JS value to a calcit value - no guarantee that this works in all cases
GLang.wrapJsToValue = function wrapJsToValue(js){
	if(js === null || js === undefined || js !== js) return GLang.voidValue;
	switch(typeof(js)){
		case "string": return GLang.stringValue(js);
		case "boolean": return {value:js ? 1 : 0};
	}
	if(js instanceof Function){
		var jsFunction = js
		var calcitFunction = function(env, args){
			var jsArguments = [];
			for(var i = 0; i < args.length; i++){
				jsArguments.push(args[i].value);
			}
			var result = wrapJsToValue(jsFunction.apply(this, jsArguments));
			return result;
		}
		
		var jsArgNames = (jsFunction + "").match(/function(\s\s*.*)?\s*\(([^)]*)\)/)[2];
		if(jsArgNames.trim()){
			jsArgNames = jsArgNames.split(",").map(function(s){return s.trim()});
		}else{
			jsArgNames = [];
		}
		
		var makeArrayFunction = true;
		for(var i = 0; i < jsArgNames.length; i++){
			if(jsArgNames[i].startsWith("_")){
				makeArrayFunction = false;
				break;
			}
		}
		
		if(makeArrayFunction) calcitFunction = GLang.arrayFun(calcitFunction);
		
		return {value:calcitFunction, display:"function", argumentList:jsArgNames}
	}
	if(js instanceof Array){
		var calcitArray = [];
		for(var i = 0; i < js.length;i++){
			calcitArray.push(GLang.wrapJsToValue(js[i]));
		}
		return {value:calcitArray};
	}
	if(js instanceof Object){
		var calcitObject = [];
		for(prop in js){
			calcitObject.push({value:[
				GLang.stringValue(GLang.defaultRuntimeEnvironment.unifyStringName(prop)),
				GLang.wrapJsToValue(js[prop])
			]});
		}
		return {value:calcitObject};
	}
	
	//Default case
	return {value:js};
}