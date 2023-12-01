/* @kalzit.for first_condition_match
Takes a list of items and returns the first item which matches a set condition. This is done as quickly as possible.
If there is no match, void is returned.

Usage example:
```kalzit
`Returns 2, the first even number in the list`
{x mod 2} firstConditionMatch 1;2;3.
```

That has essentially the same effect as this, but is potentially much faster:
```kalzit
first: {x mod 2} filter 1;2;3.
```
*/
GLang.dr.qdSet("first_condition_match", {value:function(env, args){
	var array = args[1].value;
    if(GLANG_DEBUG && !Array.isArray(array)) {
        console.log(array);
        throw new Error("firstConditionMatch needs an array as its second parameter");
    }
	if(0 === array.length) return GLang.voidValue; //If we can not match anything, return an empty list.
	var condition = args[0];
	
	for(var i = 0; i < array.length; i++) {
		if( GLang.callObject(args[0], env, [array[i]]).value ){
			//Found a match - return and quit
			return array[i];
		}
	}
	
	//No match found - return void
	return GLang.voidValue;
}});
