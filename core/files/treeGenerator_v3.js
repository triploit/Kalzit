;(function(){

	const WAITING = {
		next:function(token){
			switch(token.category){
				case "Word": return name(token);
				case "Digit": return integer(parseInt(token.textValue));
				case "Space": return WAITING;
			}
			switch(token.textValue){
				//case "#": throw new Error("Old-style doc comments (with a #) are deprecated; please replace them with /* */");
				case "/": return SLASH;
				case "}":
				case "]":
				case ")": throw new Error("Found block closing character without an opener: " + token.textValue);
				case "?": throw new Error("The question mark (?) is only allowed after strings");
				case ",": throw new Error("The comma (,) is only allowed as part of a number; it is used as the decimal point.");
				case "{": return codeBlockInProgress(WAITING, "}");
				case "[": return arrayBlock(1);
				case "(": return parenthesesBlock(1);
				case "'":
				case '"': return quoteBlock(token.textValue);
				case "$": return DOLLAR_STRING;
				case "@": return annotationStart("calcitSetAnnotation");
				case "\\": return NEGATIVE_SIGN;
				case '`':
				case '´': return COMMENT_BLOCK;
				case '-': return MINUS_SIGN;
				case '=': return EQUALS_SIGN;
			}
			return name(token);
		},
		waiting:true,
		kind:"waiting"
	};
	
	const SLASH = {
		next:function(token) {
			if(token.textValue === "*") {
				// /* is the start of a block comment
				return BLOCK_COMMENT;
			} else {
				return group([this, WAITING.next(token)]);	
			}
		},
		kind:"name",
		name:"/"
	};
	
	const BLOCK_COMMENT = {
		next:function(token) {
			if(token.textValue === "*") {
				// We might have the end of a block comment here
				return POTENTIALLY_ENDING_BLOCK_COMMENT;
			} else {
				return this;	
			}
		},
		waiting: true,
		getReasonForWaiting: function() {
			return "Block comments need to end with '*/"
		},
		kind:"blockComment"
	};
	
	const POTENTIALLY_ENDING_BLOCK_COMMENT = {
		next:function(token) {
			if(token.textValue === "/") {
				// The block comment has ended
				return WAITING;
			} else if(token.textValue === "*") {
				// We might still have the ending character next
				return this;
			} else {
				// Okay, so the block comment is NOT ending right now
				return BLOCK_COMMENT;	
			}
		},
		waiting: true,
		getReasonForWaiting: function() {
			return "Block comments need to end with '*/"
		},
		kind:"blockComment"
	};
	
	const MINUS_SIGN = {
		next:function(token){
			if(token.textValue === ">") {
				// -> (MINUS + >) is an arrow
				return group([ARROW, WAITING]);
			} else {
				return group([this, WAITING.next(token)]);	
			}
		},
		name:"-",
		kind:"name"
	};
	
	const EQUALS_SIGN = {
		next:function(token){
			if(token.textValue === ">") {
				// => (MINUS + >) is an arrow
				return group([ARROW, WAITING]);
			} else {
				return group([this, WAITING.next(token)]);	
			}
		},
		name: "=",
		kind: "name"
	};
	
	const ARROW = {
		kind: "arrow",
		waiting: true
	};
	
	function isFinishedTree(tree){
		if (tree === WAITING) {
			return true;
		} else {
			//if(typeof tree.waiting !== "boolean") throw new Error("Tree generator error: each tree item has to have a 'waiting' property of type 'boolean'. " + JSON.stringify(tree));
			return !tree.waiting;
		}
	}
	
	function annotationStart(annotationApplyName) {
		return {
			kind: "annotationStart",
			annotationTree: WAITING,
			waiting: true,
			getReasonForWaiting: function() {
				return "You have started an annotation, but a valid piece of code for the value is missing." + (this.annotationTree.getReasonForWaiting ? " The reason why the annotation value is unfinished is this: " + this.annotationTree.getReasonForWaiting() : "")
			},
			next:function(token){
				//We will just ignore spaces at the start, which allows something like "@ <space> annotation value"
				if (this.annotationTree === WAITING && token.category === "Space") return this;
				
				this.annotationTree = this.annotationTree.next(token);
				
				//To go on, the annotation content has to be finished
				if(isFinishedTree(this.annotationTree)) {
					//We are here, so that means we have to actually build instructions to apply the annotation
					//Figure out if we have a group
					if(this.annotationTree.group) {
						this.annotationTree.group.pop();
						return group(this.annotationTree.group.concat([
							{"name":annotationApplyName, "kind": "name"}, WAITING
						]))
					} else {
						return group([
							this.annotationTree, {"name":annotationApplyName, "kind": "name"}, WAITING
						])
					}
				} else {
					return this;
				}
			}
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
				waiting: true,
				kind:"depthBlock",
				getReasonForWaiting: function() {
					return "You have opened a block with the character '" + open + "' , so you have to close it with '" + close + "'"
				}
			}
		}
	}
	
	var codeBlockInProgress = function(tree, closer) {
        return {
            waiting: true,
            kind:"codeBlockInProgress",
            next:function(token){
                if(isFinishedTree(tree)) {
                    if(token.textValue === closer) {
                        return group([{kind:"codeBlock", "sentences":makeSentences(tree.group || [tree])}, WAITING]);
                    }
                }
                //Block is not finished; continue
                return codeBlockInProgress(tree.next(token), closer);
            },
            tree:tree,
            getReasonForWaiting: function(){return "You need to add } to finish the code block"}
        }
    };
	var arrayBlock = depthBlock("[", "]", function(text){return group([{kind:"array", array:GLang.generateTree(text)}, WAITING])});
	var parenthesesBlock = depthBlock("(", ")", function(text){
		var parenthesesTree = GLang.generateTree(text);
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
	
	// This function defines normal, quoted strings. They end as soon as the "closer" is reached
	function quoteBlock(closer){
		return {
			next:function(token){
				if(token.textValue === closer) return string(this.text);
				this.text += token.textValue;
				return this;
			},
			text:"",
			waiting: true,
			kind:"quoteBlock"
		}
	}
	
	const COMMENT_BLOCK = {
		next:function(token){
			if(token.textValue === "´" || token.textValue === "`") return WAITING;
			return this;
		},
		waiting: true,
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
			if(token.category === "Word") return string(token.textValue)
			throw new Error("The dollar sign ($) has to be followed by a 'Word' token - but is followed by: " + token.textValue);
		},
		waiting: true,
		kind:"dollarString"
	};
	
	const NEGATIVE_SIGN = {
		next:function(token){
			if(token.category === "Digit") return group([integer(-parseInt(token.textValue)), WAITING])
			throw new Error("The minus sign (\\) has to be followed by a 'Digit' token - but is followed by: " + token.textValue);
		},
		kind:"negativeSign",
		waiting: true
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
			kind:"commaNumber",
			waiting: true
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
	
	//Defines any kind of string. Strings can be followed by a question mark.
	function string(string){
		return {
			string: string,
			kind:"string",
			next: function(token){
				if (token.textValue === "?") {
					return stringWithQuestionMark(string);
				} else if (token.category === "Space") {
					return this;
				} else {
					return new group([this, WAITING]).next(token);	
				}
			}
		}
	}
	
	function stringWithQuestionMark(stringValue) {
		return {
			kind: "stringWithQuestionMark",
			waiting: true,
			stringValue: stringValue,
			typeTree: WAITING,
			next: function(token) {
				this.typeTree = this.typeTree.next(token);
				if(isFinishedTree(this.typeTree) && this.typeTree !== WAITING) {
					return group([
						{kind:"parentheses", parentheses:[this.typeTree.group ? this.typeTree.group[0] : this.typeTree, {name:"calcitSetType", kind:"name"}, string(this.stringValue)]},
						WAITING
					])
				} else {
					return this;	
				}
			}
		}
	}
	
	function group(stateList){
		var waiting = null;
		if(stateList.length === 0) throw new Error("Tree generator error: The 'group' function should never be called with an empty state list");
		
		if (stateList[stateList.length - 1] === WAITING) {
			waiting = false;	
		} else {
			//console.log(stateList);
			isFinishedTree(stateList[stateList.length - 1]);
			waiting = 	stateList[stateList.length - 1].waiting;
		}
		
		return {
			next:function(token){
				var nextState = stateList.pop().next(token);
				if(nextState.group){
					return group(stateList.concat(nextState.group));
				}
				return group(stateList.concat([nextState]));
			},
			group: stateList,
			kind:"group",
			waiting: waiting
		}
	}
	
	function makeSentences(tree){
		var sentences = [];
		var sentence = [];
		for(var i = 0; i < tree.length; i++){
			if(tree[i].name == "."){
				sentences.push(finishSentenceAndCheckForExclamationMarks(sentence));
				sentence = [];
			}else sentence.push(tree[i]);
		}
		
		if(sentence.length) sentences.push(finishSentenceAndCheckForExclamationMarks(sentence));
		
		var newTree = [];
		for(var i = 0; i < sentences.length; i++){
			newTree = newTree.concat(sentences[i]);
			if(i < sentences.length - 1) newTree.push({kind:"dot", dot:1});
		}
		return newTree;
	}
	
	function finishSentenceAndCheckForExclamationMarks(state){
		//Accept empty state list
		if(!state.length) return state;
		
		//Remove remaining waiting element
		if(state[state.length - 1] ===  WAITING) state.pop();
		
		//Loop over tree and check for exclamation marks; they need to be handled in a special way
		loop:
		for(var i = 0; i < state.length; i++){
			//Check for exclamation marks
			if(state[i].name === "!"){
				switch(i){
					case state.length - 2:
						var op = finishSentenceAndCheckForExclamationMarks(state.splice(i + 1, 1));
						state = state.slice(0, i).concat(
							[
								{kind:"name", name:"do"},
								{kind:"name", name:":"}
							],
							op
						);
						
						break loop;
						
					case state.length - 3:
						var op = finishSentenceAndCheckForExclamationMarks(state.splice(i + 1, 1));
						var arg = finishSentenceAndCheckForExclamationMarks(state.splice(i + 1, 1));
						state = state.slice(0, i).concat(op, {kind:"name", name:":"}, arg);
						
						break loop;
				}
				
				if(i > state.length - 2){
					//We need at least three values to the right of ! - this requirement is not met
					throw new Error("The character ! is not allowed here. It can be used as follows: !operator firstOperand secondOperand.");
				}
				//When we are here, we have two possible forms:
				//Form 1: !op a b c (becomes "a op b c" without syntactig sugar).
				//Form 2: !op a b -> c d (becomes "!op (c d) a b"; arrow switches the arguments)
				
				//Figure out which function we need to call
				var op = finishSentenceAndCheckForExclamationMarks(state.splice(i + 1, 1));
				
				//Figure out if there is an arrow after the exclamation mark
				var slicedStateAfterOperator = state.slice(i + 1);
				var relativeArrowIndex = slicedStateAfterOperator.indexOf(ARROW);
				if (relativeArrowIndex !== -1) {
					//throw new Error("WE HAVE AN ARROW!");
					//We have an arrow somewhere
					if (relativeArrowIndex == 0 || relativeArrowIndex == slicedStateAfterOperator.length - 1) {
						throw new Error("You almost got the arrow syntax right! Just put something before and after the arrow.");	
					}
					var b = finishSentenceAndCheckForExclamationMarks({kind:"parentheses", parentheses:slicedStateAfterOperator.splice(0, relativeArrowIndex)});
					var a = finishSentenceAndCheckForExclamationMarks({kind:"parentheses", parentheses:slicedStateAfterOperator.slice(1)});
					state = state.slice(0, i).concat(a, op, b);
				} else {
					//We have no arrow; this is form 1 from above
					var a = finishSentenceAndCheckForExclamationMarks(state.splice(i + 1, 1));
					var b = finishSentenceAndCheckForExclamationMarks(state.splice(i + 1, (state.length - i) - 1));
					state = state.slice(0, i).concat(a, op, b);
				}
				
				//The loop will end after this
				break;
			}
		}
		return state;
	}

	
	GLang.generateTree= function(string){
		var state = WAITING;
		var tokens = GLang.tokenize(string);
		
		for(var i = 0; i < tokens.length; i++){
			state = state.next(tokens[i]);
		}
		if(!isFinishedTree(state)) {
			if(!state.getReasonForWaiting) {
				throw new Error("Your code is not finished. Relevant syntax tree: " + JSON.stringify(state.group ? state.group[state.group.length - 1] : state));
			} else {
				throw new Error("Unfinished code error. " + state.getReasonForWaiting() + ". Relevant syntax tree: " + JSON.stringify(state.group ? state.group[state.group.length - 1] : state));
			}
		}
		var result = makeSentences(state.group || [state]);
		
		return result;
	}
})();
