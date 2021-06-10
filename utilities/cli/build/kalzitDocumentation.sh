mkdir ./docs/library &> /dev/null
script="$(pwd)/utilities/cli/build/kalzitDocumentation.txt"
./cli run nodeApp "$script"