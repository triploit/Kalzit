//The default function to get tokens from code
GLang.tokenize = function(text){
	var currentRow = 0;
	var currentColumn = 0;
	
	return GLang.categorize(text, [
		["Word",function(n){return n.match("[a-zA-Z_]")}],
		["Digit",function(n){return n.match("\\d")}],
		["Space",function(n){return n.match("\\s")}]
	]).map(
		function(tokenArray){
			var tokenObject = {textValue:tokenArray[1].join(""), category:tokenArray[0]};
			var rows = tokenObject.textValue.split("\n");
			
			currentColumn = rows.length > 1 ? rows[rows.length - 1].length : currentColumn + tokenObject.textValue.length;
			currentRow += (rows.length - 1);
			
			return tokenObject;
		}
	);
};