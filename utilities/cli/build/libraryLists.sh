mkdir ./docs/jsLibrary &> /dev/null
script="$(pwd)/utilities/cli/build/libraryLists.txt"
./cli run nodeApp "$script" --kalzit-root-folder "$(pwd)"