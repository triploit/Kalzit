script="$(pwd)/utilities/cli/get/variableDefinition.txt"

name="$1"
shift 1
./cli run nodeApp "$script" --name "$name" --root "$(pwd)" "$@"