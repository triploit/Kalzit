this.md_five_hash = function(string){
	return require("crypto").createHash("md5").update(string).digest("hex")
}
this.sha_five_twelve_hash_with_salt = function(string, salt){
	return require("crypto").createHmac("sha512", salt).update(string).digest("hex")
}
this.generate_salt = function(length){
	return require("crypto").randomBytes(length).toString('base64');
}

//Nice for smaller files, might cause memory problems for larger ones (that do not fit into RAM)
this.file_md_five_hash = function(filePath){
	return require("crypto").createHash("md5").update(require("fs").readFileSync(filePath)).digest("hex")
}

GLang.defaultRuntimeEnvironment.qdSet("file_md_five_hash_async", {
	value:function(env, args){
		var filePath = args[1].value;
		var callback = args[0];
		
		//We now have to create a checksum
		var hash = require("crypto").createHash("md5");
		
		//To prevent loading the entire file into memory, pipe it into the hash stream
		//We need the file stream to figure out when it ends, so we have to store it
		var fileStream = require("fs").createReadStream(filePath);
		
		//React as soon as the fileStream ends
		//It is important that this is in front of the "pipe" call, otherwise it does not always trigger
		fileStream.on("end", function() {
			//Generate the hash and call the callback
			var hashString = hash.digest("hex");
			GLang.callObject(callback, env, [GLang.stringValue(hashString)]);
		});
		
		fileStream.on("error", function() {
			console.log("AAAAAA");
		});
		
		fileStream.pipe(hash);
		
		return GLang.voidValue;
	}
})
