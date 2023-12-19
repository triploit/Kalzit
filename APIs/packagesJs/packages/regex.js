/* @kalzit.for match
Checks if a string (second parameter) maches a regular expression (first parameter).
If it does, the first match is returned as an array of one element. In case the regular expression contains groups, their contents is added to the array.
In case nothing matches, void is returned.

Usage example:
	```
	$firstDigit = "\d" match "abc5".
	$withGroups = "a+(b+)" match "aabb". `Result is "aabb";"bb"`
	```
*/
this.match = function(regexString, stringToMatch){
	return stringToMatch.match(regexString);
};
this.all_matches = function(regexString, stringToMatch){
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

GLang.dr.qdSet("str_replace_regex", {value:function(env, args){
    const _regexAndReplacement = args[0].value;
    return GLang.stringValue(
        args[1].value.replace(new RegExp(_regexAndReplacement[0].value, "g"), _regexAndReplacement[1].value)
    )
}});

/*
this.str_replace_regex = function(_regexAndReplacement, original){
	return original.replace(new RegExp(_regexAndReplacement[0].value, "g"), _regexAndReplacement[1].value);
};
*/
