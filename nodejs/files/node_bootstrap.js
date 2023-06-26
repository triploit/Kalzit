"use strict";

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


//With the security stuff done, we can initialize the Kalzit environment
function installCalcit(vm, context, fs, bootstrap){
	for(var i = 0; i < bootstrap.length; i++){
		var pmScripts = fs.readFileSync(bootstrap[i] + "/bootstrap/packageManagerScripts.txt", "utf8").trim().split("\n");
		for(var k = 0; k < pmScripts.length; k++){
			if(pmScripts[k]){
				vm.runInNewContext("'use strict';" + fs.readFileSync(bootstrap[i] + "/files/" + pmScripts[k].trim(), "utf8"), context, pmScripts[k]);
			}
		}
		
		var platformScripts = fs.readFileSync(bootstrap[i] + "/bootstrap/platformScripts.txt", "utf8").trim().split("\n");
		for(var k = 0; k < platformScripts.length; k++){
			if(platformScripts[k]){
				vm.runInNewContext("'use strict';" + fs.readFileSync(bootstrap[i] + "/files/" + platformScripts[k].trim(), "utf8"), context, platformScripts[k]);
			}
		}
	}
}

var context = {require:require, console:console, process:process};
context.GLANG_DEBUG = debug; //Parsed from arguments at the top
context.GLANG_TREE_GENERATOR_INCLUDED = true;
installCalcit(vm, context, fs, ["core", "nodejs"]);

//We can now access the GLang object to evaluate the app code!
context.GLang.eval(fs.readFileSync(app, "utf8"));
