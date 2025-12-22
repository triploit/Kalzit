GLang.dr.qdSet("str_raw", {value:GLang.arrayFunction(1, function(args){
	return {value:require("buffer").Buffer.from(args[0].value)};
})});
