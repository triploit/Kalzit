mkdir ./docs/jsLibrary &> /dev/null
script="$(pwd)/utilities/cli/build/mergedLibraries.txt"
./cli run nodeApp "$script" --kalzit-root-folder "$(pwd)"