;GLang.functionFromString = function(string, defaultEnv){
	var result = {value:{
		environment:defaultEnv,
		codeString:string
	}}
	GLang.addAnnotation(result, {value:[
		GLang.stringValue("argumentList"),
		{value:[{value:"x"}, {value:"y"}]}
	]});
	return result;
};