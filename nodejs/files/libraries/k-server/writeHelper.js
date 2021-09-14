var fs = require('fs');

var lastUsedEncoding = "utf8";
var headWritten = false;
var mimeType = "*";
var wantsRange = false;

var streamTransform = require("../StreamSectionTransform");
var aesSeek = require("../AesSeek");
var crypto = require('crypto');

function getEncoding(encoding){
	return encoding ? (lastUsedEncoding = encoding) : lastUsedEncoding
}

function write(buffer, encoding, res, req){
	if(wantsRange && !headWritten){
		//Write head and chunk data - base code from https://stackoverflow.com/questions/37866895/using-nodejs-to-serve-an-mp4-video-file#37867816
		var range = req.headers.range;
		var parts = range.replace(/bytes=/, "").split("-");
		var partialstart = parts[0];
		var partialend = parts[1];
		var total = buffer.byteLength;
		var start = parseInt(partialstart, 10);
		var end = partialend ? parseInt(partialend, 10) : total - 1;
		var chunksize = (end - start) + 1;
		res.writeHead(206, {
			'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': mimeType
		});
		headWritten = true;
		
		//Convert buffer to stream and pipe to result - base code from https://stackoverflow.com/questions/13230487/converting-a-buffer-into-a-readablestream-in-node-js
		const readable = new (require("stream").Readable)()
		readable._read = () => {} // _read is required but you can noop it
		readable.push(buffer.subarray(start))
		readable.push(null)
		
		res.willEnd = true;
		readable.pipe(res) // consume the stream
		res.on('close', function() {
			if (res.fileStream) {
				res.fileStream.unpipe(this);
				if (this.fileStream.fd) {
					fs.close(this.fileStream.fd);
				}
			}
			res.end();
		});
	}else{
		if(!res.finished) {
        	res.end(buffer)
        }else{
        	console.log("Data is supposed to be written, but 'end was already called'");	
        }
	}
	
}

function writeFileChunk(filePath, stats, res, req, decryptConfig){
    //Write head and chunk data - base code from https://stackoverflow.com/questions/37866895/using-nodejs-to-serve-an-mp4-video-file#37867816
    var range = req.headers.range;
    console.log("Requested range is " + range);
    var parts = range.replace(/bytes=/, "").split("-");
    var partialstart = parts[0];
    var partialend = parts[1];
    var total = stats.size;
    var start = parseInt(partialstart, 10);
    var end = partialend ? parseInt(partialend, 10) : total - 1;
    var chunksize = (end - start) + 1;

	var headers = {
		'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
		'Accept-Ranges': 'bytes',
		'Content-Length': chunksize,
		'Content-Type': mimeType
	};
	
	res.writeHead(206, headers);
    headWritten = true;

	res.willEnd = true;
	
	//Generate the stream to serve
    var fileSystemAccess = decryptConfig ? aesSeek : fs;
    var readOptions = {
    	start: start,
		end: end
    };
    if (decryptConfig) {
        readOptions.initVector = decryptConfig.initVector,
        readOptions.key = decryptConfig.key
    }
    var servedStream = fileSystemAccess.createReadStream(filePath, readOptions);
    
    servedStream.pipe(res);
    res.on('close', function() {
        servedStream.unpipe(this);
        console.log("Ending chunked response for " + filePath);
        res.end();
    });
    
    res.on("error", function(error) {
    	console.log(error);
    })
}

function writeFileSaveRam(filePath, res, decryptConfig) {
	var readStream = fs.createReadStream(filePath);
    if (decryptConfig) {
        readStream = readStream.pipe(
            crypto.createDecipheriv('aes-256-ctr', decryptConfig.key, decryptConfig.initVector)
        );
    }
    readStream.pipe(res);

    res.willEnd = true;
    res.on('close', function() {
        if (res.fileStream) {
            res.fileStream.unpipe(this);
            if (this.fileStream.fd) {
                fs.close(this.fileStream.fd);
            }
        }
        console.log("Ending full response for " + filePath);
        res.end();
    });
}


function writeFile(filePath, res, req, decryptConfig){
	if(fs.existsSync(filePath)){
        var stats = fs.statSync(filePath);
        if(!headWritten){
            if(wantsRange){
            	console.log(filePath + ": Head not written - serving requested file chunk. File size is " + stats.size + " bytes");
                writeFileChunk(filePath, stats, res, req, decryptConfig);
            }else{
                console.log("This should be quick");
                console.log(filePath + ": Head not written - using fs.createReadStream and pipe(res) to serve file content. File size is " + stats.size + " bytes");
                //Idea from https://github.com/daspinola/video-stream-sample/blob/master/server.js
                res.writeHead(200, {
                    'Content-Length': stats.size,
                    'Content-Type': mimeType
                });
                headWritten = true;
                
                writeFileSaveRam(filePath, res, decryptConfig);
            }
        }else{
			console.log(filePath + ": Head already written - using writeFileSaveRam (fs.createReadStream). File size is " + stats.size + " bytes");
			writeFileSaveRam(filePath, res, decryptConfig);
        }
    }else{
        res.writeHead(404, {});
    }
}

function start(mime, res, req){
	if(wantsRange = req.headers.range){
		mimeType = mime + "";
	}else if(!headWritten){
		res.writeHead(200, {"Content-Type": mime + ""});
		headWritten = true;
	}
}

function end(responseText, encoding, res){
	//For debug purposes, do nothing
	//console.log("writeHelper.js end() is called - nothing will be done");
	//return;
	
	if(res.willEnd){
		//Do nothing - stream might still be written	
		return responseText;
	}else{
		if(responseText != null) {
			res.end(responseText + "", getEncoding(encoding));
		} else {
			res.end();
		}
	}
}

exports.getEncoding = getEncoding;
exports.write = write;
exports.writeFile = writeFile;
exports.setHeadWritten = function(written){headWritten = written;};
exports.setWantsRange = function(wants){wantsRange = wants;};
exports.end = end;
exports.start = start;
