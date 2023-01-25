mkdir ./docs/jsLibrary &> /dev/null
script="$(pwd)/utilities/cli/run/testFile.txt"
./cli run nodeApp "$script" --file "$1" "${@:1}"