cd ../../
debug=$1
if [ "$debug" == "--debug" ]
then
	node --inspect --max_old_space_size=400 nodejs/files/node_bootstrap.js --debug "${2-nodejs/files/httpServer}" "${@:3}"
else
	node --max_old_space_size=400 nodejs/files/node_bootstrap.js "${1-nodejs/files/httpServer}" "${@:2}"
fi