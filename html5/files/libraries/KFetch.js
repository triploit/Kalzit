(function(global){
	
	var currentAbortController = new AbortController();
	
	//Starts an unimportant fetch - can be aborted at any time and resumed later
	function unimportantFetch(request, options) {
		//Add an abort signal
		options = options || {};
		options.signal = currentAbortController.signal;
		
		return new Promise((resolve, reject) => {
			fetch(request, options)
				.then(response => resolve(response))
				.catch(error => {
					if (error.name == 'AbortError') {
						//Queue this fetch for later
						queuedUnimportantFetches.push({request, options});
					}else{
						reject(error)
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
					resolve(response);
					finishImportantFetch();
				})
				.catch(error => {
					reject(error);
					finishImportantFetch();
				})
		});
	}
	
	//Management functions to track the important and unimportant fetches
	var activeImportantFetches = 0;
	var queuedUnimportantFetches = [];
	
	function startImportantFetch(){
		//Send an abort signal
		currentAbortController.abort();
		//Update the abort controller
		currentAbortController = new AbortController();
		
		//Increase the count of important fetches
		activeImportantFetches++;
		
		//Show the loading indicator
		console.log("Making loading indicator visible");
		document.body.classList.add('k-loading_indicator_visible');
	}
	function finishImportantFetch(){
		//Decrease the count of important fetches
		activeImportantFetches--;
		
		//Check for errors
		if(activeImportantFetches < 0) console.error("Error: activeImportantFetches in KFetch is negative, indicating an implementation error: " + activeImportantFetches);
		
		//If there is no important fetch running anymore, start the queue of unimportant ones
		if(activeImportantFetches == 0) {
			//First, hide the loading indicator
			console.log("Making loading indicator invisible");
			document.body.classList.remove('k-loading_indicator_visible');
			
			while(queuedUnimportantFetches.length) {
				var fetchParameters = queuedUnimportantFetches.pop();	
				unimportantFetch(fetchParameters.request, fetchParameters.options);
			}
		}
	}
	
	global.KFetch = {
		important: importantFetch,
		unimportant: unimportantFetch	
	}
	
})(this);