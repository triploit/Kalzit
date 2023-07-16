;(function(global){
	
	//Loads a js file by http (or relative) url and runs it.
	function loadPackageSync(url){
		//Automatically determine the language code
		const splitUrl = url.split(".");
		const languageCode = splitUrl[splitUrl.length - 1];
		
		//Decide which language we need to evaluate
		try {
			switch (languageCode) {
				case "k":
				case "txt":
					GLang.eval(this.loadUrl(url),true); break;
				case "js":
					this.installJs(Function(this.loadUrl(url))); break;
				case "json":
					var packageInfo = JSON.parse(this.loadUrl(url));
					if(packageInfo.requirements){
						for(var i = 0; i < packageInfo.requirements.length; i++){
							if(GLang.packageManager.registeredPackages.indexOf(packageInfo.requirements[i]) !== -1) continue;
							this.loadPackageSync(packageInfo.requirements[i]);
						}
					}
					this.register(packageInfo.libraries, url.replace("/platform-packages.json", "/packages/"));
					break;
				default: throw new Error("Unsupported language for packages: " + languageCode);
			}
		} catch (e) {
			if(GLANG_DEBUG) {
				console.error(e);
			}
			GLang.error(e);
		}
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
				return;
			}
		}
		
		//Use prefix
		if(prefix){
			packageData.scriptUrl = prefix + packageData.scriptUrl;
		}
		
		this.registeredPackages.push(packageData);
	}
	
	function validatePackageVariables(names){
		for(var name = 0; name < names.length; name++){
			if(!GLang.defaultRuntimeEnvironment.hasInnerVariable(names[name])){
				throw new Error("A package has claimed to provide the variable " + names[name] + " - but it does not");
			}
		}
	}
	
	//Searches for a package by name and loads it synchronously
	function installPackage(provides){
		if (GLANG_DEBUG) {
			console.log("Looking for name " + provides);
		}
		
		
		for(var packageIndex = 0; packageIndex < this.registeredPrecompiledPackages.length; packageIndex++){
			var packageData = this.registeredPrecompiledPackages[packageIndex];
			if(packageData[0].includes(provides)){
				//packageData[1](GLang.defaultRuntimeEnvironment);
				GLang.evaluatePreparedTree(packageData[1], GLang.defaultRuntimeEnvironment);
				
				//Check that the package provides all the variables it should
				if(GLANG_DEBUG) validatePackageVariables(packageData[0]);
				
				return true;
			}
		}
		
		for(var packageIndex = 0; packageIndex < this.registeredPackages.length; packageIndex++){
			var packageData = this.registeredPackages[packageIndex];
			for(var providedName = 0; providedName < packageData.provides.length; providedName++){
				if(packageData.provides[providedName] === provides){
					this.loadPackageSync(packageData.scriptUrl, packageData.scriptType);
					
					//Check that the package provides all the variables it should
					if(GLANG_DEBUG) validatePackageVariables(packageData.provides, packageData.scriptUrl);
					
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
		//this.hiddenRegisteredPackages = [];
		this.installedUrls = [];
		
		this.register = register;
		this.installPackage = installPackage;
		
		this.registeredPrecompiledPackages = [];
//		this.registerPrecompiledPackage = function(names, compiledCode){
//			this.registeredPrecompiledPackages.push([names, compiledCode]);
//			this.registeredPackages.push({provides: names, scriptUrl: null})
//		};
		
		//Register precompiled package tree
		this.rppt = function(names, tree) {
			this.registeredPrecompiledPackages.push([names, tree]);
			this.registeredPackages.push({provides: names, scriptUrl: null})
		}
		
		function installJs(fun){
			//Tries to make "normal" javascript work as a calcit library, but it will probably never have all options a "real" calcit JS library can have.
			var newThis = {};
			fun.call(newThis);
			for(var property in newThis){
				GLang.defaultRuntimeEnvironment.setInnerWithoutListeners(GLang.defaultRuntimeEnvironment.unifyStringName(property), GLang.wrapJsToValue(newThis[property]))
			} };
		this.installJs = installJs;
		
		this.initialize = initialize;
	}
	
})(this);
