this.calcitUnifyName = GLang.defaultRuntimeEnvironment.unifyStringName;

GLang.defaultRuntimeEnvironment.setInnerVariable("calcitAnnotations", {value:function(env, args){
	return {value:args[0].annotations || []};
}, display:"function"});
GLang.defaultRuntimeEnvironment.setInnerVariable("calcitAddAnnotation", {value:function(env, args){
	GLang.addAnnotation(args[1], args[0]);
	return args[1];
}, display:"function"});
GLang.defaultRuntimeEnvironment.setInnerVariable("calcitAddComment", {value:function(env, args){
	GLang.addAnnotation(args[1], {value:[
		GLang.stringValue("comment"),
		args[0]
	]});
	return args[1];
}, display:"function"});
GLang.defaultRuntimeEnvironment.setInnerVariable("calcitSetType", {value:function(env, args){
	GLang.addAnnotation(args[1], {value:[
		GLang.stringValue("type"),
		args[0]
	]});
	return args[1];
}, display:"function"});