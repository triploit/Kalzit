//Library imports
var fs = require('fs');
var streamTransform = require("../StreamSectionTransform");

//The main function; defines a WriteHelper
function WriteHelper(res, req) {
	var lastUsedEncoding = "utf8";
	var headWritten = false;
	var mimeType = "*";
	var wantsRange = req.headers.range;
	
	function writeHead(status, headers) {
		if(!headWritten) {
			res.writeHead(status, headers);
			headWritten = true;
			//console.log(new Error("Head written: " + status + ", " + headers).stack);
		}
	}
	
	function getEncoding(encoding){
		return encoding ? (lastUsedEncoding = encoding) : lastUsedEncoding
	}
	
	function write(buffer, encoding){
		if(wantsRange && !headWritten){
			//Write head and chunk data - base code from https://stackoverflow.com/questions/37866895/using-nodejs-to-serve-an-mp4-video-file#37867816
			//The linked StackOverflow page gives https://github.com/tsukhu/rwd-spa-alljs-app/blob/master/routes/video_streamer.js as its source.
		    //That GitHub link points to code that is licensed under the MIT License, which you can find below.
		    //Note: the MIT License cited below does NOT mean that it applies to all of the code in this file - just to the parts that the original author has licensed to you (link above).
		    //More info on the MIT License: https://opensource.stackexchange.com/questions/2644/does-the-mit-licenses-right-to-sublicense-allow-me-to-change-the-license-of-s
		    /*
		    The MIT License (MIT)
		
			Copyright (c) 2014 Tarun Kumar Sukhu (tksukhu@gmail.com)
			
			Permission is hereby granted, free of charge, to any person obtaining a copy
			of this software and associated documentation files (the "Software"), to deal
			in the Software without restriction, including without limitation the rights
			to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
			copies of the Software, and to permit persons to whom the Software is
			furnished to do so, subject to the following conditions:
			
			The above copyright notice and this permission notice shall be included in all
			copies or substantial portions of the Software.
			
			THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
			IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
			FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
			AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
			LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
			OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
			SOFTWARE.
		    */
			var range = req.headers.range;
			var parts = range.replace(/bytes=/, "").split("-");
			var partialstart = parts[0];
			var partialend = parts[1];
			var total = buffer.byteLength;
			var start = parseInt(partialstart, 10);
			var end = partialend ? parseInt(partialend, 10) : total - 1;
			var chunksize = (end - start) + 1;
			writeHead(206, {
				'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunksize,
				'Content-Type': mimeType
			});
			res.willEnd = true;
			
			//Note: this way of writing to the result stream is probably not so good for very big amounts of data.
			res.write(buffer);
			
			//Make sure everything is sent correctly - the connection should not stay open
			res.on('close', function() {
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
	
	//Private
	function writeFileChunk(filePath, stats){
	    //Write head and chunk data - base code from https://github.com/tsukhu/rwd-spa-alljs-app/blob/master/routes/video_streamer.js
	    //That GitHub link points to code that is licensed under the MIT License, which you can find below.
	    //Note: the MIT License cited below does NOT mean that it applies to all of the code in this file - just to the parts that the original author has licensed to you (link above).
	    //More info on the MIT License: https://opensource.stackexchange.com/questions/2644/does-the-mit-licenses-right-to-sublicense-allow-me-to-change-the-license-of-s
	    /*
	    The MIT License (MIT)
	
		Copyright (c) 2014 Tarun Kumar Sukhu (tksukhu@gmail.com)
		
		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:
		
		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.
		
		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	    */
	    
	    var range = req.headers.range;
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
		
		writeHead(206, headers);
	
		res.willEnd = true;
		
		//Generate the stream to serve
	    var readOptions = {
	    	start: start,
			end: end
	    };
	    var servedStream = fs.createReadStream(filePath, readOptions);
	    
	    servedStream.pipe(res);
	    res.on('close', function() {
	        servedStream.unpipe(this);
	        //Ending chunked response for "filePath"
	        res.end();
	    });
	    
	    res.on("error", function(error) {
	    	console.log(error);
	    })
	}
	
	//Private
	function writeFileSaveRam(filePath) {
		var readStream = fs.createReadStream(filePath);
	    readStream.pipe(res);
	
	    res.willEnd = true;
	    res.on('close', function() {
	        if (res.fileStream) {
	            res.fileStream.unpipe(this);
	            if (this.fileStream.fd) {
	                fs.close(this.fileStream.fd);
	            }
	        }
	        //Ending full response for "filePath"
	        res.end();
	    });
	}
	
	
    //Whenever possible, you should use writeExistingFile instead - can be faster if you already know that the file is there
	function writeFile(filePath){
		if(fs.existsSync(filePath)){
	        writeExistingFile(filePath);
	    }else{
	        writeHead(404, {});
	    }
	}

    function writeExistingFile(filePath) {
        var stats = fs.statSync(filePath);
	        if(!headWritten){
	            if(wantsRange){
	            	writeFileChunk(filePath, stats);
	            }else{
	                //Idea from https://github.com/daspinola/video-stream-sample/blob/master/server.js
	                //That GitHub link points to code that is licensed under the MIT License, which you can find below.
		    		//Note: the MIT License cited below does NOT mean that it applies to all of the code in this file - just to the parts that the original author has licensed to you (link above).
		    		//More info on the MIT License: https://opensource.stackexchange.com/questions/2644/does-the-mit-licenses-right-to-sublicense-allow-me-to-change-the-license-of-s
		    		/*
		    		MIT License
	
					Copyright (c) 2017 Diogo Santos
	
					Permission is hereby granted, free of charge, to any person obtaining a copy
					of this software and associated documentation files (the "Software"), to deal
					in the Software without restriction, including without limitation the rights
					to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
					copies of the Software, and to permit persons to whom the Software is
					furnished to do so, subject to the following conditions:
					
					The above copyright notice and this permission notice shall be included in all
					copies or substantial portions of the Software.
					
					THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
					IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
					FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
					AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
					LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
					OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
					SOFTWARE.
		    		*/
	                writeHead(200, {
	                    'Content-Length': stats.size,
	                    'Content-Type': mimeType
	                });
	                
	                writeFileSaveRam(filePath);
	            }
	        }else{
				//Head already written - using writeFileSaveRam (fs.createReadStream). File size is "stats.size" bytes
				console.log("Head already written - using writeFileSaveRam (fs.createReadStream)");
				writeFileSaveRam(filePath);
	        }    
    }
	
	function start(mime){
		mimeType = mime;
	}
	
	function end(responseText, encoding){
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
	
	//Public functions
	this.getEncoding = getEncoding;
	this.write = write;
	this.writeFile = writeFile;
    this.writeExistingFile = writeExistingFile;
	this.end = end;
	this.start = start;
	this.writeHead = writeHead;
}

//Export the WriteHelper function
exports.WriteHelper = WriteHelper;
