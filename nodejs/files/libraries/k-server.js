var http = require("http");
var Buffer = require("buffer").Buffer;
var https = require('https');
var fs = require('fs');
var path = require('path');

var WriteHelper = require("./k-server/writeHelper").WriteHelper;

function getRequestValue(req, res) {
	var writeHelper = new WriteHelper(res, req);
	//writeHelper.setWantsRange(req.headers.range ? true : false);

	return {
		method: req.method,
		endServing(responseText, encoding){
			writeHelper.end(responseText, encoding);
		},
		write(text, encoding){
			var encoding = writeHelper.getEncoding(encoding);
			writeHelper.write(Buffer.from(text, encoding), encoding);
		},
		writeFile(filePath){
			writeHelper.writeFile(filePath);
		},
		writeEncryptedFile(config){
			writeHelper.writeFile(config.input, config /*for decryption*/);
		},
		writeBytes(numberArray, encoding){
			writeHelper.write(Buffer.from(numberArray), encoding);
		},
		writeRaw(buffer, encoding){
			writeHelper.write(buffer, encoding);
		},
		startServing(mime){
			writeHelper.start(mime);
		},
		respondCode(responseCode){
			writeHelper.writeHead(responseCode, {});
		},
		setEncoding(encoding){
			writeHelper.getEncoding(encoding);
		},
		cookie: req.headers.cookie,
		getHeader(headerName){
			return req.headers[headerName];
		},
		setHeader(headerName, headerValue){
			res.setHeader(headerName, headerValue);
		},
		url: req.url,
		host: req.headers.host,
		getPostDataStringAsync(callback, sizeLimit){
			//Parameters
			var sizeLimit = sizeLimit ? parseInt(sizeLimit) : 1e9; 
			
			//Data handling
			var requestBody = '';
			var errorHappened = false;
			
			req.on('data', function(data) {
				if (errorHappened) return;
				
				requestBody += data;
				if(requestBody.length > sizeLimit) {
					//Use the callback without a result (upload size too large)
					callback();
					errorHappened = true;
				}
			});
			req.on('end', function() {
				if (errorHappened) return;
				
				//Use the callback with the final result
				callback(requestBody);
			});
		},
		getPostDataByteSizeEstimate(){
			return parseInt(req.headers['content-length'] || "0");
		},
		getPostDataFileAsync(config){
			var doNothing = function(){};
			
			//Callbacks
			var onPreparation = config.onPreparation || doNothing;
			var onSuccess = config.onSuccess || doNothing;
			var onError = config.onError || doNothing;
			
			//Figure out how long the posted file is before accepting it
			var contentLength = parseInt(req.headers['content-length'] || "0");
			onPreparation(contentLength);
			
			//File is in the accepted size range - store it somewhere
			
			//This is the temporary file where we store the download - will be passed to the callback later
			var tempFileName = require("os").homedir + "/.kalzit/generated/ul_" + Date.now();
			//We need to ensure that the file does not exist yet - otherwise, another upload might break
			try{
				while(fs.lstatSync(fs.realpathSync(tempFileName)).isFile()) {
					tempFileName = require("os").homedir + "/.kalzit/generated/ul_" + Date.now();
				}
			}catch(e){}
			
			//Write the POST data to a temporary file
			//We need access to the file stream later to handle any kind of error, so we have to store it as a variable
			var fileStream = fs.createWriteStream(tempFileName);
			
			//Since fileStream is a stream, we can pipe it
			req.pipe(fileStream);
			
			//If anything goes wrong
			fileStream.on('error', function (err) {
				console.log(err.stack);
				//Error happened - callback gets "void" as the parameter
				onError();
			});
			
			//Use "finish" event (not "end" of request) because that ensures that all data has been written to the file
			//Prevents strange behavior were the file is incomplete
			fileStream.on('finish', function() {
				onSuccess(tempFileName)
			});
		}
	};
};

exports.httpServer = function httpServer(callback, port){
	var server = http.createServer(function (req, res) {
		callback( getRequestValue(req, res) );
	}).listen(port);
};

exports.httpsServer = function httpsServer(callback, port){
	var options = {
		key: fs.readFileSync('./nogit/https/key.pem'),
		cert: fs.readFileSync('./nogit/https/cert.pem')
	};
	
	https.createServer(options, function (req, res) {
		callback( getRequestValue(req, res) );
	}).listen(port);
};

exports.customHttpsServer = function customHttpsServer(config) {
	var options = {
		key: fs.readFileSync(config.keyFile),
		cert: fs.readFileSync(config.certificateFile)
	};
	
	https.createServer(options, function (req, res) {
		config.callback( getRequestValue(req, res) );
	}).listen(config.port);
}