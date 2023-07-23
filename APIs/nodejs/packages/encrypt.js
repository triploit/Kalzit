var fs = require("fs");
var crypto = require("crypto");

//The encryption (and deletion of the original, if wanted) happens asynchronously, but the return value is returned without waiting
//Needed configuration fields: key, inputFile, outputFile. deleteInput (1 or 0) is optional. Default is 0
function encryptFileGetInitVector(_config) {
	//"_config.key" and "_config.output" are used directly in the main code, because they are only needed once
	var inputFile = _config.input;
	var deleteInput = _config.deleteInput == 1;
	
	//Do the actual encryption
	const initVector = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv("aes-256-ctr", _config.key, initVector);
	
	//Put the readStream through the cipher and then into the writeStream
	var encryptionStream = fs.createReadStream(inputFile)
		.pipe(cipher)
		.pipe(fs.createWriteStream(_config.output));
		
	//Get notified when the encryption is finished
	encryptionStream.on("finish", function(){
		//If wanted, delete the input file
		if(deleteInput) {
			//TODO: Make this more secure (not easy to recover)
			fs.unlinkSync(inputFile);
		}
	});
	
	return initVector;
}

GLang.dr.qdSet("encrypt_file_get_init_vector", {value:function(env, args){
	//Make a JS config object from the Kalzit one
	var propOf = GLang.dr.resolveName("prop_of");
	var configObject = args[0];
	var jsConfig = {
		key: GLang.callObject(propOf, env, [
			GLang.stringValue("key"), configObject
		]).value,
		output: GLang.callObject(propOf, env, [
			GLang.stringValue("output"), configObject
		]).value,
		input: GLang.callObject(propOf, env, [
			GLang.stringValue("input"), configObject
		]).value,
		deleteInput: GLang.callObject(propOf, env, [
			GLang.stringValue("deleteInput"), configObject
		]).value == 1
	}
	
	//Do the thing
	return GLang.stringValue(encryptFileGetInitVector(jsConfig));
}});
