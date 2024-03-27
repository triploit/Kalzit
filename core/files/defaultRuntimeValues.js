;(function(global){
	function stringValue(jsStr){
		if(jsStr === undefined || jsStr === null){
			return GLang.voidValue;
		}
		return {value:jsStr, display:DISPLAY_STRING}
	}
	
	GLang.stringValue = stringValue;
	GLang.voidValue = {value:[], display:DISPLAY_NONE};

	function arrayFun(original){
        //console.log("arrayFun called");
		if(GLANG_DEBUG && ("function" !== typeof original)){
            throw new Error("arrayFun only accepts JS functions, got: " + original);
			//original = {value: original}
		}
		function arrayFunWrapper(env, args){
			//Length testing before cloning the arguments array
			const originalArgumentCount = args.length;
			if(originalArgumentCount === 0){
                return original(env, []);
				//return GLang.callObject(original, env, []);
			}
			
			//console.log("arrayFunWrapper");
			if(GLANG_DEBUG && originalArgumentCount > 2){
				throw new Error("You can not call an array function with more than two parameters. (You should never call a function with more than two parameters)");
			}
			
			//This is important because the original array should not be modified
			var args = args.slice(0, args.length);
			
			//Ensure a length of two
			if(originalArgumentCount === 1){
				args.push({value:0})
			}
			
			var a = args[0];
			const aIsArray = a.value instanceof Array;
			if(aIsArray && a.value.length === 0) return {value:[]}
			//if(GLang.eq(a.value, [])) return {value:[]};

			var b = args[1];
			const bIsArray = b.value instanceof Array;
			if(bIsArray && b.value.length === 0) return {value:[]}
			//if(GLang.eq(b.value, [])) return {value:[]};

			var result = [];
			
			//Called with at least one array
			if(aIsArray || bIsArray){
				a = aIsArray ? a : {value:[a]};
				b = bIsArray ? b : {value:[b]};
				const lenA = a.value.length, lenB = b.value.length;
				
				var len = Math.max(lenA, lenB);
				for(var i = 0; i < len; i++){
					if(!lenB){
						result.push(arrayFunWrapper(
							env,
							[
								a.value[i % lenA]
							]));
					}else{
						result.push(arrayFunWrapper(
							env,
							[
								a.value[i % lenA],
								b.value[i % lenB]
							]));
					}
				}
				return {value:result, display:b.display || a.display};
			}
			
			//Called with no arrays as parameter
			if(originalArgumentCount == 1){
                return original(env, [a]);
				//return GLang.callObject(original, env, [a]);
			}else{
                return original(env, [a, b]);
				//return GLang.callObject(original, env, [a, b]);
			}
		}
		return arrayFunWrapper;
	}
	GLang.arrayFun = arrayFun;
	
	function atFunction(property, valObj){
        //console.log("atFunction");
        
        //Without optimization: 1426 + 13395 calls to launch the files app
        //1394 + 13395 after avoiding recursion
        
		var value = valObj.value;
		if(Array.isArray(value)) {
            if(value.length === 0) {
                return {value:[]};
            }
            
		    if(Array.isArray(property)){
                //Access multiple indexes
			    var array = [];
			    for(var i = 0; i < property.length; i++){
				    array.push(value[property[i].value % value.length]);
			    }
			    return {value:array};
		    } else {
                //Access a single index
                return value[property % value.length];
            }
        } else {
            //The value to get an item of is not an array
            return valObj
        }
	}
	GLang.at=atFunction;
	
	//Print fallback
	GLang.printValue = GLang.printValue || function(container){GLang.print(container.value)};
	
	GLang.eq = function eq(a,b){
		if(a instanceof Array && b instanceof Array){
			if(a.length !== b.length) return false;
			for(var i = 0; i < a.length; i++){
				if(!GLang.eq(a[i].value, b[i].value)) return false;
			}
			return true;
		}
		return a === b;
	}

	var globalVariables = [
		{
			varName:"+", varValue:{value:arrayFun(function(env, args){
                return {value:args[0].value+args[1].value, display:args[0].display || args[1].display
            }})}
		},
		{
			varName:"-", varValue:{value:arrayFun(function(env, args){
				if (args.length === 1) {
					//If called with one Parameter, the - function negates the given number
					return {value: -args[0].value}
				}
				//In any other case, subtract the two parameters and return the result
				return {value:args[0].value-args[1].value}})
			}
		},
		{
			varName:"%", varValue:{value:arrayFun(function(env, args){return {value:args[0].value/args[1].value}})}
		},
		{
			varName:"*", varValue:{value:arrayFun(function(env, args){return {value:args[0].value*args[1].value}})}
		},
		{
			varName:"/", varValue:{value:function(env, args){
				if(!(args[1].value instanceof Array)){
					args[1] = {value:[args[1]]};
				}
				
				if(args[1].value.length === 0) return {value:[]};
				var result = args[1].value[args[1].value.length - 1]
				if(args[1].value.length === 1) return result;
				
				for(var i = args[1].value.length - 2; i >= 0; i--){
					result = GLang.callObject(args[0], env, [args[1].value[i], result])
				}
				return result;
			}}
		},
		/* @kalzit.for print
		The standard print function - for showing output to the user.
		It takes its parameter, generates a simple graphical representation (usually just text) and shows it on the screen (for web applications, on the website itself).
		
		Usage example:
		```kalzit
		print: "Any text".
		print: 4.
		```
		
		This function can also be used to show UI elements on the screen:
		```kalzit
		print: uiContainer: "Yay".
		```
		
		However, elements which have a possible UI representation do not get automatically converted to that.
		If you want to use a more visual UI when outputting values, use "visualize" instead.
		*/
		{
			varName:"print", varValue:{value:function(env, args){	
				GLang.printValue(args[0]);
				return args[0];
			}}
		},
		{
			varName:"array", varValue:{value:function(env, args){return {value:args}}}
		},
		{varName:";", varValue:{value:function(env, args){
			var val1 = args[0];
			if(!(val1.value instanceof Array)){
				val1 = {value:[val1]}
			}
			var val2 = args[1];
			if(!(val2.value instanceof Array)){
				val2 = {value:[val2]}
			}
			return {value:[].concat(val1.value,val2.value)};
		}}},
//		{varName:":", varValue:{value:function(env, args){
//			return GLang.callObject(args[0], env, [args[1]]);
//		}}},
		{varName:"range", varValue:{value:arrayFun(function(env, args){
			var array = [];
			if(args[0].value <= args[1].value){
				for(var i = args[0].value; i <= args[1].value; i++){
					array.push({value:i});
				}
			}else{
				for(var i = args[0].value; i >= args[1].value; i--){
					array.push({value:i});
				}
			}
			return {value:array};
		})}},
		{varName:"void", varValue:GLang.voidValue},
		{varName:"eq", varValue:{value:function(env, args){
			return {value:GLang.eq(args[0].value, args[1].value) ? 1 : 0};
		}}},
		{varName:"<", varValue:{value:arrayFun(function(env, args){
			return {value:args[0].value < args[1].value ? 1 : 0};
		})}},
		{varName:">", varValue:{value:arrayFun(function(env, args){
			return {value:args[0].value > args[1].value ? 1 : 0};
		})}},
		{varName:"^", varValue:{value:arrayFun(function(env, args){
			return {value:args[0].value ** args[1].value};
		})}},
		{varName:"mod", varValue:{value:arrayFun(function(env, args){
			return {value:args[0].value % args[1].value};
		})}},
		{varName:"|", varValue:{value:arrayFun(function(env, args){
			return args[0].value < args[1].value ? args[1] : args[0];
		})}},
		{varName:"&", varValue:{value:arrayFun(function(env, args){
			return args[0].value < args[1].value ? args[0] : args[1];
		})}},
		{varName:"at", varValue:{value:function(env, args){
			return atFunction(args[0].value, args[1]);
		}}},
		{varName:"mutable", varValue:{value:function(env, args){
			if(args[0].display === DISPLAY_MUTABLE){
				return args[0];
			}
			var mutableValue = {value:{mutable:args[0], listeners:[], type:args.length === 2 ? args[1] : null, set:function(v){
				var newValue = v;
				if (this.type) {
					//Apply the type
					newValue = GLang.callObject(this.type, env, [v]);
					//For debugging: log if the value was changed by the type
					if(GLANG_DEBUG && !GLang.eq(v.value, newValue.value)) {
						console.warn("A mutable container was automatically changed by its type");
						console.log("Old value:");
						console.log(v);
						console.log("New value:");
						console.log(newValue);
						console.log("Kalzit call stack:");
						console.log([...GLang.callStack]);
						console.log("This is probably the most important value in that stack (the second-to-last one):");
						console.log(GLang.callStack[GLang.callStack.length - 2].obj);
						console.log("---");
					}
				}
				var oldValue = this.mutable;
				this.mutable = newValue;

				//Call all the variable listeners
				for(var i = 0; i < this.listeners.length; i++) {
					GLang.callObject(this.listeners[i], env, [this.mutable, oldValue]);
				}
			}}, display:DISPLAY_MUTABLE};
			mutableValue.value.set(args[0]);
			return mutableValue;
		}}},
		{varName:"display_type", varValue:{value:function(env, args){
			var result = undefined;
			switch (args[0].display || DISPLAY_DEFAULT) {
				case DISPLAY_DEFAULT: result = "default"; break;
				case DISPLAY_STRING: result = "string"; break;
				case DISPLAY_NONE: result = "none"; break;
				case DISPLAY_FUNCTION: result = "function"; break;
				case DISPLAY_DOM: result = "dom"; break;
				case DISPLAY_MUTABLE: result = "mutable"; break;
				default: result = "default";
			}
			return GLang.stringValue(result);
		}}},
		{varName:"get", varValue:{value:function(env, args){
			if(!args[0].display === DISPLAY_MUTABLE) throw new Error("'get' has to be called with a mutable value as the first parameter");
			return args[0].value.mutable;
		}}},
		{varName:"is_defined", varValue:{value:function(env, args){
			var name = args[0].value + "";
			//TODO: Error-driven logic is probably a bad idea, but I guess it works
			try {
				env.resolveName(name);
				//When this causes no error, the variable exists
				return {value:1};
			} catch (e) {
				//When there was an error, the variable does not exist
				return {value:0};
			}
		}}}
	];
	
	for(var i = 0; i < globalVariables.length; i++){
		GLang.dr[globalVariables[i].varName] = globalVariables[i].varValue;
	}

    GLang.dr.qdSet("info", {value:function(env, args){
        const annotation = args[0];
        
        //Check for an array of length 2
		if(GLANG_DEBUG && !(annotation.value instanceof Array && annotation.value.length === 2)){
			//We have an invalid annotation
			throw new Error("An annotation given to 'info' needs to be an array with two values - " + GLang.stringify(annotation) + " does not fit this rule");
		}
        
        return {value:function(env, args){
            const actualValue = args[0];
            
            //Behavior for array annotations
		    actualValue.annotations = actualValue.annotations || [];
		    for(var i = 0; i < actualValue.annotations.length; i++){
			    if(GLang.eq(actualValue.annotations[i].value[0].value, annotation.value[0].value)){
				    actualValue.annotations[i] = annotation;
				    return;
			    }
		    }
		    actualValue.annotations.push(annotation);
        }, display:DISPLAY_FUNCTION}
    }, display:DISPLAY_FUNCTION});
    
	GLang.dr.qdSet("calcit_annotations", {value:function(env, args){
		return {value:args[0].annotations || []};
	}, display:DISPLAY_FUNCTION});
    
	GLang.dr.qdSet("do", {value:function(env, args){
		var params = [];
		if(args.length >= 2){
			params = args[1].value;
			if(!(params instanceof Array)){
				params = [args[1]];
			}
		}
		return GLang.callObject(args[0], env, params);
	}})
	
})(this);
