mkdir ./docs/jsLibrary &> /dev/null
script="$(pwd)/utilities/cli/build/jsDocumentation.txt"
./cli run nodeApp "$script"