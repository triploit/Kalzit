GLang.array = function(arg){
	if(!(arg instanceof Array)){
		return [arg];
	}
	return arg;
}