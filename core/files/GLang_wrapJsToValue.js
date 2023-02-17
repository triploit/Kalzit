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
			var jsArguments = args.map(arg => arg.value);
			return wrapJsToValue(jsFunction(...jsArguments));
		}
		
		var jsArgNames = jsFunction.toString()
			.replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
			.match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
			.split(/,/);
		
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
		return {value:js.map(
			entry => GLang.wrapJsToValue(entry)
		)};
	}
	if(js instanceof Object){
		var calcitObject = [];
		for(var prop in js){
			calcitObject.push({value:[
				GLang.stringValue(prop),
				GLang.wrapJsToValue(js[prop])
			]});
		}
		return {value:calcitObject};
	}
	
	//Default case
	return {value:js};
}
