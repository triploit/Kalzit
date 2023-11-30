//Tries to convert a JS value to a calcit value - no guarantee that this works in all cases
GLang.wrapJsToValue = function wrapJsToValue(js){
	if(js === null || js === undefined || js !== js) return GLang.voidValue;
	switch(typeof(js)){
		case "string": return GLang.stringValue(js);
		case "boolean": return {value:js ? 1 : 0};
	}
	if("function" === typeof js){
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
				//We have to produce a normal function
				if(GLANG_DEBUG) {
					//Include argument names at runtime
					return {value:calcitFunction, display:DISPLAY_FUNCTION, argumentList:jsArgNames}
				} else {
					//Do not include argument names
					return {value:calcitFunction, display:DISPLAY_FUNCTION}
				}
			}
		}
		
		//We have to produce an array function
		if(GLANG_DEBUG) {
			//Include argument names at runtime
			return {value:GLang.arrayFun(calcitFunction), display:DISPLAY_FUNCTION, argumentList:jsArgNames}
		} else {
			//Do not include argument names
			return {value:GLang.arrayFun(calcitFunction), display:DISPLAY_FUNCTION}
		}
	} else if('object' === typeof js) {
		//Do we have an array, or a "normal" object?
		if(Array.isArray(js)){
			return {value:js.map(
				entry => GLang.wrapJsToValue(entry)
			)};
		} else {
            //Do we have a DOM element?
            if(GLang.global.Element ? js instanceof GLang.global.Element : false) {
                return {display:DISPLAY_DOM, value:js}
            }
            
            //Otherwise, convert to a normal Kalzit object (list of name value pairs)
			var calcitObject = [];
			for(var prop in js){
				calcitObject.push({value:[
					GLang.stringValue(prop),
					GLang.wrapJsToValue(js[prop])
				]});
			}
			return {value:calcitObject};
		}
	}
	
	//Default case
	return {value:js};
}
