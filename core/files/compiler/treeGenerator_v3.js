;
//These global constants represent all the kinds of tree items the evaluator can understand
//During tree generation, there are more kinds of items; they are represented by strings
//This makes it very easy to figure out which tree items are intended to be in the finished tree
const KIND_PARENTHESES = 0;
const KIND_CODEBLOCK = 1;
const KIND_STRING = 2;
const KIND_ARRAY = 3;
const KIND_NAME = 4;
const KIND_NUMBER = 5;
const KIND_COLON = 6;
const KIND_ASSIGN_TO_STRING = 7;
const KIND_SEMICOLON = 8;
//const KIND_SET_TYPE = 9;
const KIND_TYPED = 9;
const KIND_SET_ANNOTATION = 10;
const KIND_DO = 11;
const KIND_GET = 12;
const KIND_ASSIGN_TO_MUTABLE_NAME = 13;
const KIND_ASSIGN_TO_MUTABLE_NONAME = 14;
const KIND_FUNCTION_DEFINITION = 15;

if(GLANG_TREE_GENERATOR_INCLUDED) {
	;(function(){
		//Brings a name into its unified form
		function unifyStringName(originalName){
			if(GLANG_DEBUG && "string" !== typeof originalName) throw new Error("unifyStringName only accepts strings - " + JSON.stringify(originalName) + " does not fit this rule");
			
			if(originalName === ""){
				return "";
			}
			
			//Try to go with an easy and fast unification method first
			if(
				//Check for an all-upper-case name - if present, make it lower case and return
				originalName.includes("_") || 
				//If the name does contain underscores, do the same thing
				originalName === originalName.toUpperCase()
			){
				return originalName.toLowerCase();	
			}
			
			//Otherwise, expect lower camel case, place a _ in front of every upper case character and make it lower case
			var unifiedName = originalName.replace(
				//All upper-case characters
				/[A-Z]/g,
				//What to do with them
				char => "_" + char.toLowerCase()
			)
			
			//Add an exception for the first letter of the name (remove leading _ if present)
			if (unifiedName.startsWith("_")){
				return unifiedName.slice(1);	
			}else{
				return unifiedName	
			}
		}

		/*
		This function categorizes a list (items) into categories.
		"items" is a list containing any sort of item (or nothing).

		"categories" is a list with items of the form [category, match_test_function].
		"category" is the category name.
		"match_test_function" is a function that tests if a value fits into the category (return value is usually treated as a boolean).

		Returns a list with items of the form [category, matching_items].
		"category" is the category of each element in "matching_items".
		*/
		function categorize(items, categories) {
			//Handle an empty array, so the code below can assume an array with at least one item
			if(items.length === 0) return [];	

			var unique = true;
			
			function uniqueCategory(){
				unique = !unique;
				return unique ? "_" : "";
			}
			
			//Returns an appropriate category name
			function findCategory(item){
				for(var i = 0; i < categories.length; i++){
					var category = categories[i];
					
					//Check if the category condition matches
					if(category[1](item)){
						return category[0];
					}
				}
				return uniqueCategory();
			}
			
			var currentCategory = findCategory(items[0]);
			var currentGroup = [items[0]];
			var result = [];
			for(var i = 1; i < items.length; i++){
				var item = items[i];
				var newCategory = findCategory(item);
				
				if(newCategory === currentCategory){
					currentGroup.push(item);
				}else{
					result.push([currentCategory, currentGroup]);
					currentGroup = [item];
					currentCategory = newCategory;
				}
			}
			
			//if(currentGroup.length > 0){
				result.push([currentCategory, currentGroup]);
			//}
			
			//return result.slice(1);
			return result;

		}

		//The default function to get tokens from code
		function tokenize(text){
			return categorize(text, [
				["Word",function(n){return n.match("[a-zA-Z_]")}],
				["Digit",function(n){return n.match("\\d")}],
				["Space",function(n){return n.match("\\s")}]
			]).map(
				function(tokenArray){
					return {
						textValue: tokenArray[1].join(""),
						category: tokenArray[0]
					};
				}
			);
		};

		//Represents super common names - like ":" - which have their own kind constants for extra fast access
		function superCommonName(kind) {
			return {
				k:kind,
				next:function(token){
					return group([this, WAITING]).next(token);
				}
			}
		}
		
		const WAITING = {
			next:function(token){
				switch(token.category){
					case "Word": return name(token);
					case "Digit": return integer(parseInt(token.textValue));
					case "Space": return WAITING;
				}
				switch(token.textValue){
					case "/": return SLASH;
					case "~": return TILDE;
					case "}":
					case "]":
					case ")": throw new Error("Found block closing character without an opener: " + token.textValue);
					case "?": throw new Error("The question mark (?) is only allowed after strings");
					case ",": throw new Error("The comma (,) is only allowed as part of a number; it is used as the decimal point.");
					case "{": return blockOfCode(WAITING, "}", "You need to add '}' to finish the code block", finishedCodeBlock);
					case "[": return blockOfCode(WAITING, "]", "You need to add ']' to finish the single-item array block", finishedArrayBlock);
					case "(": return blockOfCode(WAITING, ")", "You need to add ')' to finish the parentheses", finishedParentheses);
					case "'":
					case '"': return quoteBlock(token.textValue);
					case "$": return DOLLAR_STRING;
					case "@": return annotationStart();
					case "\\": return NEGATIVE_SIGN;
					case '`':
					case '´': return COMMENT_BLOCK;
					case '#': return HASH;
					case '-': return MINUS_SIGN;
					case '=': return EQUALS_SIGN;
				}
				return name(token);
			},
			waiting:true,
			k:"waiting"
		};

		const TILDE = {
			next:function(token) {
				if(!token.category === "Word") throw new Error("The tilde (~; followed by the name of a mutable variable to be resolved) has to be immediately followed by a name; no spaces allowed");
				var getCallTreeItem = {k:KIND_GET, m:unifyStringName(token.textValue)};
				return group([getCallTreeItem, WAITING])
			}
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
			k:KIND_NAME,
			n:"/"
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
			k:"blockComment"
		};
		
		const HASH = {
			next:function(token) {
				if(token.textValue.indexOf("\n") !== -1) {
					return WAITING;
				} else {
					return this;
				}
			},
			waiting: true
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
			k:"blockComment"
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
			n:"-",
			k:KIND_NAME
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
			k: "equals"
		};
		
		const ARROW = {
			k: "arrow",
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
		
		function annotationStart() {
			return {
				k: "annotationStart",
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
								{k: KIND_SET_ANNOTATION}, WAITING
							]))
						} else {
							return group([
								this.annotationTree, {k: KIND_SET_ANNOTATION}, WAITING
							])
						}
					} else {
						return this;
					}
				}
			}
		}
		
		function blockOfCode(tree, closer, reasonForWaitingText, makeTreeItemFromSentences) {
			return {
		        waiting: true,
		        k:"blockOfCode",
		        next:function(token){
		            try {
						if(isFinishedTree(tree)) {
				            if(token.textValue === closer) {
				                return makeTreeItemFromSentences(makeSentences(tree.group || [tree]));
				            }
				        }
				        //Block is not finished; continue
				        return blockOfCode(tree.next(token), closer, reasonForWaitingText, makeTreeItemFromSentences);
					} catch (error) {
						console.error(error);
						var unfinishedHint = isFinishedTree(this) ? "" : ("; The block is in an unfinished state (" + GLang.produceNestedWaitingReasons(this) + ")")
		                throw new Error("An error was thrown in the following block of code: " + JSON.stringify(this) + "; Message: " + error.message + unfinishedHint)
					}
		        },
		        tree:tree,
		        getReasonForWaiting: function(){return reasonForWaitingText}
		    }
		}
		
		var finishedCodeBlock = function(sentences) {
		    return {
		        k:KIND_CODEBLOCK,
		        c:GLang.prepareTree(sentences),
                p:[{s:"x"}, {s:"y"}], //Parameters of this codeblock are x and y (if used as a function)
		        next:function(token) {
		            if (token.textValue === "?") {
						throw new Error("Typed codeblocks are not supported anymore");
					} else if (token.category === "Space") {
						return this;
					} else {
						return new group([this, WAITING]).next(token);	
					}
		        }
		    }
		}
		function finishedArrayBlock(sentences){
			return group([{k:KIND_ARRAY, a:sentences}, WAITING]);
		}
		function finishedParentheses(sentences){
			if(sentences.length == 1){
				return group([sentences[0], WAITING])
			}
			return group([
				{
					k:KIND_PARENTHESES,
					p:sentences
				},
				WAITING
			])
		}
		
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
				k:"quoteBlock"
			}
		}
		
		const COMMENT_BLOCK = {
			next:function(token){
				if(token.textValue === "´" || token.textValue === "`") return WAITING;
				return this;
			},
			waiting: true,
			k:"commentBlock"
		}
		
		const NAME_COLON = superCommonName(KIND_COLON);
		const NAME_SEMICOLON = superCommonName(KIND_SEMICOLON);
		
		function name(wordToken){
			//If we have one of the super common names, return a special tree item
			switch(wordToken.textValue) {
				case ":": return NAME_COLON;
				case ";": return NAME_SEMICOLON;
			}
			
			return {
				next:function(token){
					return group([this, WAITING]).next(token);
				},
				n:unifyStringName(wordToken.textValue),
				k:KIND_NAME
			}
		}
		
		const DOLLAR_STRING = {
			next:function(token){
				if(token.category === "Word") return string(token.textValue)
				throw new Error("The dollar sign ($) has to be followed by a 'Word' token - but is followed by: " + token.textValue);
			},
			waiting: true,
			k:"dollarString"
		};
		
		const NEGATIVE_SIGN = {
			next:function(token){
				if(token.category === "Digit") return group([integer(-parseInt(token.textValue)), WAITING])
				throw new Error("The minus sign (\\) has to be followed by a 'Digit' token - but is followed by: " + token.textValue);
			},
			k:"negativeSign",
			waiting: true
		}
		
		function integer(intNumber){
			return {
				next:function(token){
					if(token.textValue === ",") return commaNumber(intNumber);
					return group([this, WAITING]).next(token);
				},
				num:intNumber,
				k:KIND_NUMBER
			}
		}
		
		function commaNumber(intNumber){
			return {
				next:function(token){
					if(token.category === "Digit") return group([float(intNumber, token), WAITING]);
					return error(token);
				},
				k:"commaNumber",
				waiting: true
			}
		}
		
		function float(wholeNumber, decimalToken){
			return {
				next:function(token){
					return group([this, WAITING]).next(token);
				},
				num:parseFloat(wholeNumber + "." + decimalToken.textValue),
				k:KIND_NUMBER
			}
		}
		
		//Defines any kind of string. Strings can be followed by a question mark.
		function string(jsString){
			return {
				s: jsString,
				k:KIND_STRING,
				next: function(token){
					if (token.textValue === "?") {
						return stringWithQuestionMark(this);
					} else if (token.category === "Space") {
						return this;
					} else {
						return new group([this, WAITING]).next(token);	
					}
				}
			}
		}
		
		function stringWithQuestionMark(originalTreeElement) {
			return {
				k: "stringWithQuestionMark",
				waiting: true,
				//stringValue: stringValue,
				typeTree: WAITING,
				next: function(token) {
					this.typeTree = this.typeTree.next(token);
					if(isFinishedTree(this.typeTree) && this.typeTree !== WAITING) {
						return group([
							{k:KIND_TYPED, t:this.typeTree.group ? this.typeTree.group[0] : this.typeTree, s:originalTreeElement.s},
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
					try {
		                var nextState = stateList.pop().next(token);
						if(nextState.group){
							return group(stateList.concat(nextState.group));
						}
						return group(stateList.concat([nextState]));
		            } catch (error) {
		                console.error(error);
						var unfinishedHint = isFinishedTree(this) ? "" : ("; The group is in an unfinished state (" + GLang.produceNestedWaitingReasons(this) + ")")
		                throw new Error("An error was thrown in the following tree item group: " + JSON.stringify(this) + "; Message: " + error.message + unfinishedHint)
		            }
				},
				group: stateList,
				k:"group",
				waiting: waiting
			}
		}
		
		function makeSentences(tree){
			var sentences = [];
			var sentence = [];
			for(var i = 0; i < tree.length; i++){
				if(tree[i].n == "."){
					sentences.push(finishSentenceAndCheckForExclamationMarks(sentence));
					sentence = [];
				}else sentence.push(tree[i]);
			}
			
			if(sentence.length) sentences.push(finishSentenceAndCheckForExclamationMarks(sentence));

			var newTree = [];
			for(var i = 0; i < sentences.length; i++){
				var sentence = sentences[i];
				
				newTree = newTree.concat(sentence);
				if(i < sentences.length - 1) newTree.push({dot:1});
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
				if(state[i].n === "!"){
					switch(i){
						case state.length - 2:
							var op = finishSentenceAndCheckForExclamationMarks(state.splice(i + 1, 1));
							state = state.slice(0, i).concat(
								[
									{k:KIND_DO},
									{k:KIND_COLON}
								],
								op
							);
							
							break loop;
							
						case state.length - 3:
							var op = finishSentenceAndCheckForExclamationMarks(state.splice(i + 1, 1));
							var arg = finishSentenceAndCheckForExclamationMarks(state.splice(i + 1, 1));
							state = state.slice(0, i).concat(op, {k:KIND_COLON}, arg);
							
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
						var b = finishSentenceAndCheckForExclamationMarks(slicedStateAfterOperator.splice(0, relativeArrowIndex));
						var a = {k:KIND_PARENTHESES, p:finishSentenceAndCheckForExclamationMarks(slicedStateAfterOperator.slice(1))};
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

			//Add missing colons to each of the sentences
			if(state.length !== 0 && 0 === state.length % 2){
				//Even number of elements, but not zero elements - add a colon
				state = state.splice(0,1).concat([{k:KIND_COLON}]).concat(state);
			}
			
			function simplifySingleFunctionParameterForRuntime(parameterTree) {
				switch(parameterTree.k) {
					case KIND_STRING:
					case KIND_TYPED:
						//We can re-use the parameter tree, but we have to unify the name
						parameterTree.s = unifyStringName(parameterTree.s);
						return parameterTree;
					default: throw new Error("Invalid function parameter name: " + JSON.stringify(parameterTree));
				}
			}
			
			function simplifyFunctionParametersForRuntime(parameterTree) {
				switch(parameterTree.k) {
					case KIND_PARENTHESES:
						//We have four different cases here
						switch(parameterTree.p.length) {
							case 0: //Zero-argument function
								return []; //Inner switch
							case 1: //One-argument function
								return [simplifySingleFunctionParameterForRuntime(parameterTree.p[0])]; //Inner switch
							case 3: //Potential two-argument function
								if(parameterTree.p[1].k !== KIND_SEMICOLON) {
									throw new Error("Parentheses containing two function parameter names are expected to have the following form: <parameter> <semicolon> <parameter>");
								}
								return [
									simplifySingleFunctionParameterForRuntime(parameterTree.p[0]),
									simplifySingleFunctionParameterForRuntime(parameterTree.p[2])
								]; //Inner switch
							default: //Inner switch
								throw new Error("Parentheses containing two function parameter names must contain one parameter name (string), or two, separated by a semicolon");
						}
					default: //Outer switch
						return [simplifySingleFunctionParameterForRuntime(parameterTree)]
				}
			}

			function simplifyForRuntime(state) {
				//TODO: I guess this functionality should be put into the "stringWithQuestionMark" state
				const newState = [];
				for(var i = 1; i <= state.length - 1; i+= 2) {
					//We have to make all kinds of variable declarations simpler for the runtime
					//Check for <typed> <equals> <value> and convert that into a "normal" declaration (<string> <equals> <type> <:> <value>)
					if(state[i].k === "equals") {
						//We have four cases. First case: typed variable names
						if(state[i - 1].k === KIND_TYPED) {
							//Convert that into a "normal" variable declaration with a function call in front of the value
							const typedName = state[i - 1];

							const name = unifyStringName(typedName.s);
							//Fail if the name is invalid
							if(name.match("[^a-zA-Z_]")){
								throw new Error(name + " is not a valid variable name!");
							}
							
							const type = typedName.t;
							
							//console.log(name);
							//console.log(type);
							
							var variableValueTree = [type, {k:KIND_COLON}, ...simplifyForRuntime(state.slice(i + 1))];
							newState.push({k:KIND_ASSIGN_TO_STRING, s:name, v:variableValueTree})
							
							return newState;
						}
						//Second case: untyped variable names
						else if(state[i - 1].k === KIND_STRING) {
							//Tell the runtime that we are doing a string assignment
							const name = unifyStringName(state[i - 1].s);
							//Fail if the name is invalid
							if(name.match("[^a-zA-Z_]")){
								throw new Error(name + " is not a valid variable name!");
							}

							newState.push({k:KIND_ASSIGN_TO_STRING, s:name, v:simplifyForRuntime(state.slice(i + 1))});
							return newState;
						}
						//Third case: assigning to a mutable that is referenced by a name
						else if(state[i - 1].k === KIND_NAME) {
							//Tell the runtime that we are dong a name-based mutable assignment
							newState.push({k:KIND_ASSIGN_TO_MUTABLE_NAME, n:state[i - 1].n, v:simplifyForRuntime(state.slice(i + 1))});
							return newState;
						}
						//Fourth case case: we do have something other than a string literal. So we assume that we are supposed to assign something to a mutable container, not to a string name
						else {
							//Tell the runtime that we are doing a mutable container assignment
							newState.push({k:KIND_ASSIGN_TO_MUTABLE_NONAME, m:state[i - 1], v:simplifyForRuntime(state.slice(i + 1))});
							return newState;
						}
					
					} else if(state[i].k === KIND_NAME && state[i].n === "fun") {
						//Okay, we have a function definition
						//Check that it is valid
						//Assume that we have exactly one following tree item in this sentence (the code block)
						if(state.length !== i + 2) throw new Error("Uses of 'fun' must be followed by a code block");
						if(state[i + 1].k !== KIND_CODEBLOCK) throw new Error("Function definitions need a code block as their second parameter");
						const codeblock = state[i + 1];

						const parameterList = simplifyFunctionParametersForRuntime(state[i - 1]);
						
						const newTreeItem = {k:KIND_FUNCTION_DEFINITION, c:codeblock.c, p:parameterList}
						
						//Insert this function item into the new sentence
						newState.push(newTreeItem);
						
						//We are done here - it is guaranteed that nothing follows, because of the first length check
						return newState;
					} else {
						//Nothing special to do
						newState.push(state[i - 1], state[i]);
					}
				}
				
				return state; //Return the OLD state - we do nothing
			}

			return simplifyForRuntime(state);
		}
		
		GLang.produceNestedWaitingReasons = function(item) {
			var reason =  item.getReasonForWaiting ? item.getReasonForWaiting() : "No reason given";
			if(item.tree) {
				if(!isFinishedTree(item.tree)) { reason += "; Inner block: " + GLang.produceNestedWaitingReasons(item.tree) }
			} else if (item.group) {
				if(!isFinishedTree(item.group)) { reason += "; Inner block: " + GLang.produceNestedWaitingReasons(item.group) }
			}
			return reason;
		};

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
		
		GLang.generateTree= function(string){
			var state = WAITING;
			var tokens = tokenize(string);
			
			for(var i = 0; i < tokens.length; i++){
				state = state.next(tokens[i]);
			}
			if(!isFinishedTree(state)) {
				throw new Error("Your code is not finished (" + GLang.produceNestedWaitingReasons(state) + "). Relevant syntax tree: " + JSON.stringify(state.group ? state.group[state.group.length - 1] : state));
			}
			var result = makeSentences(state.group || [state]);
			
			return result;
		}
	})();
}
