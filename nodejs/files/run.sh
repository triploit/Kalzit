cd ../../
debug=$1
if [ "$debug" == "--debug" ]
then
	node --inspect --max_old_space_size=400 nodejs/files/node_bootstrap.js --debug "${2-nodejs/files/httpServer.k}" "${@:3}"
else
	node --max_old_space_size=400 nodejs/files/node_bootstrap.js "${1-nodejs/files/httpServer.k}" "${@:2}"
fi