var fs = require('fs');

var lastUsedEncoding = "utf8";
var headWritten = false;
var mimeType = "*";
var wantsRange = false;

function getEncoding(encoding){
	return encoding ? (lastUsedEncoding = encoding) : lastUsedEncoding
}

function write(buffer, encoding, res){
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
		
		readable.pipe(res) // consume the stream
		res.on('close', function() {
			if (res.fileStream) {
				res.fileStream.unpipe(this);
				if (this.fileStream.fd) {
					fs.close(this.fileStream.fd);
				}
			}
		});
	}else{
		res.write(buffer, encoding);	
	}
	
}

function writeFileChunk(filePath, stats, res, req){
    //Write head and chunk data - base code from https://stackoverflow.com/questions/37866895/using-nodejs-to-serve-an-mp4-video-file#37867816
    var range = req.headers.range;
    var parts = range.replace(/bytes=/, "").split("-");
    var partialstart = parts[0];
    var partialend = parts[1];
    var total = stats.size;
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

    var fileStream = fs.createReadStream(filePath, {
        start: start,
        end: end
    });
    fileStream.pipe(res);
    res.on('close', function() {
        if (res.fileStream) {
            res.fileStream.unpipe(this);
            if (this.fileStream.fd) {
                fs.close(this.fileStream.fd);
            }
        }
    });
}

function writeFile(filePath, res, req){
    if(fs.existsSync(filePath)){
        var stats = fs.statSync(filePath);
        if(!headWritten){
            if(wantsRange){
                writeFileChunk(filePath, stats, res, req);
            }else{
                console.log("This should be quick");
                //Idea from https://github.com/daspinola/video-stream-sample/blob/master/server.js
                res.writeHead(200, {
                    'Content-Length': stats.size,
                    'Content-Type': mimeType
                });
                headWritten = true;
                
                fs.createReadStream(filePath).pipe(res);
                res.on('close', function() {
                    if (res.fileStream) {
                        res.fileStream.unpipe(this);
                        if (this.fileStream.fd) {
                            fs.close(this.fileStream.fd);
                        }
                    }
                });
            }
        }else{
            res.write(fs.readFileSync(filePath), lastUsedEncoding)
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
	if(wantsRange){
		//Do nothing - stream might still be written	
		return responseText;
	}else{
		if(responseText != null) {
			res.end(responseText + "", getEncoding(encoding));
			return responseText;
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