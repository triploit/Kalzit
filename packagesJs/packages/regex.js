this.match = function(regexString, stringToMatch){
	return stringToMatch.match(regexString);
};
this.allMatches = function(regexString, stringToMatch){
	var re = new RegExp(regexString, "g");
	var s = stringToMatch;
	var m;
	
	var result = [];
	do {
	    m = re.exec(s);
	    if (m) {
	       result.push(m);
	    }
	} while (m);
	
	return result;
};
this.strReplaceRegex = function(_regexAndReplacement, original){
	return original.replace(new RegExp(_regexAndReplacement[0].value, "g"), _regexAndReplacement[1].value);
};