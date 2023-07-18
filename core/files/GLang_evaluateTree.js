(function() {
	GLang.prepareTree = function(tree) {
		if(tree.length === 0) return [];
		
		var sentence = [];
		var result = [];
		for(var i = 0; i < tree.length; i++){
			if(tree[i].dot){
				result.push(sentence);
				sentence = [];
			}else{
				sentence.push(tree[i]);
			}
		}
		if(sentence.length){
			result.push(sentence)
		}
		return result;
	}
	
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
	const COLON_VALUE = GLang.defaultRuntimeEnvironment["kv_:"];
	const SEMICOLON_VALUE = GLang.defaultRuntimeEnvironment["kv_;"];
	const DO_VALUE = GLang.defaultRuntimeEnvironment["kv_do"];
	
	function evaluateOperation(firstParamFragment, operatorFragment, secondParamValue, env) {
		switch (operatorFragment.k) {
			case KIND_COLON: return GLang.callObject(evaluateSentenceFragment(firstParamFragment, env), env, [secondParamValue]);
			case KIND_SEMICOLON: return SEMICOLON_VALUE.value(env, [evaluateSentenceFragment(firstParamFragment, env), secondParamValue]);
			case KIND_SET_ANNOTATION:
				GLang.setAnnotation(secondParamValue, evaluateSentenceFragment(firstParamFragment, env));
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

	function evaluateSentenceFragment(fragment, env){
		switch(fragment.k){
			//Do the super common things first
			case KIND_COLON: return COLON_VALUE;
			case KIND_ASSIGN_TO_STRING: return env.setInnerVariable(fragment.s, evaluateStandardSentence(fragment.v, env));
			case KIND_ASSIGN_TO_MUTABLE_NAME:
				//console.log(fragment);
				const resultA = evaluateStandardSentence(fragment.v, env);
				env.resolveName(fragment.n).value.set(resultA);
				return resultA;
			case KIND_SEMICOLON: return SEMICOLON_VALUE;
			case KIND_TYPED:
				//Typed values are always strings
				const string = GLang.stringValue(fragment.s);
				string.type = evaluateSentenceFragment(fragment.t, env);
				return string;
			//Do the slightly less common things later
			case KIND_STRING: return GLang.stringValue(fragment.s);
			case KIND_NUMBER: return {value:fragment.num};
			case KIND_NAME: return env.resolveName(fragment.n);
			case KIND_PARENTHESES: return evaluateStandardSentence(fragment.p, env);
			case KIND_ARRAY: return {value:[evaluateStandardSentence(fragment.array, env)]};
		    case KIND_CODEBLOCK: return GLang.codeblockFromTree(fragment.sentences, env);
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
