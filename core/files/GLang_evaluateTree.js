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
	const EQUALS_VALUE = GLang.defaultRuntimeEnvironment["kv_="];
	const SEMICOLON_VALUE = GLang.defaultRuntimeEnvironment["kv_;"];
	const SET_TYPE_VALUE = GLang.defaultRuntimeEnvironment["kv_calcit_set_type"];
	const SET_ANNOTATION_VALUE = GLang.defaultRuntimeEnvironment["kv_calcit_set_annotation"];
	const DO_VALUE = GLang.defaultRuntimeEnvironment["kv_do"];
	
	function evaluateOperation(firstParamFragment, operatorFragment, secondParamValue, env) {
		switch (operatorFragment.k) {
			case KIND_COLON: return GLang.callObject(evaluateSentenceFragment(firstParamFragment, env), env, [secondParamValue]);
			case KIND_EQUALS: return EQUALS_VALUE.value(env, [evaluateSentenceFragment(firstParamFragment, env), secondParamValue]);
			case KIND_SEMICOLON: return SEMICOLON_VALUE.value(env, [evaluateSentenceFragment(firstParamFragment, env), secondParamValue]);
			case KIND_SET_TYPE: return SET_TYPE_VALUE.value(env, [evaluateSentenceFragment(firstParamFragment, env), secondParamValue]);
			case KIND_SET_ANNOTATION: return SET_ANNOTATION_VALUE.value(env, [evaluateSentenceFragment(firstParamFragment, env), secondParamValue]);
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
			case KIND_EQUALS: return EQUALS_VALUE;
			case KIND_SEMICOLON: return SEMICOLON_VALUE;
			case KIND_SET_TYPE: return SET_TYPE_VALUE;
			case KIND_SET_ANNOTATION: return SET_ANNOTATION_VALUE;
			//Do the slightly less common things later
			case KIND_STRING: return GLang.stringValue(fragment.s);
			case KIND_NUMBER: return {value:fragment.num};
			case KIND_NAME: return env.resolveName(fragment.n);
			case KIND_PARENTHESES: return evaluateStandardSentence(fragment.p, env);
			case KIND_ARRAY: return {value:[evaluateStandardSentence(fragment.array, env)]};
		    case KIND_CODEBLOCK: return GLang.codeblockFromTree(fragment.sentences, env);
			case KIND_DO: return DO_VALUE;
			case KIND_GET: return env.resolveName(fragment.m).value.mutable;
	//		case "special": return env.resolveName(fragment.special);
			default: throw new Error("The following sentence fragment could not be evaluated: " + JSON.stringify(fragment));
		}
	}
})()
