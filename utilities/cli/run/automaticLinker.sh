mkdir ./docs/jsLibrary &> /dev/null
script="$(pwd)/utilities/cli/run/automaticLinker.txt"
./cli run nodeApp "$script" --root-folder "$(pwd)" --folder "$1"