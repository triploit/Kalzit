var http = require("http");
var Buffer = require("buffer").Buffer;
var https = require('https');
var fs = require('fs');
var path = require('path');

var lastUsedEncoding = "utf8";

function getEncoding(args){
	return args.length >= 2 ? (lastUsedEncoding = args[1].value) : lastUsedEncoding
}

function getRequestValue(req, res) {
	//Stuff that is needed if the client requests a specific range
	var wantsRange = req.headers.range ? true : false;
	var headWritten = false;
	var mimeType = "*";
	function write(buffer, encoding){
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

    function writeFileChunk(filePath, stats){
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
    function writeFile(filePath){
        if(fs.existsSync(filePath)){
            var stats = fs.statSync(filePath);
            if(!headWritten){
                if(wantsRange){
                    writeFileChunk(filePath, stats);
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
	
	return {value:[
		{value:[{value:"endServing"}, {
			value: function(env, args){
				if(wantsRange){
					//Do nothing - stream might still be written	
					return args.length ? args[0] : {value:0}
				}else{
					if(args.length){
						res.end(args[0].value + "", getEncoding(args));
						return args[0];
					}else{
						res.end();
						return {value:0}
					}
				}
			}, display: "function"
		}]},
		{value:[{value:"write"}, {
			value: function(env, args){
				var encoding = getEncoding(args);
				write(Buffer.from(args[0].value + "", encoding), encoding);
				return args[0];
			}, display: "function"
		}]},
		{value:[{value:"writeFile"}, {
			value: function(env, args){
				writeFile(args[0].value + "");
				return args[0];
			}, display: "function"
		}]},
		{value:[{value:"writeBytes"}, {
			value: function(env, args){
				var numberArray = [];
				for(var i = 0; i < args[0].value.length; i++){
					numberArray.push(args[0].value[i].value);
				}
				write(Buffer.from(numberArray), getEncoding(args));
				return args[0];
			}, display: "function"
		}]},
		{value:[{value:"writeRaw"}, {
			value: function(env, args){
				write(args[0].value, getEncoding(args));
				return args[0];
			}, display: "function"
		}]},
		{value:[{value:"startServing"}, {
			value: function(env, args){
				if(wantsRange){
					mimeType = args[0].value + "";
				}else if(!headWritten){
					res.writeHead(200, {"Content-Type": args[0].value + ""});
					headWritten = true;
				}
				return args[0];
			}, display: "function"
		}]},
		{value:[{value:"respondCode"}, {
			value: function(env, args){
				res.writeHead(args[0].value, {});
				return args[0];
			}, display: "function"
		}]},
		{value:[{value:"setEncoding"}, {
			value: function(env, args){
				lastUsedEncoding = args[0].value;
				return args[0];
			}, display: "function"
		}]},
		{value:[{value:"cookie"}, GLang.stringValue(req.headers.cookie)]},
		{value:[{value:"getHeader"}, {
			value: function(env, args){
				return GLang.stringValue(req.headers[args[0].value]);
			}, display: "function"
		}]},
		{value:[{value:"url"}, GLang.stringValue(req.url)]},
		{value:[{value:"host"}, GLang.stringValue(req.headers.host)]}
	]};
};
			
GLang.defaultRuntimeEnvironment.setInnerVariable("httpServer", {value:function(env, args){
	http.createServer(function (req, res) {
		GLang.callObject(args[0], env, [getRequestValue(req, res)]);
	}).listen(args[1].value);
	return GLang.voidValue;
}, display:"function"})

GLang.defaultRuntimeEnvironment.setInnerVariable("httpsServer", {value:function(env, args){
	var options = {
	  key: fs.readFileSync('./nogit/https/key.pem'),
	  cert: fs.readFileSync('./nogit/https/cert.pem')
	};
	
	https.createServer(options, function (req, res) {
	  GLang.callObject(args[0], env, [getRequestValue(req, res)]);
	}).listen(args[1].value);
	return GLang.voidValue;
}, display:"function"})
