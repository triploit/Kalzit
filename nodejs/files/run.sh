cd ../../
node --inspect --max_old_space_size=400 nodejs/files/node_bootstrap.js "${1-nodejs/files/httpServer}" "${@:2}"