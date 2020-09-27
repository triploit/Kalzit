const getContentAsync = function(url) {
	return new Promise((resolve, reject) => {
		const lib = url.startsWith('https') ? require('follow-redirects').https : require('follow-redirects').http;
		const request = lib.get(url, {headers:{
			'User-Agent': "CalcitServersideLoadP/0.6"
		}}, (response) => {
			// handle http errors
			if (response.statusCode < 200 || response.statusCode > 299) {
				reject(new Error('Failed to load page, status code: ' + response.statusCode));
			}
			// temporary data holder
			const body = [];
			// on every content chunk, push it to the data array
			response.on('data', (chunk) => body.push(chunk));
			// we are done, resolve promise with those joined chunks
			response.on('end', () => resolve(body.join('')));
		});
		// handle connection errors of the request
		request.on('error', (err) => reject(err))
	})
};

function loadGlobalAsync(callback, url) {
	getContentAsync(url).then(
		result => callback(result)
	).catch(
		error => callback()
	)
};

function loadGlobal(url){
	try{
		return require("child_process").execSync("curl -L -A \"CalcitServersideLoadP/0.6\" \"" + url + "\"").toString("UTF8");
	}catch(e){
		return null;
	}
};

function loadGlobalRaw(url){
	try{
		return require("child_process").execSync("curl -L -A \"CalcitServersideLoadP/0.2\" \"" + url + "\"");
	}catch(e){
		return null;
	}
};

exports.loadGlobalAsync = loadGlobalAsync;
exports.loadGlobal = loadGlobal;
exports.loadGlobalRaw = loadGlobalRaw;