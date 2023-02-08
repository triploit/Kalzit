GLang.evaluateTree = function evaluateTree(tree, env){
	var sentence = [];
	var result = GLang.voidValue;
	for(var i = 0; i < tree.length; i++){
		if(tree[i].dot){
			result = GLang.evaluateSentence(sentence, env);
			sentence = [];
		}else{
			sentence.push(tree[i]);
		}
	}
	if(sentence.length){
		result = GLang.evaluateSentence(sentence, env)
	}
	return result;
}

GLang.evaluateSentence = function evaluateSentence(sentence, env){
	const len = sentence.length;
	if(len === 0) return GLang.voidValue;
    if(len === 1) return GLang.evaluateSentenceFragment(sentence[0], env);
	if(0 === len % 2){
		//Even number of elements - add a colon
		sentence = sentence.splice(0,1).concat([{kind:"name", name:":"}]).concat(sentence);
	}
	return GLang.evaluateOperation(sentence[0], sentence[1], sentence.slice(2), env);
}

//Evaluates sentences with an uneven number of elements; this function does NOT add an extra colon if needed
function evaluateStandardSentence(sentence, env) {
    switch(sentence.length) {
        case 0: return GLang.voidValue;
        case 1: return GLang.evaluateSentenceFragment(sentence[0], env);
        default: return GLang.evaluateOperation(sentence[0], sentence[1], sentence.slice(2), env);
    }
}

GLang.evaluateOperation = function evaluateOperation(a, operator, b, env){
	var aValue = GLang.evaluateSentenceFragment(a, env);
	var bValue = evaluateStandardSentence(b, env);
	var operatorValue = GLang.evaluateSentenceFragment(operator, env);
	
	return GLang.callObject(operatorValue, env, [aValue, bValue]);
}

GLang.evaluateSentenceFragment = function evaluateSentenceFragment(fragment, env){
	switch(fragment.kind){
		case "string": 
			var str = GLang.stringValue(fragment.string);
			str.environment = env;
			return str;
		case "num": return {value:fragment.num};
		case "name": return env.resolveName(fragment.name);
		case "parentheses": return GLang.evaluateTree(fragment.parentheses, env);
		case "array": return {value:[GLang.evaluateTree(fragment.array, env)]};
//		case "special": return env.resolveName(fragment.special);
		default: console.error(fragment);
	}
}
