;(function(){
	var optimized = false;

	const WAITING = {
		next:function(token){
			switch(token.category){
				case "Word": return name(token);
				case "Digit": return integer(parseInt(token.textValue));
				case "Space": return WAITING;
			}
			switch(token.textValue){
				case "{": return codeBlock(1);
				case "[": return arrayBlock(1);
				case "(": return parenthesesBlock(1);
				case "'":
				case '"': return quoteBlock(token.textValue);
				case "$": return DOLLAR_STRING;
				case "\\": return NEGATIVE_SIGN;
				case '`':
				case '´': return COMMENT_BLOCK;
			}
			return group([special(token), WAITING]);
		},
		waiting:true,
		kind:"waiting"
	};
	
	function special(specialToken){
		return {
			special:specialToken.textValue,
			kind:"special"
		}
	}
	
	function depthBlock(open, close, then){
		return function(depth /*of the block - increased with every 'open' character*/){
			return {
				next:function(token){
					if(token.textValue === close){
						if(depth === 1){
							return then(this.text);
						}
						depth -= 1;
						if(depth < 0) throw new Error("Block depth is smaller than zero - caused by this character: " + close);
					}else if(token.textValue === open){
						depth += 1;
					}
					
					this.text += token.textValue;
					return this;
				},
				text: "",
				kind:"depthBlock"
			}
		}
	}
	
	var codeBlock = depthBlock("{", "}", function(text){return group([string(text), WAITING])});
	var arrayBlock = depthBlock("[", "]", function(text){return group([{kind:"array", array:GLang.generateTree(text)}, WAITING])});
	var parenthesesBlock = depthBlock("(", ")", function(text){
		var parenthesesTree = GLang.generateTree(text, optimized);
		if(parenthesesTree.length == 1){
			return group([parenthesesTree[0], WAITING])
		}
		return group([
			{
				kind:"parentheses",
				parentheses:parenthesesTree
			},
			WAITING
		])
	});
	
	function quoteBlock(closer){
		return {
			next:function(token){
				if(token.textValue === closer) return group([string(this.text), WAITING]);
				this.text += token.textValue;
				return this;
			},
			text:"",
			kind:"quoteBlock"
		}
	}
	
	const COMMENT_BLOCK = {
		next:function(token){
			if(token.textValue === "´" || token.textValue === "`") return WAITING;
			return this;
		},
		kind:"commentBlock"
	}
	
	function name(wordToken){
		return {
			next:function(token){
				return group([this, WAITING]).next(token);
			},
			name:wordToken.textValue,
			kind:"name"
		}
	}
	
	const DOLLAR_STRING = {
		next:function(token){
			if(token.category === "Word") return group([string(token.textValue), WAITING])
			throw new Error("The dollar sign ($) has to be followed by a 'Word' token - but is followed by: " + token.textValue);
		},
		kind:"dollarString"
	};
	
	const NEGATIVE_SIGN = {
		next:function(token){
			if(token.category === "Digit") return group([integer(-parseInt(token.textValue)), WAITING])
			throw new Error("The minus sign (\\) has to be followed by a 'Digit' token - but is followed by: " + token.textValue);
		},
		kind:"negativeSign"
	}
	
	function integer(intNumber){
		return {
			next:function(token){
				if(token.textValue === ",") return commaNumber(intNumber);
				return group([this, WAITING]).next(token);
			},
			num:intNumber,
			kind:"num"
		}
	}
	
	function commaNumber(intNumber){
		return {
			next:function(token){
				if(token.category === "Digit") return group([float(intNumber, token), WAITING]);
				return error(token);
			},
			kind:"commaNumber"
		}
	}
	
	function float(wholeNumber, decimalToken){
		return {
			next:function(token){
				return group([this, WAITING]).next(token);
			},
			num:parseFloat(wholeNumber + "." + decimalToken.textValue),
			kind:"num"
		}
	}
	
	function string(string){
		return {
			string: string,
			kind:"string"
		}
	}
	
	function group(stateList){
		return {
			next:function(token){
				var nextState = stateList.pop().next(token);
				if(nextState.group){
					return group(stateList.concat(nextState.group));
				}
				return group(stateList.concat([nextState]));
			},
			group: stateList,
			kind:"group"
		}
	}
	
	function makeSentences(tree){
		var sentences = [];
		var sentence = [];
		for(var i = 0; i < tree.length; i++){
			if(tree[i].special == "."){
				sentences.push(loopState(sentence));
				sentence = [];
			}else sentence.push(tree[i]);
		}
		
		if(sentence.length) sentences.push(loopState(sentence));
		
		var newTree = [];
		for(var i = 0; i < sentences.length; i++){
			newTree = newTree.concat(sentences[i]);
			if(i < sentences.length - 1) newTree.push({kind:"dot", dot:1});
		}
		return newTree;
	}
	
	function loopState(state){
		//Accept empty state list
		if(!state.length) return state;
		
		//Remove remaining waiting element
		if(state[state.length - 1].waiting) state.pop();
		
		//Loop over tree and group items that need to be looped
		for(var i = 0; i < state.length; i++){
			//Check for type indicators
			if(state[i].special === "?"){
				var a = state[i + 1];
				var b = state[i - 1];
				var typedValue = {kind:"parentheses", parentheses:[a, {name:"calcitSetType", kind:"name"}, b]};
				
				state[i] = typedValue;
				//Remove item i - 1 (value)
				state.splice(i + 1, 1);
				//Remove item i + 1 (type)
				state.splice(i - 1, 1);
				//Be careful to change the order of these splices as the index of items changes when using higher ones after lower ones
				
				//Move the current item one step back, because one item was removed from the tree before the current one
				i = i - 2;
				continue;
			}
			//Check for annotations
			else if(state[i].special === "@"){
				var op = [{kind:"name", name:"calcitSetAnnotation"}];
				var a = state.splice(i + 1, 1);
				var b = loopState(state.splice(i + 1, (state.length - i) - 1));
				state = state.slice(0, i).concat(a, op, b);
				
				//The loop will end after this
				break;
			}
			//Check for comments
			else if(state[i].special === "#"){
				var op = [{kind:"name", name:"calcitAddComment"}];
				var a = state.splice(i + 1, 1);
				var b = loopState(state.splice(i + 1, (state.length - i) - 1));
				
				if(optimized) {
					state = state.slice(0, i).concat(b);
				}else{
					state = state.slice(0, i).concat(a, op, b);
				}
				
				//The loop will end after this
				break;
			}
			//Check for exclamation marks
			else if(state[i].special === "!"){
				var done = false;
				switch(i){
					case state.length - 2:
						var op = loopState(state.splice(i + 1, 1));
						state = state.slice(0, i).concat(
							[
								{kind:"name", name:"do"},
								{kind:"name", name:":"}
							],
							op
						);
						
						done = true; break;
						
					case state.length - 3:
						var op = loopState(state.splice(i + 1, 1));
						var arg = loopState(state.splice(i + 1, 1));
						state = state.slice(0, i).concat(op, {kind:"name", name:":"}, arg);
						
						done = true; break;
				}
				if(done) break;
				
				if(i > state.length - 2){
					//We need at least three values to the right of ! - this requirement is not met
					throw new Error("The character ! is not allowed here. It can be used as follows: !operator firstOperand secondOperand.");
				}
				//Form: !op a b
				var op = loopState(state.splice(i + 1, 1));
				var a = loopState(state.splice(i + 1, 1));
				var b = loopState(state.splice(i + 1, (state.length - i) - 1));
				state = state.slice(0, i).concat(a, op, b);
				
				//The loop will end after this
				break;
			}
		}
		return state;
	}

	
	GLang.generateTree= function(string, optimize){
		optimized = optimize;
		
		var state = WAITING;
		var tokens = GLang.tokenize(string);
		
		for(var i = 0; i < tokens.length; i++){
			state = state.next(tokens[i]);
		}
		return makeSentences(state.group || [state]);
	}
})();