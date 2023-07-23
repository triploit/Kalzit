GLang.dr.qdSet("str_starts_with", {value:GLang.arrayFun(function(env, args){
	return {value:(args[1].value).startsWith(args[0].value) ? 1 : 0};
})});
GLang.dr.qdSet("str_ends_with", {value:GLang.arrayFun(function(env, args){
	return {value:(args[1].value).endsWith(args[0].value) ? 1 : 0};
})});
GLang.dr.qdSet("str_split", {value:GLang.arrayFun(function(env, args){
	var results = (args[1].value).split(args[0].value);
	for(var i = 0; i < results.length; i++){
		results[i] = GLang.stringValue(results[i]);
	}
	return {value:results}
})});
GLang.dr.qdSet("str_sub", {value:function(env, args){
	var from = GLang.at(0, args[0]).value;
	var to = args[1].value.length;
	if(args[0].value.length === 2){
		to = args[0].value[1].value;
	}
	return GLang.stringValue(args[1].value.substring(from, to))
}});
this.str_to_lower_case = function(string){return string.toLowerCase()};
this.str_to_upper_case = function(string){return string.toUpperCase()};
this.str_trim = function(string){return string.trim()};
