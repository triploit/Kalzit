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
		case 3: return evaluateFragmentOperation(sentence[0], sentence[1], sentence[2], env);
        default: return GLang.evaluateOperation(sentence[0], sentence[1], sentence.slice(2), env);
    }
}

//Variant of evaluateOperation, where the caller guarantees that "b" is a sentence fragment
function evaluateFragmentOperation(a, operator, b, env) {
	var aValue = GLang.evaluateSentenceFragment(a, env);
	var bValue = GLang.evaluateSentenceFragment(b, env);
	var operatorValue = GLang.evaluateSentenceFragment(operator, env);
	
	return GLang.callObject(operatorValue, env, [aValue, bValue]);
}

GLang.evaluateOperation = function evaluateOperation(a, operator, b, env){
	var aValue = GLang.evaluateSentenceFragment(a, env);
	var bValue = evaluateStandardSentence(b, env);
	var operatorValue = GLang.evaluateSentenceFragment(operator, env);
	
	return GLang.callObject(operatorValue, env, [aValue, bValue]);
}

GLang.evaluateSentenceFragment = function evaluateSentenceFragment(fragment, env){
	switch(fragment.kind){
		case "string": return GLang.stringValue(fragment.string);
		case "num": return {value:fragment.num};
		case "name": return env.resolveName(fragment.name);
		case "parentheses": return GLang.evaluateTree(fragment.parentheses, env);
		case "array": return {value:[GLang.evaluateTree(fragment.array, env)]};
        case "codeBlock": return {value:{sentences: fragment.sentences}, display:"codeBlock", env:env};
//		case "special": return env.resolveName(fragment.special);
		default: throw new Error("The following sentence fragment could not be evaluated: " + JSON.stringify(fragment));
	}
}
