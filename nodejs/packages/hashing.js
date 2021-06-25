this.mdFiveHash = function(string){
	return require("crypto").createHash("md5").update(string).digest("hex")
}
this.shaFiveTwelveHashWithSalt = function(string, salt){
	return require("crypto").createHmac("sha512", salt).update(string).digest("hex")
}
this.generateSalt = function(length){
	return require("crypto").randomBytes(length).toString('base64');
}

//Nice for smaller files, might cause memory problems for larger ones (that do not fit into RAM)
this.fileMdFiveHash = function(filePath){
	return require("crypto").createHash("md5").update(require("fs").readFileSync(filePath)).digest("hex")
}

GLang.defaultRuntimeEnvironment.setInnerVariable("fileMdFiveHashAsync", {
	value:function(env, args){
		var filePath = args[1].value;
		var callback = args[0];
		
		//Idea from https://stackoverflow.com/questions/18658612/obtaining-the-hash-of-a-file-using-the-stream-capabilities-of-crypto-module-ie
		// the file you want to get the hash    
		var fd = require("fs").createReadStream(filePath);
		var hash = require("crypto").createHash('md5');
		hash.setEncoding('hex');
		
		fd.on('end', function() {
		    hash.end();
		 	GLang.callObject(callback, env, [GLang.stringValue(hash.read())]);
		});
		
		// read all file and pipe it (write it) to the hash object
		fd.pipe(hash);
		
		return GLang.voidValue;
	}
})