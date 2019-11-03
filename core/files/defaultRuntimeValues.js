;(function(global){

	GLang.defaultRuntimeEnvironment = new GLang.RuntimeEnvironment();

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
			//This is important because the original array should not be modified
			var args = args.slice(0, args.length);
			
			var argumentCount = args.length;
			if(argumentCount === 0){
				return GLang.callObject(original, env, args);
			}
			if(argumentCount > 2){
				throw new Error("You can not call an array function with more than two parameters. (You should never call a function with more than two parameters)");
			}
			
			//Ensure a length of two
			while(args.length < 2){
				args.push({value:0})
			}
			
			//Before doing anything else, isolate the case of function-based arrays
			if(GLang.getFirstAnnotation(args[argumentCount - 1], GLang.stringValue("array"))){
				var result;
				
				switch(argumentCount){
					case 2: result = {value:function(e, a){
							var functionArrayItem = GLang.callObject(args[1], env, a);
							var firstParameter = args[0];
							return GLang.callObject(original, env, [firstParameter, functionArrayItem]);
						}, display:"function"};
						break;
					case 1: result = {value:function(e, a){
							var functionArrayItem = GLang.callObject(args[0], env, a);
							return GLang.callObject(original, env, [functionArrayItem]);
						}, display:"function"};
						break;
					default: throw new Error("At this point, the argumentCount variable has to be 2 or 1. This is an error in the language implementation.");
				}
				
				GLang.addAnnotation(result, {value:[
					GLang.stringValue("array"),
					GLang.stringValue("array")
				]});
				
				var lengthAnnotation = GLang.getFirstAnnotation(args[1], GLang.stringValue("length"));
				if(lengthAnnotation){
					GLang.addAnnotation(result, {value:[GLang.stringValue("length"), lengthAnnotation]});
				}
				
				return result;
			}
			
			var a = args[0];
			if(GLang.eq(a.value, [])) return {value:[]};
			var b = args.length < 2 ? null : args[1];
			if(b ? GLang.eq(b.value, []) : false) return {value:[]};
			var result = [];
			
			if(a.value instanceof Array || b.value instanceof Array){
				a = a.value instanceof Array ? a : {value:[a]};
				b = b.value instanceof Array ? b : {value:[b]};
				var lenA = a.value.length, lenB = b.value.length;
				var len = Math.max(lenA, lenB);
				for(var i = 0; i < len; i++){
					result.push(arrayFunWrapper(env, [a.value[i % lenA], b.value[i % lenB]]));
				}
				return {value:result, display:b.display || a.display};
			}
			return GLang.callObject(original, env, [a, b]);
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
		var objIsArray = GLang.getFirstAnnotation(valObj, GLang.stringValue("array"));
		if(objIsArray){
			var lengthAnnotation = GLang.getFirstAnnotation(valObj, GLang.stringValue("length"));
			var argument = property;
			if(lengthAnnotation){
				var length = parseInt(lengthAnnotation.value);
				argument = property % length;
			}
			return GLang.callObject(valObj, null, [{value:argument}]);
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

	GLang.defaultRuntimeEnvironment.innerVariables = [
		{
			varName:"+", varValue:{value:arrayFun(function(env, args){return {value:args[0].value+args[1].value, display:args[0].display || args[1].display}})}, frozen: true
		},
		{
			varName:"-", varValue:{value:arrayFun(function(env, args){return {value:args[0].value-args[1].value}})}, frozen: true
		},
		{
			varName:"%", varValue:{value:arrayFun(function(env, args){return {value:args[0].value/args[1].value}})}, frozen: true
		},
		{
			varName:"*", varValue:{value:arrayFun(function(env, args){return {value:args[0].value*args[1].value}})}, frozen: true
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
			}}, frozen: true
		},
		{
			varName:"print", varValue:{value:function(env, args){	
				GLang.printValue(args[0]);
				return args[0];
			}}, frozen: true
		},
		{
			varName:"array", varValue:{value:function(env, args){return {value:args}}}, frozen: true
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
			
			var result = {value:{
				environment:env,
				codeString:args[1].value
			}, display:"function"};
			
			GLang.addAnnotation(result, {value:[
				GLang.stringValue("argumentList"), {value:argList}
			]});
			for(var i = 0; i < argList.length; i++){
				if((argList[i].value + "").startsWith("_")){
					return result;
				}
			}
			var res = {value:GLang.arrayFun(function(env, args){
				return GLang.callObject(result, env, args);
			}), display:"function"};
			GLang.addAnnotation(res, {value:[
				GLang.stringValue("argumentList"), {value:argList}
			]});
			return res;
		}}, frozen: true},
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
		}}, frozen: true},
		{varName:"do", varValue:{value:function(env, args){
			var params = [];
			if(args.length >= 2){
				params = args[1].value;
				if(!(params instanceof Array)){
					params = [args[1]];
				}
			}
			return GLang.callObject(args[0], env, params);
		}}, frozen: true},
		{varName:":", varValue:{value:function(env, args){
			return GLang.callObject(args[0], env, [args[1]]);
		}}, frozen: true},
		{varName:"=", varValue:{value:function(env, args){
			var name = args[0].value, environment = env, override = false;
			if(args[0].display === "reference"){
				name = args[0].value;
				environment = args[0].environment;
				override = true;
			}
			environment.setInnerVariable(name, args[1], override, GLang.getType(args[0]));
			return args[1];
		}}, frozen: true},
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
		})}, frozen: true},
		{varName:"code_of", varValue:{value:arrayFun(function(env, args){
			return {value:args[0].value.codeString};
		})}, frozen: true},
		{varName:"void", varValue:GLang.voidValue, frozen: true},
		{varName:"each", varValue:{value:function(env, args){
			var result = [];
			
			for(var i = 0; i < args[1].value.length; i++){
				result.push(GLang.callObject(args[0], env, [args[1].value[i]]));
			}
			return {value:result};
		}}, frozen: true},
		{varName:"eq", varValue:{value:function(env, args){
			return {value:GLang.eq(args[0].value, args[1].value) ? 1 : 0};
		}}, frozen: true},
		{varName:"<", varValue:{value:arrayFun(function(env, args){
			return {value:args[0].value < args[1].value ? 1 : 0};
		})}, frozen: true},
		{varName:">", varValue:{value:arrayFun(function(env, args){
			return {value:args[0].value > args[1].value ? 1 : 0};
		})}, frozen: true},
		{varName:"^", varValue:{value:arrayFun(function(env, args){
			return {value:Math.pow(args[0].value, args[1].value)};
		})}, frozen: true},
		{varName:"mod", varValue:{value:arrayFun(function(env, args){
			return {value:args[0].value % args[1].value};
		})}, frozen: true},
		{varName:"|", varValue:{value:arrayFun(function(env, args){
			return args[0].value < args[1].value ? args[1] : args[0];
		})}, frozen: true},
		{varName:"&", varValue:{value:arrayFun(function(env, args){
			return args[0].value < args[1].value ? args[0] : args[1];
		})}, frozen: true},
		{varName:"at", varValue:{value:function(env, args){
			return atFunction(args[0].value, args[1]);
		}}, frozen: true},
		{varName:"reference", varValue:{value:function(env, args){
			if(args[0].display === "reference"){
				return args[0];
			}
			return {value:args[0].value, display:"reference", environment: env, name:args[0].value}
		}}, frozen: true},
		{varName:"display_type", varValue:{value:function(env, args){
			return GLang.stringValue(args[0].display || "default");
		}}, frozen: true}
	];
})(this);