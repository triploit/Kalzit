//Tries to convert a JS value to a calcit value - no guarantee that this works in all cases
GLang.wrapJsToValue = function wrapJsToValue(js){
	if(js === null || js === undefined || js !== js) return GLang.voidValue;
	switch(typeof(js)){
		case "string": return GLang.stringValue(js);
		case "boolean": return {value:js ? 1 : 0};
	}
	if(js instanceof Function){
		function calcitFunction(env, args){
			return wrapJsToValue(js(...args.map(arg => arg.value)));
		}
		
		var jsArgNames = js.toString()
			.replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
			.match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
			.split(/,/);
		
		//var makeArrayFunction = true;
		for(var i = 0; i < jsArgNames.length; i++){
			if(jsArgNames[i].startsWith("_")){
				//We have to produce an array function
				return {value:calcitFunction, display:DISPLAY_FUNCTION, argumentList:jsArgNames}
			}
		}
		
		//if(makeArrayFunction) calcitFunction = GLang.arrayFun(calcitFunction);
		
		return {value:GLang.arrayFun(calcitFunction), display:DISPLAY_FUNCTION, argumentList:jsArgNames}
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
