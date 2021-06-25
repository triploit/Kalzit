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
		error => {console.log(e.stack); callback()}
	)
};

function loadGlobal(url){
	try{
		var result = require("child_process").execSync("curl -L -sS -A \"CalcitServersideLoadP/0.10\" \"" + url + "\"").toString("UTF8");
		return {text: result, ok: true}
	}catch(e){
		console.log(e.stack);
		return {error: e.message, ok: false};
	}
};

function loadGlobalRaw(url){
	try{
		return require("child_process").execSync("curl -L -sS -A \"CalcitServersideLoadP/0.10\" \"" + url + "\"");
	}catch(e){
		console.log(e.stack);
		return null;
	}
};

exports.loadGlobalAsync = loadGlobalAsync;
exports.loadGlobalWithStatus = loadGlobal;
exports.loadGlobal = function(url){return loadGlobal(url).text};
exports.loadGlobalRaw = loadGlobalRaw;