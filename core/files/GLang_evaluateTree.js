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
	var len = sentence.length;
	if(len === 0) return GLang.voidValue;
	if(0 === len % 2){
		//Even number of elements - call the first one
		sentence = sentence.splice(0,1).concat([{kind:"special", special:":"}]).concat(sentence);
		len++;
	}
	if(len === 1) return GLang.evaluateSentenceFragment(sentence[0], env);
	return GLang.evaluateOperation([sentence[0]], [sentence[1]], sentence.slice(2), env);
}

GLang.evaluateOperation = function evaluateOperation(a, operator, b, env){
	var aValue = GLang.evaluateTree(a, env);
	var bValue = GLang.evaluateTree(b, env);
	var operatorValue = GLang.evaluateTree(operator, env);
	
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
		case "special": return env.resolveName(fragment.special);
		default: console.error(fragment);
	}
}