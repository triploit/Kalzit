var fs = require("fs");
var crypto = require("crypto");

//The encryption (and deletion of the original, if wanted) happens asynchronously, but the return value is returned without waiting
//Needed configuration fields: key, inputFile, outputFile. deleteInput (1 or 0) is optional. Default is 0
function encryptFileGetInitVector(_config) {
	var key = _config.key;
	var inputFile = _config.input;
	var outputFile = _config.output;
	var deleteInput = _config.deleteInput == 1;
	
	//Idea from https://medium.com/@anned20/encrypting-files-with-nodejs-a54a0736a50a
	const algorithm = "aes-256-ctr";
	
	//Do the actual encryption
	const initVector = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(algorithm, key, initVector);
	
	//Idea from https://medium.com/@brandonstilson/lets-encrypt-files-with-node-85037bea8c0e
	const readStream = fs.createReadStream(inputFile);
	const writeStream = fs.createWriteStream(outputFile);
	
	//Put the readStream through the cipher and then into the writeStream
	var encryptionStream = readStream
		.pipe(cipher)
		.pipe(writeStream);
		
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

GLang.defaultRuntimeEnvironment.setInnerVariable("encryptFileGetInitVector", {value:function(env, args){
	//Make a JS config object from the Kalzit one
	var propOf = GLang.eval("propOf");
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