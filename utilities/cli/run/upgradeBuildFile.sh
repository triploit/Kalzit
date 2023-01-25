file=$1

scriptPath="$(pwd)/utilities/cli/run/upgradeBuildFile.txt"

arguments=$@
./cli run nodeApp "$scriptPath" --build-file "$file" $arguments