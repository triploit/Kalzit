;(function(global){
	var fs = require("fs");
	GLang.flagQueue = [];

	var redFormat = '\x1b[1m\x1b[31m%s\x1b[0m';

	GLang.error = function(str){
		console.error(redFormat, str);
	};
	GLang.print = console.log;

	//Initialize package manager - get the initial packages from nodejs/usable-libraries.json
	GLang.pm = new GLang.NodePackageManager();

	const registeredPackages = GLang.pm.registeredPackages;
	//Registers a package if it is not registered already.
	function registerPackage(packageData, prefix){
		if(packageData instanceof Array){
			for(var entry = 0; entry < packageData.length; entry++){
				registerPackage(packageData[entry], prefix);
			}
			return;
		}
		for(var i = 0; i < registeredPackages.length; i++){
			var alreadyRegistered = registeredPackages[i];
			if(alreadyRegistered.provides === packageData.provides){
				GLang.error("The name " + alreadyRegistered.provides + " is already provided by " + alreadyRegistered);
				return;
			}
		}
		
		//Use prefix
		if(prefix){
			packageData.scriptUrl = prefix + packageData.scriptUrl;
		}
		
		registeredPackages.push(packageData);
	}

    var packageList;
    try {
		//JSON.parse will return an array of folder names ...
		packageList = JSON.parse(fs.readFileSync("./nodejs/usable-libraries.json"))
		//... but we need the "platform-packages.json" files within these folders, so we change the paths
		.map(folderName => folderName + "/platform-packages.json")    
    } catch (error) {
		console.error(error);
        throw new Error("Package manager init failed!");
    }

	//Initialize the package manager
	for(var packageIndex = 0; packageIndex < packageList.length; packageIndex++) {
		var url = packageList[packageIndex];
		var packageInfo = JSON.parse(GLang.pm.loadUrl(url));
		if(packageInfo.requirements){
			for(var i = 0; i < packageInfo.requirements.length; i++){
				//if(GLang.pm.registeredPackages.indexOf(packageInfo.requirements[i]) !== -1) continue;
				GLang.pm.loadPackageSync(packageInfo.requirements[i]);
			}
		}
		registerPackage(packageInfo.libraries, url.replace("/platform-packages.json", "/packages/"));
	}
	
})(this);
