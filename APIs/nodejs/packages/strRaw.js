GLang.dr.qdSet("str_raw", {value:GLang.arrayFun(function(args){
	return {value:require("buffer").Buffer.from(args[0].value)};
})});
