(function() {	
	GLang.evaluatePreparedTree = function(sentenceList, env) {
		if(sentenceList.length === 0) return GLang.voidValue;
		
		//var result = GLang.voidValue;
		const LENGTH = sentenceList.length - 1;
		for(var i = 0; i < LENGTH; i++) {
			//We do not need the result here
			evaluateStandardSentence(sentenceList[i], env);
		}
		return evaluateStandardSentence(sentenceList[LENGTH], env);;
	}

	//evaluateSentenceFragment will need to return specific values very, VERY often
	//Load and store them here, so they are easily accessible
	//const COLON_VALUE = GLang.dr["kv_:"];
	const SEMICOLON_VALUE = GLang.dr["kv_;"];
	const DO_VALUE = GLang.dr["kv_do"];
	
	function evaluateOperation(firstParamFragment, operatorFragment, secondParamValue, env) {
		switch (operatorFragment.k) {
			case KIND_COLON: return GLang.callObject(evaluateSentenceFragment(firstParamFragment, env), env, [secondParamValue]);
			case KIND_SEMICOLON: return SEMICOLON_VALUE.value(env, [evaluateSentenceFragment(firstParamFragment, env), secondParamValue]);
			case KIND_SET_ANNOTATION:
				const annotation = evaluateSentenceFragment(firstParamFragment, env);
                if(GLANG_DEBUG && "function" !== typeof annotation.value) {
                    throw new Error("Annotations are required to be functions; " + GLang.stringify(secondParamValue) + " does not fit this rule. To attach info, consider using the 'info' function ( @(info: 'name';'value') x )");
                }
                annotation.value(env, [secondParamValue]);
				return secondParamValue;
		}
		
		return GLang.callObject(evaluateSentenceFragment(operatorFragment, env), env, [
			evaluateSentenceFragment(firstParamFragment, env),
			secondParamValue
		]);
	}

	//Evaluates sentences with an uneven number of elements; this function does NOT add an extra colon if needed
	function evaluateStandardSentence(sentence, env) {
		switch(sentence.length) {
		    case 0: return GLang.voidValue;
		    case 1: return evaluateSentenceFragment(sentence[0], env);
			case 3: //Basic operation
				return evaluateOperation(sentence[0], sentence[1], evaluateSentenceFragment(sentence[2], env), env)
			default: //Longer sentence with multiple operations
				//Evaluate each operation in the sentence; start at the last one
				var result = evaluateSentenceFragment(sentence[sentence.length - 1], env);
				for(var i = sentence.length - 2; i >= 1; i -= 2) {
					result = evaluateOperation(sentence[i - 1], sentence[i], result, env);
				}
				return result;
		}
	}
    
    function returnsVoid(){return GLang.voidValue};

    function jsFnFromSentence(sentence){
        //Have we dealt with this already?
        if(sentence.fn) return sentence.fn;
        
        //console.log("jsFnFromSentence");
        
        //We got a single sentence - this allows for more light-weight functions
        switch(sentence.length) {
            case 0: return sentence.fn = returnsVoid;
            case 1: return sentence.fn = (env) => {return evaluateSentenceFragment(sentence[0], env)};
            case 3: return sentence.fn = (env) => {return evaluateOperation(sentence[0], sentence[1], evaluateSentenceFragment(sentence[2], env), env)}
            default:
                const LENGTH = sentence.length - 1;
                return sentence.fn = (env) => {
                    //Longer sentence with multiple operations
				    //Evaluate each operation in the sentence; start at the last one
				    var result = evaluateSentenceFragment(sentence[LENGTH], env);
				    for(var i = LENGTH - 1; i >= 1; i -= 2) {
					    result = evaluateOperation(sentence[i - 1], sentence[i], result, env);
				    }
				    return result;
                }
        }
    }
    
    const IDENTITY = x => x;
    
    //Creates a function from a parameter definition that either just returns the parameter given an environment,
    //or applies the given type first before returning the result
    function jsFnFromParameter(parameter, env) {
        //There are only two options for parameters: they can be KIND_STRING or KIND_TYPED
		if(parameter.k === KIND_TYPED) {
            const type = evaluateSentenceFragment(parameter.t, env).value;
            if(GLANG_DEBUG && "function" !== typeof type) {
                throw new Error("Types of parameters have to be functions, otherwise the parameter is always constant");
            }
		    return function(value) {
                //apply the type, return the result
                return type(env, [value]);
            }
		}
		return IDENTITY;
    };

    function codeblockFromTree(preparedTree) {
        //Do some quick optimizations for simple code
        if(preparedTree.length === 1) {
            return jsFnFromSentence(preparedTree[0]);
        }
        if(preparedTree.length === 0) {
            return returnsVoid;
        }
        
        //The default case that can handle any tree
        //When we get here, we know that jsFnFromSentence.length >= 2
        const functions = preparedTree.map(jsFnFromSentence);
        const LENGTH = functions.length - 1;
	    return function(env) {
            for(var i = 0; i < LENGTH; i++) {
                functions[i](env);
            }
            return functions[LENGTH](env);
			//return GLang.evaluatePreparedTree(preparedTree, env);
	    }
    }
    
    function functionFromCodeblock(codeblock, defaultEnv, argumentList) {
        switch(argumentList.length) {
            case 0:
                //console.log("!!! makeInternalCodeblockFunction length 0");
                return () => codeblock(Object.create(defaultEnv));
            case 1:
                //console.log("!!! makeInternalCodeblockFunction length 1");
                const paramA = "kv_" + argumentList[0].name;
                if(argumentList[0].type === IDENTITY) {
                    //We have an untyped function parameter
                    return (e, args) => {
                        const functionEnvironment = Object.create(defaultEnv);
                        functionEnvironment[paramA] = args[0] || GLang.voidValue;
                        return codeblock(functionEnvironment)
                    }
                } else {
                    const type = argumentList[0].type;
                    //We have a typed function parameter
                    return (e, args) => {
                        const functionEnvironment = Object.create(defaultEnv);
                        functionEnvironment[paramA] = type(args[0] || GLang.voidValue);
                        return codeblock(functionEnvironment)
                    }
                }
            default:
                return function(env, args){
		            const functionEnvironment = Object.create(defaultEnv);
                    functionEnvironment["kv_" + argumentList[0].name] = argumentList[0].type(args[0] || GLang.voidValue);
                    functionEnvironment["kv_" + argumentList[1].name] = argumentList[1].type(args[1] || GLang.voidValue);
                    return codeblock(functionEnvironment)
	            }
        }
    }

	function evaluateSentenceFragment(fragment, env){
		switch(fragment.k){
			//Do the super common things first
			//case KIND_COLON: return COLON_VALUE;
			case KIND_ASSIGN_TO_STRING:
				const n = fragment.s;
				if(GLANG_DEBUG && env.hasOwnProperty("kv_" + n)){
					throw new Error("Not allowed to change existing variable $" + n + "; consider using a mutable container");
				}
				
				//If no existing variable was found, create a new one
				//But first, check if it exists somewhere else - there should be a warning
				if(GLANG_DEBUG && (env["kv_" + n] != undefined) ) {
					console.warn("You attempted to define a variable that already exists in a higher scope: " +n);
					console.log("Kalzit call stack:");
					console.log([...GLang.callStack]);
					console.log(new Error("JS call stack:"));
					console.log("This is probably the most important value in that stack (the second-to-last one):");
					console.log(GLang.callStack[GLang.callStack.length - 2].obj);
					console.log("---");
				}
				
				return env["kv_" + n] = evaluateStandardSentence(fragment.v, env);
			case KIND_ASSIGN_TO_MUTABLE_NAME:
				//console.log(fragment);
				const resultA = evaluateStandardSentence(fragment.v, env);
				env.resolveName(fragment.n).value.set(resultA);
				return resultA;
			case KIND_SEMICOLON: return SEMICOLON_VALUE;
			case KIND_FUNCTION_DEFINITION:
            case KIND_CODEBLOCK:
				return {value:functionFromCodeblock(
					codeblockFromTree(fragment.c),
					env,
					//Parameter list of the function
					fragment.p.map(parameter => {
						return {name:parameter.s, type:jsFnFromParameter(parameter, env)}
					})
				), display:DISPLAY_FUNCTION};
			//Do the slightly less common things later
			case KIND_STRING: return GLang.stringValue(fragment.s);
			case KIND_NUMBER: return {value:fragment.num};
			case KIND_NAME: return env.resolveName(fragment.n);
			case KIND_PARENTHESES: return evaluateStandardSentence(fragment.p, env);
			case KIND_ARRAY: return {value:[evaluateStandardSentence(fragment.a, env)]};
			case KIND_DO: return DO_VALUE;
			case KIND_GET: return env.resolveName(fragment.m).value.mutable;
			case KIND_ASSIGN_TO_MUTABLE_NONAME:
				const result = evaluateStandardSentence(fragment.v, env);
				evaluateSentenceFragment(fragment.m, env).value.set(result);
				return result;
			default: throw new Error("The following sentence fragment could not be evaluated: " + JSON.stringify(fragment));
		}
	}
})()
