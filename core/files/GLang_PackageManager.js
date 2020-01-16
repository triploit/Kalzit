;(function(global){
	
	//Loads a js file by http (or relative) url and runs it.
	function loadPackageSync(jsUrl){
		//Automatically determine the language code
		var splitUrl = jsUrl.split(".");
		var languageCode = splitUrl[splitUrl.length - 1];
		
		// evaluate the code in the correct language
		for(var i = 0; i < this.supportedLanguages.length; i++){
			var language = this.supportedLanguages[i];
			if(language.langName === languageCode){
				this.installedUrls.push(jsUrl);
				try{
					var result = language.langRunner(jsUrl, this.loadUrl(jsUrl));
					return true;
				}catch(e){
					GLang.error(e);
					return false;
				}
			}
		}
		GLang.error("Unsupported language for packages: " + languageCode);
	}
	
	//Registers a package if it is not registered already.
	function register(packageData, prefix){
		if(packageData instanceof Array){
			for(var entry = 0; entry < packageData.length; entry++){
				this.register(packageData[entry], prefix);
			}
			return;
		}
		for(var i = 0; i < this.registeredPackages.length; i++){
			var alreadyRegistered = this.registeredPackages[i];
			if(alreadyRegistered.provides === packageData.provides){
				GLang.error("The name " + alreadyRegistered.provides + " is already provided by " + alreadyRegistered);
			}
		}
		
		//Use prefix
		if(prefix){
			packageData.scriptUrl = prefix + packageData.scriptUrl;
		}
		
		this.registeredPackages.push(packageData);
	}
	
	function freezePackageVariables(names, sourceUrl){
		for(var name = 0; name < names.length; name++){
			if(!GLang.defaultRuntimeEnvironment.hasInnerVariable(names[name])){
				throw new Error("A package has claimed to provide the variable " + names[name] + " - but it does not");
			}
			
			//Automatically add package information to values
			var variableValue = GLang.defaultRuntimeEnvironment.resolveName(names[name], GLang.defaultRuntimeEnvironment)
			GLang.addAnnotation(variableValue, {value:[
				GLang.stringValue("sourceUrl"),
				GLang.stringValue(sourceUrl)
			]});
			GLang.defaultRuntimeEnvironment.setInnerVariable(names[name], variableValue, true);
			
			if(!GLang.getFirstAnnotation(variableValue, GLang.stringValue("nofreeze"))){
				GLang.defaultRuntimeEnvironment.freezeInnerVariable(names[name]);
			}
		}
	}
	
	//Searches for a package by name and loads it synchronously
	function installPackage(provides){
		GLang.log("Looking for name " + provides)
		
		
		for(var packageIndex = 0; packageIndex < this.registeredPrecompiledPackages.length; packageIndex++){
			var packageData = this.registeredPrecompiledPackages[packageIndex];
			if(packageData[0].includes(provides)){
				GLang.evaluateTree(packageData[1], GLang.defaultRuntimeEnvironment);
				
				//Freeze the package variables
				freezePackageVariables(packageData[0], null /*TODO*/);
				
				return true;
			}
		}
		
		for(var packageIndex = 0; packageIndex < this.registeredPackages.length; packageIndex++){
			var packageData = this.registeredPackages[packageIndex];
			for(var providedName = 0; providedName < packageData.provides.length; providedName++){
				if(packageData.provides[providedName] === provides){
					this.loadPackageSync(packageData.scriptUrl, packageData.scriptType);
					
					//Freeze the package variables
					freezePackageVariables(packageData.provides, packageData.scriptUrl);
					
					return true;
				}
			}
		}
		
		
		return false;
	}
	
	function initialize(startPackages){
		for(var i = 0; i < startPackages.length; i++){
			this.loadPackageSync(startPackages[i]);
		}
	};
	
	//A package manager implementation for the browser
	GLang.PackageManager = function (){
		this.loadPackageSync = loadPackageSync;
		this.registeredPackages = [];
		this.hiddenRegisteredPackages = [];
		this.installedUrls = [];
		
		this.register = register;
		this.installPackage = installPackage;
		
		this.registeredPrecompiledPackages = [];
		this.registerPrecompiledPackage = function(names, compiledCode){
			this.registeredPrecompiledPackages.push([names, compiledCode]);
			this.registeredPackages.push({provides: names, scriptUrl: null})
		};
		
		this.supportedLanguages = [
			{langName:"js", langRunner:function(url, code){
				//Tries to make "normal" javascript work as a calcit library, but it will probably never have all options a "real" calcit JS library can have.
				var newThis = {};
				Function(code).call(newThis);
				for(property in newThis){
					GLang.defaultRuntimeEnvironment.setInnerVariable(GLang.defaultRuntimeEnvironment.unifyStringName(property), GLang.wrapJsToValue(newThis[property]))
				}
			}},
			{langName:"z", langRunner:function(url, x){GLang.eval(x,true)}},
			{langName:"txt", langRunner:function(url, x){GLang.eval(x,true)}},
			{langName:"json", langRunner:function(url, x){
				var packageInfo = eval("(" + x + ")");
				if(packageInfo.requirements){
					for(var i = 0; i < packageInfo.requirements.length; i++){
						if(GLang.packageManager.registeredPackages.indexOf(packageInfo.requirements[i]) !== -1) continue;
						GLang.packageManager.loadPackageSync(packageInfo.requirements[i]);
					}
				}
				GLang.packageManager.register(packageInfo.libraries, url.replace("/platform-packages.json", "/packages/"));
			}},
			{langName:"k", langRunner:function(url, x){GLang.eval(x,true)}}
		];
		
		this.initialize = initialize;
	}
	
})(this);