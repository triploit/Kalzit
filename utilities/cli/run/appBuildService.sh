#The app build service detects changes in your app main source and builds automatically 

script="$(pwd)/utilities/cli/run/appBuildService.txt"
./cli run nodeApp "$script" --app "$1" "${@:1}"