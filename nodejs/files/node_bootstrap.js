//Load libraries
var http = require('http');
var fs = require('fs');
var vm = require("vm");

//Read app parameters to get access to the 'app' file path
var debugArg = process.argv[2];
var app;
var debug = false;
if(debugArg === "--debug"){
	app = process.argv[3]
	debug = true;
}else{
	app = process.argv[2]
}

//Before we do anything else: running a nodeApp as root should be prevented until language security is good enough
if(require("os").userInfo().username === "root") {
	console.warn("");
	console.warn("Stopping: You must not run a 'nodeApp' as root, that is dangerous")
	return;
}
// //Also check if the file is executable
// //Idea from https://stackoverflow.com/questions/16258578/how-do-i-check-if-a-file-is-executable-in-node-js
// try{
// 	fs.accessSync(app, fs.constants.X_OK);
// 	//If the catch block below does not get activated, the specified app file is executable
// }catch{
// 	console.warn("");
// 	console.warn("Stopping: A 'nodeApp' has to be executable.")
// 	console.warn("Use 'chmod +x <appFilePath>' if you want to allow running it")
// 	return;
// }


//With the security stuff done, we can initialize the Kalzit environment
function installCalcit(vm, context, fs, bootstrap){
	for(var i = 0; i < bootstrap.length; i++){
		var pmScripts = fs.readFileSync(bootstrap[i] + "/bootstrap/packageManagerScripts.txt", "utf8").trim().split("\n");
		for(var k = 0; k < pmScripts.length; k++){
			if(pmScripts[k]){
				vm.runInNewContext(fs.readFileSync(bootstrap[i] + "/files/" + pmScripts[k].trim(), "utf8"), context, pmScripts[k]);
			}
		}
		
		var platformScripts = fs.readFileSync(bootstrap[i] + "/bootstrap/platformScripts.txt", "utf8").trim().split("\n");
		for(var k = 0; k < platformScripts.length; k++){
			if(platformScripts[k]){
				vm.runInNewContext(fs.readFileSync(bootstrap[i] + "/files/" + platformScripts[k].trim(), "utf8"), context, platformScripts[k]);
			}
		}
	}
}

var context = {require:require, console:console, process:process};
installCalcit(vm, context, fs, ["core", "nodejs"]);
context.GLANG_DEBUG = debug; //Parsed from arguments at the top

//We can now access the GLang object to evaluate the app code!
context.GLang.eval(fs.readFileSync(app, "utf8"));