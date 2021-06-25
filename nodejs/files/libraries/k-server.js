var http = require("http");
var Buffer = require("buffer").Buffer;
var https = require('https');
var fs = require('fs');
var path = require('path');

var writeHelper = require("./k-server/writeHelper");

function getRequestValue(req, res) {
	writeHelper.setHeadWritten(false);
	writeHelper.setWantsRange(req.headers.range ? true : false);

	return {
		method: req.method,
		endServing(responseText, encoding){
			writeHelper.end(responseText, encoding, res);
		},
		write(text, encoding){
			var encoding = writeHelper.getEncoding(encoding);
			writeHelper.write(Buffer.from(text, encoding), encoding, res);
		},
		writeFile(filePath){
			writeHelper.writeFile(filePath, res, req);
		},
		writeBytes(numberArray, encoding){
			writeHelper.write(Buffer.from(numberArray), encoding);
		},
		writeRaw(buffer, encoding){
			writeHelper.write(buffer, encoding, res);
		},
		startServing(mime){
			writeHelper.start(mime, res, req);
		},
		respondCode(responseCode){
			res.writeHead(responseCode, {});
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
			//Idea from https://stackoverflow.com/questions/15427220/how-to-handle-post-request-in-node-js
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
		getPostDataFileAsync(callback, sizeLimit){
			//Parameters
			var sizeLimit = sizeLimit ? parseInt(sizeLimit) : 1e9; 
			
			//Figure out how long the posted file is before accepting it
			var contentLength = parseInt(req.headers['content-length'] || "0");
			if(contentLength > sizeLimit) {
				//The file is larger than the size limit!
				console.log(new Error("The file is too large!").stack);
				callback();
				return;
			}
			
			//File is in the accepted size range - store it somewhere
			//Idea from https://nodejs.org/en/knowledge/advanced/streams/how-to-use-fs-create-write-stream/
			
			//This is the temporary file where we store the download - will be passed to the callback later
			var tempFileName = "./generated/ul_" + Date.now();
			var fileStream = fs.createWriteStream(tempFileName);
			
			// This pipes the POST data to the file
			req.pipe(fileStream);
			
			// This is here in case any errors occur - not really handled well yet
			fileStream.on('error', function (err) {
				console.log(err.stack);
				//Error happened - callback gets "void" as the parameter
				callback();
			});
			req.on('end', function() {
				callback(tempFileName)
			});
		}
	};
};

exports.httpServer = function httpServer(callback, port){
	http.createServer(function (req, res) {
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
