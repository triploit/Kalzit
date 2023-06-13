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
        case 1: return GLang.evaluateSentenceFragment(sentence[0], env);
		case 3: //Basic operation
			return GLang.callObject(GLang.evaluateSentenceFragment(sentence[1], env), env, [
				GLang.evaluateSentenceFragment(sentence[0], env),
				GLang.evaluateSentenceFragment(sentence[2], env)
			]);
		default: //Longer sentence with multiple operations
			//Evaluate each operation in the sentence; start at the last one
			var result = GLang.evaluateSentenceFragment(sentence[sentence.length - 1], env);
			for(var i = sentence.length - 2; i >= 1; i -= 2) {
				result = GLang.callObject(GLang.evaluateSentenceFragment(sentence[i], env), env, [
					GLang.evaluateSentenceFragment(sentence[i - 1], env),
					result
				])
			}
			return result;
    }
}

////Variant of evaluateOperation, where the caller guarantees that "b" is a sentence fragment
//function evaluateFragmentOperation(a, operator, b, env) {
//	var aValue = GLang.evaluateSentenceFragment(a, env);
//	var bValue = GLang.evaluateSentenceFragment(b, env);
//	var operatorValue = GLang.evaluateSentenceFragment(operator, env);
//	
//	return GLang.callObject(operatorValue, env, [aValue, bValue]);
//}

//GLang.evaluateOperation = function evaluateOperation(a, operator, b, env){
//	var aValue = GLang.evaluateSentenceFragment(a, env);
//	var bValue = evaluateStandardSentence(b, env);
//	var operatorValue = GLang.evaluateSentenceFragment(operator, env);
//	
//	return GLang.callObject(operatorValue, env, [aValue, bValue]);
//}

GLang.evaluateSentenceFragment = function evaluateSentenceFragment(fragment, env){
	switch(fragment.kind){
		case KIND_STRING: return GLang.stringValue(fragment.string);
		case KIND_NUMBER: return {value:fragment.num};
		case KIND_NAME: return env.resolveName(fragment.name);
		case KIND_PARENTHESES: return evaluateStandardSentence(fragment.parentheses, env);
		case KIND_ARRAY: return {value:[evaluateStandardSentence(fragment.array, env)]};
        case KIND_CODEBLOCK: return {value:{sentences: fragment.sentences}, display:"codeBlock", env:env};
//		case "special": return env.resolveName(fragment.special);
		default: throw new Error("The following sentence fragment could not be evaluated: " + JSON.stringify(fragment));
	}
}
