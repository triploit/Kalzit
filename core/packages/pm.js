this.pmListRegisteredPackages = function(){
	return GLang.packageManager.registeredPackages;
}
this.pmListInstalledNames = function(){
	return GLang.defaultRuntimeEnvironment.innerVariables.map(function(v){return v.varName});
}
this.pmLoadPackage = GLang.packageManager.loadPackageSync;

GLang.defaultRuntimeEnvironment.setInnerVariable("pm_add_language", {value:function(env, args){
	for(var i = 0; i < GLang.packageManager.supportedLanguages.length; i++){
		if(GLang.packageManager.supportedLanguages[i].langName === (args[1].value + "")) throw new Error("The language you are trying to register already exists");
	}
	GLang.packageManager.supportedLanguages.push({langName:args[1].value + "", langRunner:function(url, x){
		GLang.callObject(args[0], env, [GLang.stringValue(url), GLang.stringValue(x)]);
	}});
	return GLang.voidValue;
}, argumentList: ["evaluator", "name"], display:"function"});