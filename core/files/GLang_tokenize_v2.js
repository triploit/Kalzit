//The default function to get tokens from code
GLang.tokenize = function(text){
	return GLang.categorize(text, [
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