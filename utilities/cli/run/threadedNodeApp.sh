#Start the node.js process (using nodejs/files/node_bootstrap.js)
#Default file (when none is specified) is the server at nodejs/files/httpServer.k
debug=$1
if [ "$debug" == "--debug" ]
then
	node --inspect nodejs/files/node_bootstrap_threaded.js --debug "${2-nodejs/files/httpServer.k}" "${@:3}"
else
	node nodejs/files/node_bootstrap_threaded.js "${1-nodejs/files/httpServer.k}" "${@:2}"
fi