GLang.dr.qdSet("listen", {value:GLang.arrayFunction(2, function(args){
	var mutable = args[0];
	if(mutable.display !== DISPLAY_MUTABLE){throw new Error("'listen' needs a mutable value as the first parameter")}
	
	mutable.value.listeners.push(args[1]);
	
	return GLang.voidValue;
}), display:DISPLAY_FUNCTION});
