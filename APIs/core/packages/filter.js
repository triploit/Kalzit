GLang.dr.qdSet("filter", {value:function(env, args){
	if(undefined == args[1].value.filter) return GLang.voidValue; //If we can not filter anything, return an empty list.
	
	return {value:args[1].value.filter(
		entry => GLang.call(args[0], [entry]).value
	)}
}});
