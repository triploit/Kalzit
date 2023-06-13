(function(global){
	
	//Helper function
	function removeFromArray(array, item) {
		array.splice(array.indexOf(item), 1);	
	}
	
	var currentAbortController = new AbortController();
// 	var unimportantFetchesThatDidNotFinish = [];
	
	//Starts an unimportant fetch - can be aborted at any time and resumed later
	function unimportantFetch(request, options, resolveFunction, rejectFunction) {
		//First thing: if other important fetches are running, do not immediately start this unimportant one; queue it instead.
		if(activeImportantFetches.length) {
			queuedUnimportantFetches.push({request, options, resolve: resolveFunction, reject: rejectFunction});
			return;
		}
		
		//If we are here, that means we should start an unimportant fetch right now.
		
		//Add an abort signal
		options = options || {};
		options.signal = currentAbortController.signal;
		
// 		//Add a representation of this request to the unfinished fetches list (so we know what to retry if something stupid goes wrong)
// 		var requestObject = {request, options, resolve: resolveFunction, reject: rejectFunction};
// 		unimportantFetchesThatDidNotFinish.push(requestObject);
		
		return new Promise((resolve, reject) => {
			var actualResolveFunction = resolveFunction || resolve;
			var actualRejectFunction = rejectFunction || reject;
			
			fetch(request, options)
				.then(response => {
// 					//First thing: mark this specific fetch as finished.
// 					removeFromArray(unimportantFetchesThatDidNotFinish, requestObject);
					
					//Resolve
					actualResolveFunction(response)
					if(actualResolveFunction !== resolve) {
						resolve(response);
					}
				})
				.catch(error => {
// 					//First thing: mark this specific fetch as finished.
// 					removeFromArray(unimportantFetchesThatDidNotFinish, requestObject);
					
					if (error.name == 'AbortError') {
						if(GLANG_DEBUG) console.warn("Unimported fetch was interrupted; should be restarted soon");
						//Queue this fetch for later; the "real" resolve function will not be called until later
						queuedUnimportantFetches.push({request, options, resolve: actualResolveFunction, reject: actualRejectFunction});
					}else{
						actualRejectFunction(error);
					}
					
					//Call the (unneeded) reject function of this promise
					if(actualRejectFunction !== reject) {
						reject(error);
					}
				})
		})
	}
	
	//Starts an important fetch - is run at the next possible time, can not be aborted. Trumps unimportant fetches.
	function importantFetch(request, options) {
		//Return a promise based on a fetch(), but when it ends, check if unimportant fetches are pending
		return new Promise((resolve, reject) => {
			startImportantFetch();
			
			fetch(request, options)
				.then(response => {
					finishImportantFetch();
					resolve(response);
				})
				.catch(error => {
					finishImportantFetch();
					reject(error);
				})
		});
	}
	
	//Management functions to track the important and unimportant fetches
	var activeImportantFetches = 0;
	var queuedUnimportantFetches = [];
	
	function startImportantFetch(){
// 		//This first part, together with the one after cancellation, handles the cancellation of all the unimportant fetches
// 		//Save a list of things that we expect to not be running after cancellation
// 		var currentlyUnfinishedFetches = [...unimportantFetchesThatDidNotFinish];
		
		//Send an abort signal
		currentAbortController.abort();
		//Update the abort controller
		currentAbortController = new AbortController();
		
// 		//Now, all the previously running unimportant fetches should, in theory, be cancelled - so after a few seconds, they should not be running anymore
// 		//But since something could mess up somewhere in between, we have to check if the previously unfinished fetches are ACTUALLY finished now.
// 		//If they are not, we re-attempt them after a few seconds.
// 		setTimeout(() => {
// 			//Check which of the fetches in the "currentlyUnfinishedFetches" list (the copy) is still in "unimportantFetchesThatDidNotFinish"
// 			for(f in currentlyUnfinishedFetches) {
// 				if(unimportantFetchesThatDidNotFinish.includes(f)) {
// 					//Okay, this specific request f seems to be messed up somehow. It has not properly cancelled - its .catch call was not reached.
// 					//So we have to re-attempt it.
// 					removeFromArray(unimportantFetchesThatDidNotFinish, f);
// 					//Since the returned promise will always call the passed resolve and reject functions (from f), we can just call .then and .catch with empty functions.
// 					//This should prevent console error messages.
// 					unimportantFetch(f.request, f.options, f.resolve || null, f.reject || null)
// 						.then(result => {})
// 						.catch(error => {});
// 				}
// 			}
// 			
// 			//Log that this has happened sucessfully
// 			console.log("Checking for fetches where abort() has failed finished successfully.");
// 		}, 10 * 1000)
		
		//Increase the count of important fetches
		activeImportantFetches++;
		
		//Show the loading indicator
		if(GLANG_DEBUG) console.log("Making loading indicator visible");
		document.body.classList.add('k-loading_indicator_visible');
	}
	function finishImportantFetch(){
		//Decrease the count of important fetches
		activeImportantFetches--;
		
		//Check for errors
		if(GLANG_DEBUG && activeImportantFetches < 0) console.error("Error: activeImportantFetches in KFetch is negative, indicating an implementation error: " + activeImportantFetches);
		
		//If there is no important fetch running anymore, start the queue of unimportant ones
		if(activeImportantFetches == 0) {
			//First, hide the loading indicator
			if(GLANG_DEBUG) console.log("Making loading indicator invisible");
			document.body.classList.remove('k-loading_indicator_visible');
			
			while(queuedUnimportantFetches.length) {
				var fetchParameters = queuedUnimportantFetches.pop();	
				unimportantFetch(fetchParameters.request, fetchParameters.options, fetchParameters.resolve || null, fetchParameters.reject || null)
					.then(result => {})
					.catch(error => {});
			}
		}
	}
	
	global.KFetch = {
		important: importantFetch,
		unimportant: unimportantFetch	
	}
	
// 	setInterval(() => {
// 		console.log("Length of unimportantFetchesThatDidNotFinish: " + unimportantFetchesThatDidNotFinish.length);
// 		console.log("Length of queuedUnimportantFetches: " + queuedUnimportantFetches.length);
// 	}, 5000);
	
})(this);
