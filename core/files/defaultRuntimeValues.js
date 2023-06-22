;(function(global){

	GLang.defaultRuntimeEnvironment = GLang.RuntimeEnvironment();

	function stringValue(jsStr){
		if(jsStr === undefined || jsStr === null){
			return GLang.voidValue;
		}
		return {value:jsStr, display:"string"}
	}
	
	GLang.stringValue = stringValue;
	GLang.voidValue = {value:[], display:"none"};

	function arrayFun(original){
		if(!original.value){
			original = {value: original}
		}
		function arrayFunWrapper(env, args){
			//Length testing before cloning the arguments array
			const originalArgumentCount = args.length;
			if(originalArgumentCount === 0){
				return GLang.callObject(original, env, []);
			}
			if(originalArgumentCount > 2){
				throw new Error("You can not call an array function with more than two parameters. (You should never call a function with more than two parameters)");
			}
			
			//This is important because the original array should not be modified
			var args = args.slice(0, args.length);
			
			//Ensure a length of two
			if(originalArgumentCount === 1){
				args.push({value:0})
			}
			
			var a = args[0];
			if(GLang.eq(a.value, [])) return {value:[]};
			var b = args[1];
			if(GLang.eq(b.value, [])) return {value:[]};
			var result = [];
			
			//Called with at least one array
			if(a.value instanceof Array || b.value instanceof Array){
				a = a.value instanceof Array ? a : {value:[a]};
				b = b.value instanceof Array ? b : {value:[b]};
				var lenA = a.value.length, lenB = b.value.length;
				
				var len = Math.max(lenA, lenB);
				for(var i = 0; i < len; i++){
					if(!b.value.length){
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
				return GLang.callObject(original, env, [a]);
			}else{
				return GLang.callObject(original, env, [a, b]);
			}
		}
		return arrayFunWrapper;
	}
	GLang.arrayFun = arrayFun;
	
	function atFunction(property, valObj){
		var value = valObj.value;
		if(value instanceof Array && value.length === 0) return {value:[]};
		if(property instanceof Array){
			var array = [];
			for(var i = 0; i < property.length; i++){
				array.push(atFunction(property[i].value, valObj));
			}
			return {value:array};
		}
		if(!(value instanceof Array)){
			value = [{value:value}]
		}
		return value[property % value.length];
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
                if(args[0].display === "codeBlock" || args[1].display === "codeBlock") {
                    throw new Error("Curly braces are not used for strings anymore! You attempted to use the '+' function with a code block as its parameter");
                }
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
		{varName:"fun", varValue:{value:function(env, args){
			var argList = args[0];
			if(!(argList.value instanceof Array)){
				argList = [argList];
			}else{
				argList = argList.value;
			}
			if(argList.length > 2){
				throw new Error("Functions can not have more than two parameters");
			}
			
            if((args[1].value + "") === args[1].value) {
                throw new Error("fun must not be called with a string as its second parameter! Use a code block instead");
            }
			var codeblock = args[1].value.cb;
			var returnType = GLang.getType(args[1]);
			
			return GLang.functionFromCodeblock(codeblock, env, {value:argList}, returnType);
		}}},
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
		{varName:":", varValue:{value:function(env, args){
			return GLang.callObject(args[0], env, [args[1]]);
		}}},
		{varName:"=", varValue:{value:function(env, args){
			var name = args[0].value, environment = env;
			if("string" === typeof name) {
				return environment.setInnerVariable(name, args[1], false, GLang.getType(args[0]));
			} else if (args[0].display === "mutable") {
				args[0].value.set(args[1]);
				return args[1];
			} else {
				throw new Error("First argument of = has to be a string or a mutable value - " + JSON.stringify(name) + " does not fit this rule");
			}
		}}},
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
			if(args[0].display === "mutable"){
				return args[0];
			}
			var mutableValue = {value:{mutable:args[0], listeners:[], type:args.length === 2 ? args[1] : null, set:function(v){
				var newValue = v;
				if (this.type) {
					//Apply the type
					newValue = GLang.callObject(this.type, env, [v]);
					//For debugging: log if the value was changed by the type
					GLang.logTypeHint({
						message:"A mutable container was automatically changed by its type",
						oldValue:v,
						newValue:newValue,
						typeName:GLang.getValueVarName(this.type)
					})
				}
				var oldValue = this.mutable;
				this.mutable = newValue;

				//Call all the variable listeners
				for(var i = 0; i < this.listeners.length; i++) {
					GLang.callObject(this.listeners[i], env, [this.mutable, oldValue]);
				}
			}}, display:"mutable"};
			mutableValue.value.set(args[0]);
			return mutableValue;
		}}},
		{varName:"display_type", varValue:{value:function(env, args){
			return GLang.stringValue(args[0].display || "default");
		}}},
		{varName:"get", varValue:{value:function(env, args){
			if(!args[0].display === "mutable") throw new Error("'get' has to be called with a mutable value as the first parameter");
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
		GLang.defaultRuntimeEnvironment["kv_" + globalVariables[i].varName] = globalVariables[i];
	}

	GLang.defaultRuntimeEnvironment.setInnerVariable("calcitUnifyName", {value:function(env, args){
		return GLang.stringValue(GLang.defaultRuntimeEnvironment.unifyStringName(args[0].value + ""));
	}, display:"function"});
	GLang.defaultRuntimeEnvironment.setInnerVariable("calcitAnnotations", {value:function(env, args){
		return {value:args[0].annotations || []};
	}, display:"function"});
	GLang.defaultRuntimeEnvironment.setInnerVariable("calcitAddAnnotation", {value:function(env, args){
		GLang.addAnnotation(args[1], args[0]);
		return args[1];
	}, display:"function"});
	GLang.defaultRuntimeEnvironment.setInnerVariable("calcitSetAnnotation", {value:function(env, args){
		GLang.setAnnotation(args[1], args[0]);
		return args[1];
	}, display:"function"});
	GLang.defaultRuntimeEnvironment.setInnerVariable("calcitAddComment", {value:function(env, args){
		GLang.addAnnotation(args[1], {value:[
			GLang.stringValue("comment"),
			args[0]
		]});
		return args[1];
	}, display:"function"});
	GLang.defaultRuntimeEnvironment.setInnerVariable("calcitSetType", {value:function(env, args){
		GLang.addAnnotation(args[1], {value:[
			GLang.stringValue("type"),
			args[0]
		]});
		return args[1];
	}, display:"function"});
	GLang.defaultRuntimeEnvironment.setInnerVariable("codeBlockFromString", {value:function(env, args){
		return GLang.codeblockFromTree(GLang.prepareTree(GLang.generateTree(args[0].value)), GLang.defaultRuntimeEnvironment);
	}, display:"function"});
	GLang.defaultRuntimeEnvironment.setInnerVariable("do", {value:function(env, args){
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
