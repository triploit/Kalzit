var http = require('http');
var fs = require('fs');
var vm = require("vm");

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

var app = process.argv[2]
context.GLang.eval(fs.readFileSync(app, "utf8"));