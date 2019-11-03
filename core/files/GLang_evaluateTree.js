GLang.evaluateTree = function(tree, env){
	var sentence = [];
	var result = GLang.voidValue;
	for(var i = 0; i < tree.length; i++){
		if(tree[i].kind === "special" && tree[i].special.textValue === "."){
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

GLang.evaluateSentence = function(sentence, env){
	var len = sentence.length;
	if(len === 0) return GLang.voidValue;
	if(0 === len % 2){
		//Even number of elements - call the first one
		sentence = sentence.splice(0,1).concat([{kind:"special", special:{textValue:":"}}]).concat(sentence);
		len++;
	}
	if(len === 1) return GLang.evaluateSentenceFragment(sentence[0], env);
	return GLang.evaluateOperation([sentence[0]], [sentence[1]], sentence.slice(2), env);
}

GLang.evaluateOperation = function(a, operator, b, env){
	var aValue = GLang.evaluateTree(a, env);
	var bValue = GLang.evaluateTree(b, env);
	var operatorValue = GLang.evaluateTree(operator, env);
	
	return GLang.callObject(operatorValue, env, [aValue, bValue]);
}

GLang.evaluateSentenceFragment = function(fragment, env){
	switch(fragment.kind){
		case "string": 
			var str = GLang.stringValue(fragment.string);
			str.environment = env;
			return str;
		case "num": return {value:fragment.num};
		case "name": return env.resolveName(fragment.name.textValue);
		case "parentheses": return GLang.evaluateTree(fragment.parentheses, env);
		case "array": return GLang.arrayValue([GLang.evaluateTree(fragment.array, env)]);
		case "special": return env.resolveName(fragment.special.textValue);
		case "waiting": return {value:[]};
		default: console.error(fragment);
	}
}