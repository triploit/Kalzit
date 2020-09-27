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
			
			var buffers = [];
			var contentLength = 0;
			
			//Data handling
			//Idea from https://stackoverflow.com/questions/15427220/how-to-handle-post-request-in-node-js
			var requestBody = '';
			var errorHappened = false;
			
			req.on('data', function(buffer) {
				if (errorHappened) return;
				
				buffers.push(buffer);
				contentLength += buffer.length;
				
				if(contentLength > sizeLimit) {
					//Use the callback without a result (upload size too large)
					callback();
					errorHappened = true;
				}
			});
			req.on('end', function() {
				if (errorHappened) return;
				
				//Create a file with the content in it
				//Idea from https://stackoverflow.com/questions/12868089/nodejs-write-binary-buffer-into-a-file and https://www.w3schools.com/nodejs/met_buffer_concat.asp
				var fileName = "./generated/ul_" + Date.now();
				fs.writeFile(fileName, Buffer.concat(buffers),  "binary", function(err) {
				    if(err) {
				       //Error happened - callback gets "void" as the parameter
				     	callback();
				    } else {
				        //All fine - callback gets the file name as the parameter
				        callback(fileName);
				    }
				});
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
