GLang.launchTree = function(preparedTree) {
    "use strict";
	//Timeout
	var timeoutSince = parseInt(GLang.eval("storageLoadString: 'kalzit.timeoutSince'").value);
	var timeoutActive = false;
	var timeoutMinutes = parseInt(GLang.eval("storageLoadString: 'kalzit.timeoutMinutes'").value);
	
	if (timeoutSince) {
		//Timeout is set - check what to do now
		var diff = Date.now() - timeoutSince;
		if(diff < 1000 * 60 * 20) {
			//Twenty minutes are not up yet - do not allow using the app
			timeoutActive = true;
			GLang.eval("'kalzit.timeoutMinutes' storageSaveString 0");
		} else {
			//Timeout is over - reset minute count (allows 30 minutes of usage)
			Timeout.startTimer(timeoutMinutes);
		}
	} else {
		Timeout.startTimer(timeoutMinutes);
	}
	
	if (!timeoutActive){
		try {
			GLang.evaluatePreparedTree(preparedTree, GLang.appEnvironment = GLang.RuntimeEnvironment(GLang.dr));
		} catch (error) {
			console.warn("Your app code crashed: ");
			console.log(error);
			console.log("---")
		}
		if(GLANG_DEBUG) {
			console.warn("Your app code should be running now!");
			//Start auto-refresh
			GLang.eval("!debugAutoRefresh");
		}
	} else GLang.eval("{} showMessageAsync 'Your app timeout is currently active - you can use the Kalzit apps again in 20 minutes (or less)'")
};
