;(function(){
	function waiting(){
		return {
			next:function(token){
				switch(token.category){
					case "Word": return name(token);
					case "Digit": return integer(token);
					case "Space": return waiting();
				}
				switch(token.textValue){
					case "}": return codeBlock("", 1);
					case "]": return arrayBlock("", 1);
					case ")": return parenthesesBlock("", 1);
					case "'": return singleQuoteBlock("");
					case '"': return doubleQuoteBlock("");
					case '`': return commentBlock();
					case '´': return commentBlock();
				}
				return group([waiting(), special(token)]);
			},
			waiting:true,
			kind:"waiting"
		}
	}
	
	function special(specialToken){
		return {
			special:specialToken,
			kind:"special"
		}
	}
	
	function depthBlock(open, close, then){
		return function blockFunction(text, depth){
			return {
				next:function(token){
					if(token.textValue === open){
						if(depth === 1){
							return then(text);
						}
						depth -= 1;
					}else if(token.textValue === close){
						depth += 1;
					}
					return blockFunction(token.textValue + text, depth);
				},
				kind:"depthBlock"
			}
		}
	}
	
	var codeBlock = depthBlock("{", "}", function(text){return group([waiting(), string(text)])});
	var arrayBlock = depthBlock("[", "]", function(text){return group([waiting(), {kind:"array", array:GLang.generateTree(text)}])});
	var parenthesesBlock = depthBlock("(", ")", function(text){return group([waiting(), {kind:"parentheses", parentheses:GLang.generateTree(text)}])});
	
	function doubleQuoteBlock(text){
		return {
			next:function(token){
				if(token.textValue === '"') return group([waiting(), string(text)]);
				return doubleQuoteBlock(token.textValue + text)
			},
			kind:"doubleQuoteBlock"
		}
	}
	
	function singleQuoteBlock(text){
		return {
			next:function(token){
				if(token.textValue === "'") return group([waiting(), string(text)]);
				return singleQuoteBlock(token.textValue + text)
			},
			kind:"singleQuoteBlock"
		}
	}
	
	function commentBlock(){
		return {
			next:function(token){
				if(token.textValue === "´" || token.textValue === "`") return waiting();
				return commentBlock()
			},
			kind:"commentBlock"
		}
	}
	
	function error(token){
		return {
			next:function(token){return this},
			error: token,
			kind:"error"
		}
	}
	
	function name(wordToken){
		return {
			next:function(token){
				if(token.textValue === "$") return group([waiting(), string(wordToken.textValue)])
				return group([waiting(), this]).next(token);
			},
			name:wordToken,
			kind:"name"
		}
	}
	
	function integer(intToken){
		return {
			next:function(token){
				if(token.textValue === ",") return commaNumber(intToken);
				if(token.textValue === "\\") return group([waiting(), negativeNumber(this.num)]);
				return group([waiting(), this]).next(token);
			},
			num:parseInt(intToken.textValue),
			kind:"num"
		}
	}
	
	function commaNumber(intToken){
		return {
			next:function(token){
				if(token.category === "Digit") return group([waiting(), float(token, intToken)]);
				return error(token);
			},
			kind:"commaNumber"
		}
	}
	
	function float(wholeToken, decimalToken){
		return {
			next:function(token){
				if(token.textValue === "\\") return group([waiting(), negativeNumber(this.num)]);
				return group([waiting(), this]).next(token);
			},
			num:parseFloat(wholeToken.textValue + "." + decimalToken.textValue),
			kind:"num"
		}
	}
	
	function negativeNumber(positive){
		return {kind:"num", num:-positive}
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
				var nextState = stateList[0].next(token);
				if(nextState.group){
					return group(nextState.group.concat(stateList.slice(1)));
				}
				return group([nextState].concat(stateList.slice(1)));
			},
			group: stateList,
			kind:"group"
		}
	}
	
	function makeSentences(tree){
		var sentences = [];
		var sentence = [];
		for(var i = 0; i < tree.length; i++){
			if(tree[i].kind === "special" && tree[i].special.textValue === "."){
				sentences.push(loopState(sentence));
				sentence = [];
			}else sentence.push(tree[i]);
		}
		
		if(sentence.length) sentences.push(loopState(sentence));
		
		var newTree = [];
		for(var i = 0; i < sentences.length; i++){
			newTree = newTree.concat(sentences[i]);
			if(i < sentences.length - 1) newTree.push({kind:"special", special:{textValue:"."}});
		}
		return newTree;
	}
	
	function loopState(state){
		//Loop over tree and group items that need to be looped
		for(var i = 0; i < state.length; i++){
			//Remove remaining waiting element
			if(state[i].waiting){
				state.splice(i, 1);
				i--;
				continue;
			}
			//Check for type indicators
			else if(state[i].special && state[i].special.textValue === "?"){
				var op = [{kind:"name", name:"calcitAnnotate"}];
				var a = state[i + 1];
				var b = state[i - 1];
				var typedValue = {kind:"parentheses", parentheses:[a, {name:{textValue:"calcitSetType"}, kind:"name"}, b]};
				
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
			else if(state[i].special && state[i].special.textValue === "@"){
				var op = [{kind:"name", name:{textValue:"calcitSetAnnotation"}}];
				var a = state.splice(i + 1, 1);
				var b = loopState(state.splice(i + 1, (state.length - i) - 1));
				state = state.slice(0, i).concat(a).concat(op).concat(b);
				
				//The loop will end after this
				break;
			}
			//Check for comments
			else if(state[i].special && state[i].special.textValue === "#"){
				var op = [{kind:"name", name:{textValue:"calcitAddComment"}}];
				var a = state.splice(i + 1, 1);
				var b = loopState(state.splice(i + 1, (state.length - i) - 1));
				state = state.slice(0, i).concat(a).concat(op).concat(b);
				
				//The loop will end after this
				break;
			}
			//Check for exclamation marks
			else if(state[i].special && state[i].special.textValue === "!"){
				var done = false;
				switch(i){
					case state.length - 2:
						var op = loopState(state.splice(i + 1, 1));
						state = state.slice(0, i).concat([
							{kind:"name", name:{textValue:"do"}},
							{kind:"name", name:{textValue:":"}}
						]).concat(op);
						
						done = true; break;
						
					case state.length - 3:
						var op = loopState(state.splice(i + 1, 1));
						var arg = loopState(state.splice(i + 1, 1));
						state = state.slice(0, i).concat(op).concat([
							{kind:"name", name:{textValue:":"}}
						]).concat(arg);
						
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
				state = state.slice(0, i).concat(a).concat(op).concat(b);
				
				//The loop will end after this
				break;
			}
		}
		return state;
	}

	
	GLang.generateTree= function(string){
		var state = waiting();
		var tokens = GLang.tokenize(string);
		for(var i = tokens.length - 1; i >= 0; i--){
			state = state.next(tokens[i]);
		}
		state = state.group ? state.group : [state];
		
		return makeSentences(state);
	}
})();