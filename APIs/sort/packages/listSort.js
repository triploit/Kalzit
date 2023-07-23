/* @kalzit.for list_sort
Sorts a list according to a sorting rule.
First parameter is the sorting rule, second is the list to be sorted. Returns the sorted list.

The sorting rule is a function. It ...
* ... returns 0 if the parameters are equal
* ... returns -1 (or any negative number) if x comes before y
* ... returns 1 (or any positive number) if x comes after y
*/
GLang.dr.qdSet("list_sort", {value:function(env, args) {
	var list = args[1].value.slice();
	var compareFunction = function(a,b) {return GLang.callObject(args[0], env, [a,b]).value};
	
	return {value:list.sort(compareFunction)};
}})
