//Cluster implementation base from https://www.sitepoint.com/how-to-create-a-node-js-cluster-for-speeding-up-your-apps/
var cluster = require('cluster');

if(cluster.isMaster) {
	//This stuff is there to manage multiple threads / processes
    var numWorkers = require('os').cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for(var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
	//This is our actual main code
    //Get content of node_bootstrap.js
	var fs = require("fs");
	var bootstrapCode = fs.readFileSync("./nodejs/files/node_bootstrap.js");
	
	//Run that script as a function (because we are here, we are already in a new thread)
	new Function("require", bootstrapCode)(require);
}