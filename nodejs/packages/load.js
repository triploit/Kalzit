;(function(){
	const getContentAsync = function(url) {
		return new Promise((resolve, reject) => {
			const lib = url.startsWith('https') ? require('follow-redirects').https : require('follow-redirects').http;
			const request = lib.get(url, {headers:{
				'User-Agent': "CalcitServersideLoadP/0.2"
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
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("loadGlobalAsync", {value:GLang.arrayFun(function(env, args){
		function callback(value){
			GLang.callObject(args[0], env, [value]);
		}
		getContentAsync(args[1].value).then(
			result => callback(GLang.stringValue(result))
		).catch(
			error => callback(GLang.voidValue)
		)
		
		return GLang.voidValue;
	})});
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("loadGlobal", {value:GLang.arrayFun(function(env, args){
		var url = args[0].value + "";
		try{
			return GLang.stringValue(require("child_process").execSync("curl -L -A \"CalcitServersideLoadP/0.2\" \"" + url + "\"").toString("UTF8"));
		}catch(e){
			return GLang.voidValue;
		}
	})});
	
})();