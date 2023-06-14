(function() {
	GLang.evaluateTree = function evaluateTree(tree, env){
		if(tree.length === 0) return GLang.voidValue;
		
		var sentence = [];
		var result = GLang.voidValue;
		for(var i = 0; i < tree.length; i++){
			if(tree[i].dot){
				result = evaluateStandardSentence(sentence, env);
				sentence = [];
			}else{
				sentence.push(tree[i]);
			}
		}
		if(sentence.length){
			result = evaluateStandardSentence(sentence, env)
		}
		return result;
	}

	//Evaluates sentences with an uneven number of elements; this function does NOT add an extra colon if needed
	function evaluateStandardSentence(sentence, env) {
		switch(sentence.length) {
		    case 0: return GLang.voidValue;
		    case 1: return evaluateSentenceFragment(sentence[0], env);
			case 3: //Basic operation
				return GLang.callObject(evaluateSentenceFragment(sentence[1], env), env, [
					evaluateSentenceFragment(sentence[0], env),
					evaluateSentenceFragment(sentence[2], env)
				]);
			default: //Longer sentence with multiple operations
				//Evaluate each operation in the sentence; start at the last one
				var result = evaluateSentenceFragment(sentence[sentence.length - 1], env);
				for(var i = sentence.length - 2; i >= 1; i -= 2) {
					result = GLang.callObject(evaluateSentenceFragment(sentence[i], env), env, [
						evaluateSentenceFragment(sentence[i - 1], env),
						result
					])
				}
				return result;
		}
	}

	//evaluateSentenceFragment will need to return specific values very, VERY often
	//Load and store them here, so they are easily accessible
	const COLON_VALUE = GLang.defaultRuntimeEnvironment["kv_:"].varValue;
	const EQUALS_VALUE = GLang.defaultRuntimeEnvironment["kv_="].varValue;
	const SEMICOLON_VALUE = GLang.defaultRuntimeEnvironment["kv_;"].varValue;
	const SET_TYPE_VALUE = GLang.defaultRuntimeEnvironment["kv_calcit_set_type"].varValue;
	const SET_ANNOTATION_VALUE = GLang.defaultRuntimeEnvironment["kv_calcit_set_annotation"].varValue;
	const DO_VALUE = GLang.defaultRuntimeEnvironment["kv_do"].varValue;
	const GET_VALUE = GLang.defaultRuntimeEnvironment["kv_get"].varValue;

	function evaluateSentenceFragment(fragment, env){
		switch(fragment.kind){
			//Do the super common things first
			case KIND_COLON: return COLON_VALUE;
			case KIND_EQUALS: return EQUALS_VALUE;
			case KIND_SEMICOLON: return SEMICOLON_VALUE;
			case KIND_SET_TYPE: return SET_TYPE_VALUE;
			case KIND_SET_ANNOTATION: return SET_ANNOTATION_VALUE;
			//Do the slightly less common things later
			case KIND_STRING: return GLang.stringValue(fragment.string);
			case KIND_NUMBER: return {value:fragment.num};
			case KIND_NAME: return env.resolveName(fragment.name);
			case KIND_PARENTHESES: return evaluateStandardSentence(fragment.parentheses, env);
			case KIND_ARRAY: return {value:[evaluateStandardSentence(fragment.array, env)]};
		    case KIND_CODEBLOCK: return {value:{sentences: fragment.sentences}, display:"codeBlock", env:env};
			case KIND_DO: return DO_VALUE;
			case KIND_GET: return GET_VALUE;
	//		case "special": return env.resolveName(fragment.special);
			default: throw new Error("The following sentence fragment could not be evaluated: " + JSON.stringify(fragment));
		}
	}
})()
